'use client'
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */


import { useState, useEffect } from 'react'
import { webhookDebugger } from '@/services/webhooks/webhook-debugger'
import { webhookManager } from '@/services/webhooks/webhook-manager'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  Play,
  Pause,
  Download,
  RefreshCw,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

export function WebhookCustomerPortal() {
  const [endpoints, setEndpoints] = useState<any[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('')
  const [debugSession, setDebugSession] = useState<any>(null)
  const [healthReport, setHealthReport] = useState<any>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    loadEndpoints()
  }, [])

  useEffect(() => {
    if (selectedEndpoint) {
      loadEndpointData(selectedEndpoint)
    }
  }, [selectedEndpoint])

  const loadEndpoints = async () => {
    try {
      // In production, fetch from webhook configuration
      const mockEndpoints = [
        {
          id: 'ep1',
          url: 'https://api.customer.com/webhooks',
          name: 'Primary API',
          events: ['order.created', 'order.updated', 'payment.succeeded'],
          status: 'active'
        },
        {
          id: 'ep2',
          url: 'https://backup.customer.com/webhook-handler',
          name: 'Backup Handler',
          events: ['order.created', 'customer.created'],
          status: 'active'
        }
      ]
      
      setEndpoints(mockEndpoints)
      if (mockEndpoints.length > 0) {
        setSelectedEndpoint(mockEndpoints[0].url)
      }
    } catch (error) {
      console.error('Failed to load endpoints:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEndpointData = async (endpoint: string) => {
    try {
      // Load health report
      const report = await webhookDebugger.getHealthReport(endpoint)
      setHealthReport(report)

      // Load recent deliveries
      const deliveries = await webhookManager.getDeliveryHistory(endpoint, 10)
      setRecentDeliveries(deliveries)
    } catch (error) {
      console.error('Failed to load endpoint data:', error)
    }
  }

  const startDebugSession = async () => {
    if (!selectedEndpoint) return

    const session = await webhookDebugger.startDebugSession(selectedEndpoint, {
      timeRange: { 
        start: new Date(Date.now() - 24 * 60 * 60 * 1000), 
        end: new Date() 
      }
    })
    
    setDebugSession(session)

    // Update session data periodically
    const interval = setInterval(() => {
      const updatedSession = webhookDebugger.getDebugSession(session.id)
      if (updatedSession) {
        setDebugSession({ ...updatedSession })
      }
    }, 2000)

    return () => clearInterval(interval)
  }

  const pauseDebugSession = () => {
    if (debugSession) {
      webhookDebugger.pauseDebugSession(debugSession.id)
      setDebugSession({ ...debugSession, status: 'paused' })
    }
  }

  const resumeDebugSession = () => {
    if (debugSession) {
      webhookDebugger.resumeDebugSession(debugSession.id)
      setDebugSession({ ...debugSession, status: 'active' })
    }
  }

  const testEndpoint = async () => {
    if (!selectedEndpoint) return

    setTestResult({ loading: true })
    
    const result = await webhookDebugger.testEndpoint(
      selectedEndpoint,
      'test.webhook',
      {
        message: 'Test webhook delivery',
        timestamp: new Date().toISOString()
      }
    )
    
    setTestResult(result)
  }

  const replayDelivery = async (deliveryId: string) => {
    const result = await webhookDebugger.replayDelivery(deliveryId)
    if (result.success) {
      // Refresh deliveries
      loadEndpointData(selectedEndpoint)
    }
  }

  const exportDebugData = async () => {
    if (!debugSession) return

    const exportData = await webhookDebugger.exportDebugSession(debugSession.id)
    
    // Create download link
    const blob = new Blob([exportData.data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exportData.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Endpoint Selector */}
      <Card className="border-2 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Webhook Endpoints</h3>
            <Button onClick={testEndpoint} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Test Endpoint
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedEndpoint === endpoint.url
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedEndpoint(endpoint.url)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{endpoint.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{endpoint.url}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {endpoint.events.slice(0, 3).map((event: string) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                      {endpoint.events.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{endpoint.events.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant = {endpoint.status === 'active' ? 'success' : 'secondary'} as any
                  >
                    {endpoint.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {testResult && !testResult.loading && (
            <div className={`mt-4 p-4 rounded-lg ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {testResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    Test {testResult.success ? 'Successful' : 'Failed'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Response time: {testResult.duration}ms
                    {testResult.error && ` - ${testResult.error}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Status */}
      {healthReport && (
        <Card className="border-2 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Endpoint Health</h3>
              <Badge
                variant={(
                  healthReport.status === 'healthy' ? 'success' :
                  healthReport.status === 'degraded' ? 'warning' : 'destructive'
                ) as any}
                className="text-sm"
              >
                {healthReport.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {healthReport.metrics.successRate.toFixed(1)}%
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Avg Response</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {healthReport.metrics.avgResponseTime.toFixed(0)}ms
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Activity className="h-4 w-4 mr-1" />
                  <span className="text-sm">Total Deliveries</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {healthReport.metrics.totalDeliveries}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Failed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {healthReport.metrics.failedDeliveries}
                </div>
              </div>
            </div>

            {healthReport.issues.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Active Issues</h4>
                <div className="space-y-2">
                  {healthReport.issues.map((issue: any, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{issue.description}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {issue.count} occurrences - Last: {new Date(issue.lastOccurred).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {healthReport.recommendations.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {healthReport.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debug Session */}
      <Card className="border-2 border-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Debug Session</h3>
            <div className="flex gap-2">
              {!debugSession ? (
                <Button onClick={startDebugSession} size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Start Debug
                </Button>
              ) : (
                <>
                  {debugSession.status === 'active' ? (
                    <Button onClick={pauseDebugSession} variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeDebugSession} variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={exportDebugData} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>

          {debugSession ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{debugSession.insights.totalEvents}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {debugSession.insights.successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {debugSession.insights.avgResponseTime.toFixed(0)}ms
                  </p>
                </div>
              </div>

              {/* Recent Events */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Events</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {debugSession.events.slice(0, 20).map((event: any) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${
                        event.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          {event.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{event.event}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(event.timestamp).toLocaleString()}
                              {event.response && ` - ${event.response.duration}ms`}
                            </p>
                            {event.error && (
                              <p className="text-sm text-red-600 mt-1">{event.error}</p>
                            )}
                          </div>
                        </div>
                        {event.retryCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {event.retryCount} retries
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start a debug session to monitor webhook deliveries in real-time</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="border-2 border-blue-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deliveries</h3>
          
          <div className="space-y-3">
            {recentDeliveries.map((delivery: any) => (
              <div
                key={delivery.id}
                className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-3 ${
                    delivery.status === 'success' ? 'bg-green-100' :
                    delivery.status === 'failed' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {delivery.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : delivery.status === 'failed' ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{delivery.event}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(delivery.createdAt).toLocaleString()}
                    </p>
                    {delivery.error && (
                      <p className="text-sm text-red-600 mt-1">{delivery.error}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {delivery.attempts} attempt{delivery.attempts !== 1 ? 's' : ''}
                  </Badge>
                  {delivery.status === 'failed' && (
                    <Button
                      onClick={() => replayDelivery(delivery.id)}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}