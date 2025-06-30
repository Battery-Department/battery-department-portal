import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()
  const startTime = Date.now()

  try {
    // Basic health checks
    const checks = {
      status: 'healthy',
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: await checkDatabase(),
        stripe: await checkStripe(),
        email: await checkEmailService(),
        environment: checkEnvironmentVariables()
      }
    }

    const responseTime = Date.now() - startTime
    
    // Determine overall health status
    const allChecksHealthy = Object.values(checks.checks).every(check => check.status === 'healthy')
    const overallStatus = allChecksHealthy ? 'healthy' : 'degraded'

    const response = {
      ...checks,
      status: overallStatus,
      responseTime: `${responseTime}ms`
    }

    const statusCode = overallStatus === 'healthy' ? 200 : 503
    
    return NextResponse.json(response, { status: statusCode })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 503 })
  }
}

async function checkDatabase() {
  try {
    const dbUrl = process.env.DATABASE_URL
    
    if (!dbUrl) {
      return {
        status: 'unhealthy',
        message: 'DATABASE_URL not configured'
      }
    }

    // Perform actual database query
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const queryTime = Date.now() - startTime

    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime: `${queryTime}ms`
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database check failed'
    }
  }
}

async function checkStripe() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey) {
      return {
        status: 'unhealthy',
        message: 'Stripe API key not configured'
      }
    }

    // Basic check - if we have the key, assume Stripe is available
    return {
      status: 'healthy',
      message: 'Stripe configuration available'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Stripe check failed'
    }
  }
}

async function checkEmailService() {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    
    if (!smtpHost || !smtpUser) {
      return {
        status: 'degraded',
        message: 'Email service not fully configured'
      }
    }

    return {
      status: 'healthy',
      message: 'Email service configured'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Email service check failed'
    }
  }
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DATABASE_URL',
    'JWT_SECRET'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    return {
      status: 'unhealthy',
      message: `Missing required environment variables: ${missingVars.join(', ')}`
    }
  }

  return {
    status: 'healthy',
    message: 'All required environment variables present'
  }
}