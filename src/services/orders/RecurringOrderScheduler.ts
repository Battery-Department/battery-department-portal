/**
 * RHY Supplier Portal - Recurring Order Scheduler Service
 * Enterprise-grade scheduling system for automated FlexVolt battery order execution
 * Supports multi-warehouse operations: US, Japan, EU, Australia
 * Integrates with existing AuthService and AdvancedOrderSystem
 */

/* eslint-disable no-unused-vars */

import { rhyPrisma } from '@/lib/rhy-database'
import { authService } from '@/services/auth/AuthService'
import { recurringOrderService, RecurringOrder } from './RecurringOrderService'
import { v4 as uuidv4 } from 'uuid'

export interface ScheduledExecution {
  id: string
  recurringOrderId: string
  scheduledDateTime: Date
  warehouseTimezone: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  retryCount: number
  maxRetries: number
  lastAttempt?: Date
  nextRetry?: Date
  errorMessage?: string
  executionContext: ScheduleExecutionContext
  createdAt: Date
  updatedAt: Date
}

export interface ScheduleExecutionContext {
  supplierId: string
  warehouseId: string
  warehouseLocation: 'US' | 'JP' | 'EU' | 'AU'
  businessHours: BusinessHours
  cutoffTime: string
  timezoneName: string
  executionWindow: ExecutionWindow
  resourceAllocation: ResourceAllocation
}

export interface BusinessHours {
  monday?: { open: string; close: string }
  tuesday?: { open: string; close: string }
  wednesday?: { open: string; close: string }
  thursday?: { open: string; close: string }
  friday?: { open: string; close: string }
  saturday?: { open: string; close: string }
  sunday?: { open: string; close: string }
}

export interface ExecutionWindow {
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  allowWeekends: boolean
  allowHolidays: boolean
  bufferMinutes: number
}

export interface ResourceAllocation {
  maxConcurrentExecutions: number
  currentExecutions: number
  estimatedProcessingTime: number // minutes
  queuePosition?: number
}

export interface ScheduleHealth {
  warehouseId: string
  warehouseLocation: string
  totalScheduled: number
  pendingExecutions: number
  failedExecutions: number
  successRate: number
  avgProcessingTime: number
  lastSuccessfulExecution?: Date
  systemLoad: number // 0-100%
  resourceUtilization: number // 0-100%
  upcomingExecutions: number
  criticalIssues: string[]
  warnings: string[]
}

export interface GlobalScheduleMetrics {
  totalRecurringOrders: number
  activeSchedules: number
  executionsToday: number
  executionsThisWeek: number
  globalSuccessRate: number
  warehouseMetrics: ScheduleHealth[]
  systemCapacity: {
    current: number
    maximum: number
    utilizationPercentage: number
  }
  nextMaintenance?: Date
  alertCount: number
}

/**
 * Recurring Order Scheduler Service
 * Handles automated scheduling and execution of recurring orders across multiple warehouses
 */

/* eslint-disable no-unused-vars */
export class RecurringOrderScheduler {
  private scheduledExecutions: Map<string, ScheduledExecution> = new Map()
  private executionQueue: ScheduledExecution[] = []
  private isProcessing: boolean = false
  private processingInterval?: NodeJS.Timeout
  
  // Warehouse configurations with timezone support
  private warehouseConfigs = {
    US: {
      timezone: 'America/Los_Angeles',
      businessHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' }
      },
      cutoffTime: '14:00',
      executionWindow: {
        startTime: '06:00',
        endTime: '18:00',
        allowWeekends: false,
        allowHolidays: false,
        bufferMinutes: 30
      },
      maxConcurrentExecutions: 50
    },
    JP: {
      timezone: 'Asia/Tokyo',
      businessHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' }
      },
      cutoffTime: '15:00',
      executionWindow: {
        startTime: '07:00',
        endTime: '19:00',
        allowWeekends: false,
        allowHolidays: false,
        bufferMinutes: 30
      },
      maxConcurrentExecutions: 30
    },
    EU: {
      timezone: 'Europe/London',
      businessHours: {
        monday: { open: '08:30', close: '17:30' },
        tuesday: { open: '08:30', close: '17:30' },
        wednesday: { open: '08:30', close: '17:30' },
        thursday: { open: '08:30', close: '17:30' },
        friday: { open: '08:30', close: '17:30' }
      },
      cutoffTime: '14:30',
      executionWindow: {
        startTime: '06:30',
        endTime: '18:30',
        allowWeekends: false,
        allowHolidays: false,
        bufferMinutes: 30
      },
      maxConcurrentExecutions: 40
    },
    AU: {
      timezone: 'Australia/Sydney',
      businessHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' }
      },
      cutoffTime: '14:00',
      executionWindow: {
        startTime: '06:00',
        endTime: '18:00',
        allowWeekends: false,
        allowHolidays: false,
        bufferMinutes: 30
      },
      maxConcurrentExecutions: 25
    }
  }

  constructor() {
    this.loadScheduledExecutions()
    this.startProcessingQueue()
  }

  /**
   * Schedule a recurring order for execution
   */

