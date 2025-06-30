/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * RHY Supplier Portal - Session Management System
 * Enterprise-grade session management with Redis caching and database persistence
 * Supports multi-warehouse operations and comprehensive session analytics
 */

import { SecurityContext } from '@/types/auth'
import { v4 as uuidv4 } from 'uuid'

// Dynamic imports for server-side only modules
let Redis: any = null
let rhyPrisma: any = null
let generateSessionId: any = null
let logAuthEvent: any = null

// Initialize server-side dependencies only when needed
async function initializeServerDependencies() {
  if (typeof window !== 'undefined') return // Skip on client side
  
  try {
    if (!Redis) {
      const ioredis = await import('ioredis')
      Redis = ioredis.Redis || ioredis.default
    }
    if (!rhyPrisma) {
      const db = await import('./rhy-database')
      rhyPrisma = db.rhyPrisma
    }
    if (!generateSessionId) {
      const security = await import('./security')
      generateSessionId = security.generateSessionId
      logAuthEvent = security.logAuthEvent
    }
  } catch (error) {
    console.warn('Server dependencies not available:', error)
  }
}

// ================================
// TYPES & INTERFACES
// ================================

export interface SessionData {
  id: string
  supplierId: string
  warehouse?: 'US' | 'JP' | 'EU' | 'AU'
  permissions: string[]
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'
  deviceFingerprint?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  lastUsedAt: Date
  expiresAt: Date
  metadata?: Record<string, any>
}

export interface SessionManager {
  createSession(sessionId: string, data: Partial<SessionData>): Promise<void>
  getSession(sessionId: string): Promise<SessionData | null>
  updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void>
  deleteSession(sessionId: string): Promise<void>
  deleteSessions(supplierId: string): Promise<void>
  refreshSession(sessionId: string): Promise<SessionData | null>
  getActiveSessions(supplierId: string): Promise<SessionData[]>
  cleanup(): Promise<void>
  getSessionStats(): Promise<SessionStats>
}

export interface SessionStats {
  totalSessions: number
  activeSessions: number
  sessionsToday: number
  avgSessionDuration: number
  sessionsByWarehouse: Record<string, number>
  sessionsByTier: Record<string, number>
}

// ================================
// REDIS CONFIGURATION
// ================================

let redis: any = null

async function getRedisClient(): Promise<any> {
  if (typeof window !== 'undefined') return null // Skip on client side
  
  if (redis) return redis

  await initializeServerDependencies()
  if (!Redis) return null

  const redisUrl = process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING
  
  if (!redisUrl) {
    console.warn('⚠️ Redis URL not configured, using in-memory session storage')
    return null
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      connectTimeout: 10000,
      lazyConnect: true,
      family: 4,
      keyPrefix: 'rhy:session:',
      db: 0
    })

    redis.on('error', (err: any) => {
      console.error('Redis connection error:', err)
      redis = null
    })

    redis.on('connect', () => {
      console.log('✅ Connected to Redis for session management')
    })

    return redis
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
    return null
  }
}

// ================================
// IN-MEMORY FALLBACK
// ================================

const memoryStore = new Map<string, SessionData>()

