/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

// Terminal 3 Phase 2: Fleet Management Dashboard
// Comprehensive fleet subscription dashboard with analytics and management tools

'use client'

import React, { useState, useEffect } from 'react'
import { 
  Truck, 
  Battery, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Settings, 
  BarChart3,
  Zap,
  Package,
  Clock,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  Plus,
  RefreshCw,
  Bell,
  ArrowRight,
  DollarSign,
  Target,
  Activity
} from 'lucide-react'
import useFleetSubscription from '@/hooks/useFleetSubscription'

export interface FleetDashboardProps {
  customerId: string
  className?: string
}

const FleetDashboard: React.FC<FleetDashboardProps> = ({
  customerId,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'analytics' | 'alerts'>('overview')
  const [showSetupModal, setShowSetupModal] = useState(false)

  const {
    customer,
    subscriptions,
    analytics,
    predictions,
    maintenanceAlerts,
    usagePatterns,
    isLoading,
    isSettingUpSubscription,
    isGeneratingPredictions,
    isAnalyzing,
    setupAutoReplenishment,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    scheduleDelivery,
    generatePredictions,
    refreshAnalytics,
    executeAutoOrder,
    acknowledgeAlert,
    error,
    clearError
  } = useFleetSubscription({ customerId })

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (customer) {
        generatePredictions()
        refreshAnalytics()
      }
    }, 300000)

    return () => clearInterval(interval)
  }, [customer, generatePredictions, refreshAnalytics])

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-lg p-8 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-lg p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Fleet Not Found</h3>
        <p className="text-gray-600 mb-6">This customer doesn't have fleet management enabled.</p>
        <button
          onClick={() => setShowSetupModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Setup Fleet Management
        </button>
      </div>
    )
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Batteries"
          value={analytics?.totalBatteriesManaged || 0}
          icon={<Battery size={24} />}
          color="blue"
          change="+12% vs last month"
        />
        <MetricCard
          title="Active Subscriptions"
          value={subscriptions.filter(s => s.status === 'active').length}
          icon={<Package size={24} />}
          color="green"
          change="3 active deliveries"
        />
        <MetricCard
          title="Cost Savings"
          value={`$${analytics?.costSavings.toLocaleString() || 0}`}
          icon={<DollarSign size={24} />}
          color="indigo"
          change="+$1,250 this quarter"
        />
        <MetricCard
          title="Efficiency Gain"
          value={`${Math.round((analytics?.efficiencyGains || 0) * 100)}%`}
          icon={<TrendingUp size={24} />}
          color="emerald"
          change="vs manual ordering"
        />
      </div>

      {/* Upcoming Deliveries */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            Upcoming Deliveries
          </h3>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          {subscriptions
            .filter(sub => sub.status === 'active')
            .slice(0, 3)
            .map(subscription => (
              <div key={subscription.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{subscription.batteryType} Batteries</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {subscription.quantity} • 
                      Next delivery: {new Date(subscription.nextDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ${subscription.pricing.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.pricing.discountPercentage}% fleet discount
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Predictions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target size={20} />
              Predictive Orders
            </h3>
            <button
              onClick={generatePredictions}
              disabled={isGeneratingPredictions}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {isGeneratingPredictions ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                'Refresh'
              )}
            </button>
          </div>
          
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.slice(0, 3).map(prediction => (
                <div key={`${prediction.batteryType}-${prediction.predictedDate}`} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{prediction.batteryType} Battery</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      prediction.urgency === 'high' ? 'bg-red-100 text-red-700' :
                      prediction.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {prediction.urgency} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Predicted need: {new Date(prediction.predictedDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </span>
                    <button
                      onClick={() => executeAutoOrder(prediction.batteryType)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-medium"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No predictions available</p>
          )}
        </div>

        {/* Maintenance Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={20} />
              Maintenance Alerts
            </h3>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          {maintenanceAlerts.length > 0 ? (
            <div className="space-y-3">
              {maintenanceAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{alert.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.recommendedAction}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(alert.dueDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">No maintenance alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Active Subscriptions</h3>
        <button
          onClick={() => setShowSetupModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subscriptions.map(subscription => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onPause={() => pauseSubscription(subscription.id)}
            onResume={() => resumeSubscription(subscription.id)}
            onCancel={() => cancelSubscription(subscription.id)}
            onSchedule={(date, window) => scheduleDelivery(subscription.id, date, window)}
          />
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Subscriptions</h3>
          <p className="text-gray-600 mb-6">Set up auto-replenishment to get started</p>
          <button
            onClick={() => setShowSetupModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Setup Auto-Replenishment
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.companyName} Fleet</h1>
              <p className="text-gray-600">
                {customer.fleetSize} batteries • {customer.subscriptionTier} tier
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={refreshAnalytics}
              disabled={isAnalyzing}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw size={20} className={isAnalyzing ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mt-6 -mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
            { id: 'subscriptions', label: 'Subscriptions', icon: <Package size={16} /> },
            { id: 'analytics', label: 'Analytics', icon: <Activity size={16} /> },
            { id: 'alerts', label: 'Alerts', icon: <Bell size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'subscriptions' && renderSubscriptionsTab()}
        {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} usagePatterns={usagePatterns} />}
        {activeTab === 'alerts' && <AlertsTab alerts={maintenanceAlerts} onAcknowledge={acknowledgeAlert} />}
      </div>
    </div>
  )
}

// Helper Components
const MetricCard: React.FC<{
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  change?: string
}> = ({ title, value, icon, color, change }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4`}>
      <div className={`text-${color}-600`}>{icon}</div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
    {change && <p className="text-sm text-gray-500">{change}</p>}
  </div>
)

const SubscriptionCard: React.FC<{
  subscription: any
  onPause: () => void
  onResume: () => void
  onCancel: () => void
  onSchedule: (date: string, window: string) => void
}> = ({ subscription, onPause, onResume, onCancel }) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">{subscription.batteryType} Subscription</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        subscription.status === 'active' ? 'bg-green-100 text-green-700' :
        subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {subscription.status}
      </span>
    </div>
    
    <div className="space-y-3 mb-6">
      <div className="flex justify-between">
        <span className="text-gray-600">Quantity:</span>
        <span className="font-medium">{subscription.quantity} batteries</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Frequency:</span>
        <span className="font-medium">{subscription.deliveryFrequency.replace('_', ' ')}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Next Delivery:</span>
        <span className="font-medium">{new Date(subscription.nextDeliveryDate).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Price:</span>
        <span className="font-medium">${subscription.pricing.totalPrice}</span>
      </div>
    </div>
    
    <div className="flex gap-2">
      {subscription.status === 'active' ? (
        <button
          onClick={onPause}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
        >
          <PauseCircle size={16} />
          Pause
        </button>
      ) : subscription.status === 'paused' ? (
        <button
          onClick={onResume}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
        >
          <PlayCircle size={16} />
          Resume
        </button>
      ) : null}
      <button
        onClick={onCancel}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
      >
        <XCircle size={16} />
        Cancel
      </button>
    </div>
  </div>
)

const AnalyticsTab: React.FC<{ analytics: any; usagePatterns: any[] }> = ({ analytics, usagePatterns }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Fleet Analytics</h3>
    
    {analytics && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 mb-4">Performance Metrics</h4>
          <div className="space-y-3">
            {analytics.performanceMetrics?.map((metric: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{metric.metric}:</span>
                <span className={`font-medium ${
                  metric.status === 'excellent' ? 'text-green-600' :
                  metric.status === 'good' ? 'text-blue-600' :
                  metric.status === 'fair' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {metric.value} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 mb-4">Usage Patterns</h4>
          <div className="space-y-3">
            {usagePatterns.map((pattern, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3">
                <h5 className="font-medium text-gray-900">{pattern.batteryType}</h5>
                <p className="text-sm text-gray-600">
                  {pattern.averageUsageHours}h/day • {pattern.workloadType} workload
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
)

const AlertsTab: React.FC<{ alerts: any[]; onAcknowledge: (id: string) => void }> = ({ alerts, onAcknowledge }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-bold text-gray-900">Maintenance Alerts</h3>
    
    {alerts.length > 0 ? (
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900">{alert.description}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {alert.severity}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{alert.recommendedAction}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Due: {new Date(alert.dueDate).toLocaleDateString()} • 
                Estimated cost: ${alert.estimatedCost}
              </span>
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Alerts</h3>
        <p className="text-gray-600">Your fleet is running smoothly</p>
      </div>
    )}
  </div>
)

export default FleetDashboard