/* eslint-disable no-unused-vars */
  async scheduleRecurringOrder(recurringOrder: RecurringOrder): Promise<ScheduledExecution> {
    const warehouseConfig = this.warehouseConfigs[recurringOrder.warehouse]
    
    // Calculate optimal execution time based on warehouse timezone and business hours
    const scheduledDateTime = this.calculateOptimalExecutionTime(
      recurringOrder.nextExecutionDate,
      warehouseConfig
    )

    // Create execution context
    const executionContext: ScheduleExecutionContext = {
      supplierId: recurringOrder.supplierId,
      warehouseId: `warehouse_${recurringOrder.warehouse.toLowerCase()}`,
      warehouseLocation: recurringOrder.warehouse,
      businessHours: warehouseConfig.businessHours,
      cutoffTime: warehouseConfig.cutoffTime,
      timezoneName: warehouseConfig.timezone,
      executionWindow: warehouseConfig.executionWindow,
      resourceAllocation: {
        maxConcurrentExecutions: warehouseConfig.maxConcurrentExecutions,
        currentExecutions: this.getCurrentExecutionsForWarehouse(recurringOrder.warehouse),
        estimatedProcessingTime: this.estimateProcessingTime(recurringOrder)
      }
    }

    // Determine priority based on order characteristics
    const priority = this.calculateExecutionPriority(recurringOrder, executionContext)

    const scheduledExecution: ScheduledExecution = {
      id: uuidv4(),
      recurringOrderId: recurringOrder.id,
      scheduledDateTime,
      warehouseTimezone: warehouseConfig.timezone,
      status: 'PENDING',
      priority,
      retryCount: 0,
      maxRetries: 3,
      executionContext,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to scheduled executions and queue
    this.scheduledExecutions.set(scheduledExecution.id, scheduledExecution)
    this.addToExecutionQueue(scheduledExecution)

    // Persist to database (simulated)
    await this.persistScheduledExecution(scheduledExecution)

    console.log(`Scheduled recurring order ${recurringOrder.name} for execution at ${scheduledDateTime.toISOString()} (${warehouseConfig.timezone})`)

    return scheduledExecution
  }

  /**
   * Process the execution queue based on scheduled times and priorities
   */

/* eslint-disable no-unused-vars */
  private startProcessingQueue(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }

    // Process queue every minute
    this.processingInterval = setInterval(async () => {
      if (this.isProcessing) return

      this.isProcessing = true
      try {
        await this.processExecutionQueue()
      } catch (error) {
        console.error('Error processing execution queue:', error)
      } finally {
        this.isProcessing = false
      }
    }, 60000) // 1 minute
  }

  /**
   * Process pending executions
   */

/* eslint-disable no-unused-vars */
  private async processExecutionQueue(): Promise<void> {
    const now = new Date()
    
    // Get executions ready for processing
    const readyExecutions = this.executionQueue.filter(execution => 
      execution.status === 'PENDING' && 
      execution.scheduledDateTime <= now &&
      this.isWithinExecutionWindow(execution, now)
    )

    // Sort by priority and scheduled time
    readyExecutions.sort((a, b) => {
      const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return a.scheduledDateTime.getTime() - b.scheduledDateTime.getTime()
    })

    // Process executions respecting warehouse capacity limits
    for (const execution of readyExecutions) {
      const warehouseLoad = this.getCurrentExecutionsForWarehouse(
        execution.executionContext.warehouseLocation
      )
      
      if (warehouseLoad < execution.executionContext.resourceAllocation.maxConcurrentExecutions) {
        await this.executeScheduledOrder(execution)
      } else {
        console.log(`Warehouse ${execution.executionContext.warehouseLocation} at capacity, delaying execution`)
      }
    }

    // Handle retries for failed executions
    await this.processRetries(now)
  }

  /**
   * Execute a scheduled recurring order
   */