class MemorySessionManager implements SessionManager {
  async createSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const session: SessionData = {
      id: sessionId,
      supplierId: data.supplierId!,
      warehouse: data.warehouse,
      permissions: data.permissions || [],
      tier: data.tier || 'STANDARD',
      deviceFingerprint: data.deviceFingerprint,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      createdAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + (8 * 60 * 60 * 1000)), // 8 hours
      metadata: data.metadata
    }

    memoryStore.set(sessionId, session)

    // Also store in database
    try {
      await initializeServerDependencies()
      if (rhyPrisma) {
        await rhyPrisma.rHYSession.create({
          data: {
            id: sessionId,
            supplierId: session.supplierId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            warehouse: session.warehouse,
            deviceFingerprint: session.deviceFingerprint,
            expiresAt: session.expiresAt,
            lastUsedAt: session.lastUsedAt
          }
        })
      }
    } catch (error) {
      console.error('Failed to store session in database:', error)
    }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const session = memoryStore.get(sessionId)
    
    if (!session) {
      return null
    }

    if (session.expiresAt < new Date()) {
      memoryStore.delete(sessionId)
      return null
    }

    return session
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const session = memoryStore.get(sessionId)
    
    if (session) {
      Object.assign(session, updates, { lastUsedAt: new Date() })
      memoryStore.set(sessionId, session)

      // Update database
      try {
        await initializeServerDependencies()
        if (rhyPrisma) {
          await rhyPrisma.rHYSession.update({
            where: { id: sessionId },
            data: { lastUsedAt: new Date() }
          })
        }
      } catch (error) {
        console.error('Failed to update session in database:', error)
      }
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    memoryStore.delete(sessionId)

    // Delete from database
    try {
      await initializeServerDependencies()
      if (rhyPrisma) {
        await rhyPrisma.rHYSession.update({
          where: { id: sessionId },
          data: { revoked: true }
        })
      }
    } catch (error) {
      console.error('Failed to revoke session in database:', error)
    }
  }

  async deleteSessions(supplierId: string): Promise<void> {
    for (const [sessionId, session] of memoryStore.entries()) {
      if (session.supplierId === supplierId) {
        memoryStore.delete(sessionId)
      }
    }

    // Revoke all sessions in database
    try {
      await initializeServerDependencies()
      if (rhyPrisma) {
        await rhyPrisma.rHYSession.updateMany({
          where: { supplierId },
          data: { revoked: true }
        })
      }
    } catch (error) {
      console.error('Failed to revoke sessions in database:', error)
    }
  }

  async refreshSession(sessionId: string): Promise<SessionData | null> {
    const session = await this.getSession(sessionId)
    
    if (session) {
      session.expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000)) // Extend 8 hours
      session.lastUsedAt = new Date()
      await this.updateSession(sessionId, session)
      return session
    }

    return null
  }

  async getActiveSessions(supplierId: string): Promise<SessionData[]> {
    const sessions: SessionData[] = []
    
    for (const session of memoryStore.values()) {
      if (session.supplierId === supplierId && session.expiresAt > new Date()) {
        sessions.push(session)
      }
    }

    return sessions.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
  }

  async cleanup(): Promise<void> {
    const now = new Date()
    const expiredSessions: string[] = []

    for (const [sessionId, session] of memoryStore.entries()) {
      if (session.expiresAt < now) {
        expiredSessions.push(sessionId)
      }
    }

    for (const sessionId of expiredSessions) {
      memoryStore.delete(sessionId)
    }

    console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`)
  }

  async getSessionStats(): Promise<SessionStats> {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    let totalSessions = 0
    let activeSessions = 0
    let sessionsToday = 0
    let totalDuration = 0
    const sessionsByWarehouse: Record<string, number> = {}
    const sessionsByTier: Record<string, number> = {}

    for (const session of memoryStore.values()) {
      totalSessions++
      
      if (session.expiresAt > now) {
        activeSessions++
      }
      
      if (session.createdAt >= today) {
        sessionsToday++
      }

      const duration = session.lastUsedAt.getTime() - session.createdAt.getTime()
      totalDuration += duration

      if (session.warehouse) {
        sessionsByWarehouse[session.warehouse] = (sessionsByWarehouse[session.warehouse] || 0) + 1
      }

      sessionsByTier[session.tier] = (sessionsByTier[session.tier] || 0) + 1
    }

    return {
      totalSessions,
      activeSessions,
      sessionsToday,
      avgSessionDuration: totalSessions > 0 ? totalDuration / totalSessions : 0,
      sessionsByWarehouse,
      sessionsByTier
    }
  }
}

// ================================
// REDIS SESSION MANAGER
// ================================

class RedisSessionManager implements SessionManager {
  private redis: any

  constructor(redis: any) {
    this.redis = redis
  }

  async createSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const session: SessionData = {
      id: sessionId,
      supplierId: data.supplierId!,
      warehouse: data.warehouse,
      permissions: data.permissions || [],
      tier: data.tier || 'STANDARD',
      deviceFingerprint: data.deviceFingerprint,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      createdAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + (8 * 60 * 60 * 1000)), // 8 hours
      metadata: data.metadata
    }

    const sessionKey = `session:${sessionId}`
    const userSessionsKey = `user:${data.supplierId}:sessions`
    const expirationTime = 8 * 60 * 60 // 8 hours in seconds

    try {
      // Store session data
      await this.redis.multi()
        .hset(sessionKey, this.sessionToHash(session))
        .expire(sessionKey, expirationTime)
        .sadd(userSessionsKey, sessionId)
        .expire(userSessionsKey, expirationTime)
        .exec()

      // Store in database
      await initializeServerDependencies()
      if (rhyPrisma) {
        await rhyPrisma.rHYSession.create({
          data: {
            id: sessionId,
            supplierId: session.supplierId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            warehouse: session.warehouse,
            deviceFingerprint: session.deviceFingerprint,
            expiresAt: session.expiresAt,
            lastUsedAt: session.lastUsedAt
          }
        })
      }
    } catch (error) {
      console.error('Failed to create session:', error)
      throw error
    }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionKey = `session:${sessionId}`
      const sessionData = await this.redis.hgetall(sessionKey)

      if (!sessionData.id) {
        return null
      }

      const session = this.hashToSession(sessionData)
      
      if (session.expiresAt < new Date()) {
        await this.deleteSession(sessionId)
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    try {
      const session = await this.getSession(sessionId)
      
      if (session) {
        Object.assign(session, updates, { lastUsedAt: new Date() })
        
        const sessionKey = `session:${sessionId}`
        await this.redis.hset(sessionKey, this.sessionToHash(session))

        // Update database
        await initializeServerDependencies()
        if (rhyPrisma) {
          await rhyPrisma.rHYSession.update({
            where: { id: sessionId },
            data: { lastUsedAt: new Date() }
          })
        }
      }
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId)
      
      if (session) {
        const sessionKey = `session:${sessionId}`
        const userSessionsKey = `user:${session.supplierId}:sessions`

        await this.redis.multi()
          .del(sessionKey)
          .srem(userSessionsKey, sessionId)
          .exec()

        // Revoke in database
        await initializeServerDependencies()
        if (rhyPrisma) {
          await rhyPrisma.rHYSession.update({
            where: { id: sessionId },
            data: { revoked: true }
          })
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  async deleteSessions(supplierId: string): Promise<void> {
    try {
      const userSessionsKey = `user:${supplierId}:sessions`
      const sessionIds = await this.redis.smembers(userSessionsKey)

      if (sessionIds.length > 0) {
        const pipeline = this.redis.multi()
        
        for (const sessionId of sessionIds) {
          pipeline.del(`session:${sessionId}`)
        }
        
        pipeline.del(userSessionsKey)
        await pipeline.exec()

        // Revoke all sessions in database
        await initializeServerDependencies()
        if (rhyPrisma) {
          await rhyPrisma.rHYSession.updateMany({
            where: { supplierId },
            data: { revoked: true }
          })
        }
      }
    } catch (error) {
      console.error('Failed to delete sessions:', error)
    }
  }

  async refreshSession(sessionId: string): Promise<SessionData | null> {
    try {
      const session = await this.getSession(sessionId)
      
      if (session) {
        session.expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000))
        session.lastUsedAt = new Date()
        
        const sessionKey = `session:${sessionId}`
        await this.redis.multi()
          .hset(sessionKey, this.sessionToHash(session))
          .expire(sessionKey, 8 * 60 * 60)
          .exec()

        return session
      }

      return null
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    }
  }

  async getActiveSessions(supplierId: string): Promise<SessionData[]> {
    try {
      const userSessionsKey = `user:${supplierId}:sessions`
      const sessionIds = await this.redis.smembers(userSessionsKey)
      const sessions: SessionData[] = []

      for (const sessionId of sessionIds) {
        const session = await this.getSession(sessionId)
        if (session) {
          sessions.push(session)
        }
      }

      return sessions.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
    } catch (error) {
      console.error('Failed to get active sessions:', error)
      return []
    }
  }

  async cleanup(): Promise<void> {
    try {
      // Redis TTL handles automatic cleanup
      const info = await this.redis.info('keyspace')
      console.log('🔄 Redis session cleanup - keyspace info:', info)
    } catch (error) {
      console.error('Failed to cleanup sessions:', error)
    }
  }

  async getSessionStats(): Promise<SessionStats> {
    try {
      const keys = await this.redis.keys('session:*')
      const sessions: SessionData[] = []

      for (const key of keys) {
        const sessionData = await this.redis.hgetall(key)
        if (sessionData.id) {
          sessions.push(this.hashToSession(sessionData))
        }
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      let activeSessions = 0
      let sessionsToday = 0
      let totalDuration = 0
      const sessionsByWarehouse: Record<string, number> = {}
      const sessionsByTier: Record<string, number> = {}

      for (const session of sessions) {
        if (session.expiresAt > now) {
          activeSessions++
        }
        
        if (session.createdAt >= today) {
          sessionsToday++
        }

        const duration = session.lastUsedAt.getTime() - session.createdAt.getTime()
        totalDuration += duration

        if (session.warehouse) {
          sessionsByWarehouse[session.warehouse] = (sessionsByWarehouse[session.warehouse] || 0) + 1
        }

        sessionsByTier[session.tier] = (sessionsByTier[session.tier] || 0) + 1
      }

      return {
        totalSessions: sessions.length,
        activeSessions,
        sessionsToday,
        avgSessionDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
        sessionsByWarehouse,
        sessionsByTier
      }
    } catch (error) {
      console.error('Failed to get session stats:', error)
      return {
        totalSessions: 0,
        activeSessions: 0,
        sessionsToday: 0,
        avgSessionDuration: 0,
        sessionsByWarehouse: {},
        sessionsByTier: {}
      }
    }
  }

  private sessionToHash(session: SessionData): Record<string, string> {
    return {
      id: session.id,
      supplierId: session.supplierId,
      warehouse: session.warehouse || '',
      permissions: JSON.stringify(session.permissions),
      tier: session.tier,
      deviceFingerprint: session.deviceFingerprint || '',
      ipAddress: session.ipAddress || '',
      userAgent: session.userAgent || '',
      createdAt: session.createdAt.toISOString(),
      lastUsedAt: session.lastUsedAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      metadata: JSON.stringify(session.metadata || {})
    }
  }

  private hashToSession(hash: Record<string, string>): SessionData {
    return {
      id: hash.id,
      supplierId: hash.supplierId,
      warehouse: hash.warehouse as any || undefined,
      permissions: JSON.parse(hash.permissions || '[]'),
      tier: hash.tier as any || 'STANDARD',
      deviceFingerprint: hash.deviceFingerprint || undefined,
      ipAddress: hash.ipAddress || undefined,
      userAgent: hash.userAgent || undefined,
      createdAt: new Date(hash.createdAt),
      lastUsedAt: new Date(hash.lastUsedAt),
      expiresAt: new Date(hash.expiresAt),
      metadata: JSON.parse(hash.metadata || '{}')
    }
  }
}

// ================================
// SESSION MANAGER FACTORY
// ================================

export async function createSessionManager(): Promise<SessionManager> {
  const redis = await getRedisClient()
  
  if (redis) {
    return new RedisSessionManager(redis)
  } else {
    return new MemorySessionManager()
  }
}

// ================================
// SESSION UTILITIES
// ================================

export async function validateSessionAccess(
  sessionId: string, 
  warehouse?: string,
  permissions?: string[]
): Promise<{
  valid: boolean
  session?: SessionData
  error?: string
}> {
  const sessionManager = await createSessionManager()
  
  try {
    const session = await sessionManager.getSession(sessionId)
    
    if (!session) {
      return {
        valid: false,
        error: 'Session not found or expired'
      }
    }

    // Check warehouse access
    if (warehouse && session.warehouse !== warehouse) {
      return {
        valid: false,
        error: 'Warehouse access denied'
      }
    }

    // Check permissions
    if (permissions && permissions.length > 0) {
      const hasPermissions = permissions.every(permission =>
        session.permissions.includes(permission)
      )
      
      if (!hasPermissions) {
        return {
          valid: false,
          error: 'Insufficient permissions'
        }
      }
    }

    return {
      valid: true,
      session
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return {
      valid: false,
      error: 'Session validation failed'
    }
  }
}

export async function extendSession(sessionId: string, hours: number = 8): Promise<boolean> {
  const sessionManager = await createSessionManager()
  
  try {
    const session = await sessionManager.getSession(sessionId)
    
    if (session) {
      session.expiresAt = new Date(Date.now() + (hours * 60 * 60 * 1000))
      await sessionManager.updateSession(sessionId, session)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Failed to extend session:', error)
    return false
  }
}

export async function trackSessionActivity(
  sessionId: string,
  activity: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Log activity for analytics
    console.log(`📊 Session Activity: ${sessionId} - ${activity}`, metadata)
    
    // Update session last used time
    const sessionManager = await createSessionManager()
    await sessionManager.updateSession(sessionId, { lastUsedAt: new Date() })
  } catch (error) {
    console.error('Failed to track session activity:', error)
  }
}

// ================================
// CLEANUP & MAINTENANCE
// ================================

// Periodic cleanup function
export async function scheduleSessionCleanup(): Promise<void> {
  const sessionManager = await createSessionManager()
  
  // Run cleanup every 30 minutes
  setInterval(async () => {
    try {
      await sessionManager.cleanup()
    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }, 30 * 60 * 1000)
}

// Security monitoring
export async function detectSuspiciousActivity(
  supplierId: string,
  securityContext: SecurityContext
): Promise<{
  suspicious: boolean
  reasons: string[]
  recommendedAction: 'allow' | 'require_mfa' | 'block'
}> {
  const sessionManager = await createSessionManager()
  const sessions = await sessionManager.getActiveSessions(supplierId)
  
  const reasons: string[] = []
  let suspicious = false

  // Check for multiple concurrent sessions
  if (sessions.length > 5) {
    suspicious = true
    reasons.push('Multiple concurrent sessions detected')
  }

  // Check for sessions from different locations
  const uniqueIPs = new Set(sessions.map(s => s.ipAddress).filter(Boolean))
  if (uniqueIPs.size > 3) {
    suspicious = true
    reasons.push('Sessions from multiple IP addresses')
  }

  // Check for rapid session creation
  const recentSessions = sessions.filter(s => 
    s.createdAt > new Date(Date.now() - 60 * 60 * 1000) // Last hour
  )
  if (recentSessions.length > 10) {
    suspicious = true
    reasons.push('Rapid session creation detected')
  }

  let recommendedAction: 'allow' | 'require_mfa' | 'block' = 'allow'
  
  if (suspicious) {
    if (reasons.length >= 2) {
      recommendedAction = 'block'
    } else {
      recommendedAction = 'require_mfa'
    }
  }

  return {
    suspicious,
    reasons,
    recommendedAction
  }
}

// Export singleton instance factory
export const getSessionManager = createSessionManager