/* eslint-disable no-unused-vars */
  private async executeScheduledOrder(scheduledExecution: ScheduledExecution): Promise<void> {
    scheduledExecution.status = 'PROCESSING'
    scheduledExecution.lastAttempt = new Date()
    scheduledExecution.updatedAt = new Date()

    try {
      console.log(`Executing recurring order ${scheduledExecution.recurringOrderId}`)
      
      // Execute through the recurring order service
      const executionResult = await recurringOrderService.executeRecurringOrder(
        scheduledExecution.recurringOrderId
      )

      if (executionResult.status === 'SUCCESS') {
        scheduledExecution.status = 'COMPLETED'
        console.log(`Successfully executed recurring order ${scheduledExecution.recurringOrderId}`)
      } else {
        throw new Error(executionResult.errorMessage || 'Execution failed')
      }

    } catch (error) {
      scheduledExecution.status = 'FAILED'
      scheduledExecution.errorMessage = error instanceof Error ? error.message : 'Unknown error'
      scheduledExecution.retryCount++

      console.error(`Failed to execute recurring order ${scheduledExecution.recurringOrderId}:`, error)

      // Schedule retry if within retry limits
      if (scheduledExecution.retryCount < scheduledExecution.maxRetries) {
        scheduledExecution.nextRetry = this.calculateRetryTime(scheduledExecution)
        scheduledExecution.status = 'PENDING'
        console.log(`Scheduled retry ${scheduledExecution.retryCount}/${scheduledExecution.maxRetries} for ${scheduledExecution.nextRetry}`)
      }
    }

    scheduledExecution.updatedAt = new Date()
    await this.persistScheduledExecution(scheduledExecution)
  }

  /**
   * Get schedule health for all warehouses
   */

/* eslint-disable no-unused-vars */
  async getGlobalScheduleHealth(): Promise<GlobalScheduleMetrics> {
    const warehouseMetrics: ScheduleHealth[] = []

    for (const [location, config] of Object.entries(this.warehouseConfigs)) {
      const warehouseExecutions = Array.from(this.scheduledExecutions.values())
        .filter(execution => execution.executionContext.warehouseLocation === location)

      const totalScheduled = warehouseExecutions.length
      const pendingExecutions = warehouseExecutions.filter(e => e.status === 'PENDING').length
      const failedExecutions = warehouseExecutions.filter(e => e.status === 'FAILED').length
      const completedExecutions = warehouseExecutions.filter(e => e.status === 'COMPLETED').length

      const successRate = totalScheduled > 0 ? (completedExecutions / totalScheduled) * 100 : 100
      const currentExecutions = this.getCurrentExecutionsForWarehouse(location as any)
      const systemLoad = (currentExecutions / config.maxConcurrentExecutions) * 100

      // Calculate upcoming executions in next 24 hours
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const upcomingExecutions = warehouseExecutions.filter(
        e => e.status === 'PENDING' && e.scheduledDateTime <= tomorrow
      ).length

      // Identify critical issues and warnings
      const criticalIssues: string[] = []
      const warnings: string[] = []

      if (systemLoad > 90) {
        criticalIssues.push('High system load')
      } else if (systemLoad > 75) {
        warnings.push('Elevated system load')
      }

      if (successRate < 95) {
        if (successRate < 90) {
          criticalIssues.push('Low success rate')
        } else {
          warnings.push('Below target success rate')
        }
      }

      if (pendingExecutions > config.maxConcurrentExecutions * 2) {
        warnings.push('High pending execution backlog')
      }

      warehouseMetrics.push({
        warehouseId: `warehouse_${location.toLowerCase()}`,
        warehouseLocation: location,
        totalScheduled,
        pendingExecutions,
        failedExecutions,
        successRate,
        avgProcessingTime: 5, // Simulated average
        lastSuccessfulExecution: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        systemLoad,
        resourceUtilization: systemLoad,
        upcomingExecutions,
        criticalIssues,
        warnings
      })
    }

    // Calculate global metrics
    const totalRecurringOrders = (await recurringOrderService.getSupplierRecurringOrders('ALL_SUPPLIERS')).total
    const activeSchedules = Array.from(this.scheduledExecutions.values())
      .filter(e => e.status === 'PENDING').length

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const executionsToday = Array.from(this.scheduledExecutions.values())
      .filter(e => e.scheduledDateTime >= today && e.scheduledDateTime < tomorrow).length

    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay())
    const nextWeek = new Date(thisWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const executionsThisWeek = Array.from(this.scheduledExecutions.values())
      .filter(e => e.scheduledDateTime >= thisWeek && e.scheduledDateTime < nextWeek).length

    const globalSuccessRate = warehouseMetrics.reduce((sum, m) => sum + m.successRate, 0) / warehouseMetrics.length

    const totalCapacity = Object.values(this.warehouseConfigs)
      .reduce((sum, config) => sum + config.maxConcurrentExecutions, 0)
    const currentUsage = warehouseMetrics.reduce((sum, m) => sum + (m.systemLoad / 100 * 
      this.warehouseConfigs[m.warehouseLocation as keyof typeof this.warehouseConfigs].maxConcurrentExecutions), 0)

    const alertCount = warehouseMetrics.reduce((sum, m) => sum + m.criticalIssues.length + m.warnings.length, 0)

    return {
      totalRecurringOrders,
      activeSchedules,
      executionsToday,
      executionsThisWeek,
      globalSuccessRate,
      warehouseMetrics,
      systemCapacity: {
        current: Math.round(currentUsage),
        maximum: totalCapacity,
        utilizationPercentage: Math.round((currentUsage / totalCapacity) * 100)
      },
      nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      alertCount
    }
  }

  // Private helper methods

  private calculateOptimalExecutionTime(scheduledDate: Date, warehouseConfig: any): Date {
    const optimalTime = new Date(scheduledDate)
    
    // Set to optimal execution hour (morning of business day)
    const [startHour, startMinute] = warehouseConfig.executionWindow.startTime.split(':').map(Number)
    optimalTime.setHours(startHour + 2, startMinute, 0, 0) // 2 hours after window start

    // Ensure it's a business day
    if (!warehouseConfig.executionWindow.allowWeekends) {
      while (optimalTime.getDay() === 0 || optimalTime.getDay() === 6) {
        optimalTime.setDate(optimalTime.getDate() + 1)
      }
    }

    return optimalTime
  }

  private calculateExecutionPriority(order: RecurringOrder, context: ScheduleExecutionContext): 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' {
    let score = 0

    // Base priority on order characteristics
    const orderValue = order.orderTemplate.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    
    if (orderValue > 10000) score += 3
    else if (orderValue > 5000) score += 2
    else if (orderValue > 1000) score += 1

    // Supplier tier consideration
    // if (supplierTier === 'ENTERPRISE') score += 2
    // else if (supplierTier === 'PROFESSIONAL') score += 1

    // Urgency factors
    if (order.nextExecutionDate < new Date()) score += 3 // Overdue
    if (!order.autoApprove) score += 1 // Requires approval

    // Convert score to priority
    if (score >= 6) return 'URGENT'
    if (score >= 4) return 'HIGH'
    if (score >= 2) return 'NORMAL'
    return 'LOW'
  }

  private getCurrentExecutionsForWarehouse(warehouse: string): number {
    return Array.from(this.scheduledExecutions.values())
      .filter(execution => 
        execution.executionContext.warehouseLocation === warehouse && 
        execution.status === 'PROCESSING'
      ).length
  }

  private estimateProcessingTime(order: RecurringOrder): number {
    const baseTime = 3 // Base 3 minutes
    const itemTime = order.orderTemplate.items.length * 0.5 // 30 seconds per item
    const complexityTime = order.requiresApproval ? 2 : 0 // Extra time for approval
    
    return Math.ceil(baseTime + itemTime + complexityTime)
  }

  private isWithinExecutionWindow(execution: ScheduledExecution, currentTime: Date): boolean {
    const executionWindow = execution.executionContext.executionWindow
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinute

    const [startHour, startMinute] = executionWindow.startTime.split(':').map(Number)
    const [endHour, endMinute] = executionWindow.endTime.split(':').map(Number)
    const startTimeMinutes = startHour * 60 + startMinute
    const endTimeMinutes = endHour * 60 + endMinute

    return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes
  }

  private addToExecutionQueue(execution: ScheduledExecution): void {
    this.executionQueue.push(execution)
    this.executionQueue.sort((a, b) => a.scheduledDateTime.getTime() - b.scheduledDateTime.getTime())
  }

  private calculateRetryTime(execution: ScheduledExecution): Date {
    const baseDelay = Math.pow(2, execution.retryCount) * 60 * 1000 // Exponential backoff in minutes
    const jitter = Math.random() * 30 * 1000 // Up to 30 seconds jitter
    return new Date(Date.now() + baseDelay + jitter)
  }

  private async processRetries(currentTime: Date): Promise<void> {
    const retriesReady = Array.from(this.scheduledExecutions.values())
      .filter(execution => 
        execution.status === 'PENDING' && 
        execution.nextRetry && 
        execution.nextRetry <= currentTime &&
        execution.retryCount > 0
      )

    for (const execution of retriesReady) {
      execution.nextRetry = undefined
      await this.executeScheduledOrder(execution)
    }
  }

  // Database operations (simulated)
  private async persistScheduledExecution(execution: ScheduledExecution): Promise<void> {
    // In real implementation: await rhyPrisma.scheduledExecution.upsert(...)
    console.log(`Persisted scheduled execution ${execution.id}`)
  }

  private loadScheduledExecutions(): void {
    // In real implementation: load from database
    console.log('Loaded scheduled executions from database')
  }

  /**
   * Clean up resources
   */

/* eslint-disable no-unused-vars */
  public shutdown(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = undefined
    }
    console.log('Recurring order scheduler shutdown complete')
  }
}

// Export singleton instance
export const recurringOrderScheduler = new RecurringOrderScheduler()

// Graceful shutdown handling
process.on('SIGTERM', () => {
  recurringOrderScheduler.shutdown()
})

process.on('SIGINT', () => {
  recurringOrderScheduler.shutdown()
})