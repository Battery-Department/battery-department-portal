/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

// Terminal 3 Phase 2: Fleet Subscription Hook
// React hook for fleet subscription management and auto-replenishment

'use client'

import { useState, useEffect, useCallback } from 'react'
import FleetSubscriptionManager, {
  FleetCustomer,
  FleetSubscription,
  PredictiveOrder,
  FleetAnalytics,
  MaintenanceAlert,
  UsagePattern
} from '@/services/subscription/fleet-manager'

export interface UseFleetSubscriptionOptions {
  customerId: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export interface UseFleetSubscriptionReturn {
  // State
  customer: FleetCustomer | null
  subscriptions: FleetSubscription[]
  analytics: FleetAnalytics | null
  predictions: PredictiveOrder[]
  maintenanceAlerts: MaintenanceAlert[]
  usagePatterns: UsagePattern[]
  
  // Loading states
  isLoading: boolean
  isSettingUpSubscription: boolean
  isGeneratingPredictions: boolean
  isAnalyzing: boolean
  
  // Actions
  setupAutoReplenishment: (preferences: SetupPreferences) => Promise<FleetSubscription[]>
  updateSubscription: (subscriptionId: string, updates: Partial<FleetSubscription>) => Promise<void>
  pauseSubscription: (subscriptionId: string) => Promise<void>
  resumeSubscription: (subscriptionId: string) => Promise<void>
  cancelSubscription: (subscriptionId: string) => Promise<void>
  scheduleDelivery: (subscriptionId: string, date: string, timeWindow: string) => Promise<void>
  generatePredictions: () => Promise<PredictiveOrder[]>
  refreshAnalytics: () => Promise<FleetAnalytics>
  updateUsagePatterns: () => Promise<UsagePattern[]>
  executeAutoOrder: (batteryType: string) => Promise<string>
  acknowledgeAlert: (alertId: string) => Promise<void>
  
  // Error handling
  error: string | null
  clearError: () => void
}

export interface SetupPreferences {
  batteryTypes: string[]
  deliveryFrequency: FleetSubscription['deliveryFrequency']
  emergencyThreshold: number
  autoAdjustQuantity: boolean
}

const useFleetSubscription = ({
  customerId,
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes
}: UseFleetSubscriptionOptions): UseFleetSubscriptionReturn => {
  const [fleetManager] = useState(() => new FleetSubscriptionManager())
  
  // State
  const [customer, setCustomer] = useState<FleetCustomer | null>(null)
  const [subscriptions, setSubscriptions] = useState<FleetSubscription[]>([])
  const [analytics, setAnalytics] = useState<FleetAnalytics | null>(null)
  const [predictions, setPredictions] = useState<PredictiveOrder[]>([])
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([])
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingUpSubscription, setIsSettingUpSubscription] = useState(false)
  const [isGeneratingPredictions, setIsGeneratingPredictions] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Error handling
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  const loadData = useCallback(async () => {
    if (!customerId) return

    setIsLoading(true)
    setError(null)

    try {
      // Load customer data (from localStorage or API)
      const customerData = JSON.parse(localStorage.getItem(`fleet_customer_${customerId}`) || 'null')
      if (customerData) {
        setCustomer(customerData)
        setUsagePatterns(customerData.usagePatterns || [])
      }

      // Load subscriptions
      const subscriptionsData = JSON.parse(localStorage.getItem('fleet_subscriptions') || '[]')
      const customerSubscriptions = subscriptionsData.filter((sub: FleetSubscription) => 
        sub.customerId === customerId
      )
      setSubscriptions(customerSubscriptions)

      // Load maintenance alerts
      const alerts = JSON.parse(localStorage.getItem(`maintenance_alerts_${customerId}`) || '[]')
      setMaintenanceAlerts(alerts)

      // Load analytics if customer exists
      if (customerData) {
        const analyticsData = await fleetManager.getFleetAnalytics(customerId)
        setAnalytics(analyticsData)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fleet data')
    } finally {
      setIsLoading(false)
    }
  }, [customerId, fleetManager])

  // Setup auto-replenishment
  const setupAutoReplenishment = useCallback(async (preferences: SetupPreferences): Promise<FleetSubscription[]> => {
    setIsSettingUpSubscription(true)
    setError(null)

    try {
      const newSubscriptions = await fleetManager.setupAutoReplenishment(customerId, preferences)
      setSubscriptions(prev => [...prev, ...newSubscriptions])
      
      // Refresh customer data
      await loadData()
      
      return newSubscriptions
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup auto-replenishment'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsSettingUpSubscription(false)
    }
  }, [customerId, fleetManager, loadData])

  // Update subscription
  const updateSubscription = useCallback(async (
    subscriptionId: string, 
    updates: Partial<FleetSubscription>
  ): Promise<void> => {
    setError(null)

    try {
      // Find and update subscription
      const subscriptionIndex = subscriptions.findIndex(sub => sub.id === subscriptionId)
      if (subscriptionIndex === -1) {
        throw new Error('Subscription not found')
      }

      const updatedSubscription = {
        ...subscriptions[subscriptionIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Update local state
      const newSubscriptions = [...subscriptions]
      newSubscriptions[subscriptionIndex] = updatedSubscription
      setSubscriptions(newSubscriptions)

      // Save to storage
      const allSubscriptions = JSON.parse(localStorage.getItem('fleet_subscriptions') || '[]')
      const globalIndex = allSubscriptions.findIndex((sub: FleetSubscription) => sub.id === subscriptionId)
      if (globalIndex !== -1) {
        allSubscriptions[globalIndex] = updatedSubscription
        localStorage.setItem('fleet_subscriptions', JSON.stringify(allSubscriptions))
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [subscriptions])

  // Pause subscription
  const pauseSubscription = useCallback(async (subscriptionId: string): Promise<void> => {
    await updateSubscription(subscriptionId, { status: 'paused' })
  }, [updateSubscription])

  // Resume subscription
  const resumeSubscription = useCallback(async (subscriptionId: string): Promise<void> => {
    await updateSubscription(subscriptionId, { status: 'active' })
  }, [updateSubscription])

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId: string): Promise<void> => {
    await updateSubscription(subscriptionId, { status: 'cancelled' })
  }, [updateSubscription])

  // Schedule delivery
  const scheduleDelivery = useCallback(async (
    subscriptionId: string,
    date: string,
    timeWindow: string
  ): Promise<void> => {
    setError(null)

    try {
      await fleetManager.scheduleDelivery(subscriptionId, date, timeWindow)
      await loadData() // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule delivery'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fleetManager, loadData])

  // Generate predictions
  const generatePredictions = useCallback(async (): Promise<PredictiveOrder[]> => {
    setIsGeneratingPredictions(true)
    setError(null)

    try {
      const newPredictions = await fleetManager.predictReplacementNeeds(customerId)
      setPredictions(newPredictions)
      return newPredictions
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate predictions'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsGeneratingPredictions(false)
    }
  }, [customerId, fleetManager])

  // Refresh analytics
  const refreshAnalytics = useCallback(async (): Promise<FleetAnalytics> => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const newAnalytics = await fleetManager.getFleetAnalytics(customerId)
      setAnalytics(newAnalytics)
      return newAnalytics
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh analytics'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }, [customerId, fleetManager])

  // Update usage patterns
  const updateUsagePatterns = useCallback(async (): Promise<UsagePattern[]> => {
    setError(null)

    try {
      const patterns = await fleetManager.monitorUsagePatterns(customerId)
      setUsagePatterns(patterns)
      return patterns
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update usage patterns'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [customerId, fleetManager])

  // Execute auto order
  const executeAutoOrder = useCallback(async (batteryType: string): Promise<string> => {
    setError(null)

    try {
      const orderId = await fleetManager.executeAutoOrder(customerId, batteryType)
      
      // Refresh subscription data
      await loadData()
      
      return orderId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute auto order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [customerId, fleetManager, loadData])

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string): Promise<void> => {
    setError(null)

    try {
      // Mark alert as acknowledged
      const updatedAlerts = maintenanceAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : alert
      )
      
      setMaintenanceAlerts(updatedAlerts)
      localStorage.setItem(`maintenance_alerts_${customerId}`, JSON.stringify(updatedAlerts))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge alert'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [customerId, maintenanceAlerts])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load initial data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh || !customerId) return

    const interval = setInterval(() => {
      loadData()
      if (customer) {
        generatePredictions()
        refreshAnalytics()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, customerId, customer, refreshInterval, loadData, generatePredictions, refreshAnalytics])

  return {
    // State
    customer,
    subscriptions,
    analytics,
    predictions,
    maintenanceAlerts,
    usagePatterns,
    
    // Loading states
    isLoading,
    isSettingUpSubscription,
    isGeneratingPredictions,
    isAnalyzing,
    
    // Actions
    setupAutoReplenishment,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    scheduleDelivery,
    generatePredictions,
    refreshAnalytics,
    updateUsagePatterns,
    executeAutoOrder,
    acknowledgeAlert,
    
    // Error handling
    error,
    clearError
  }
}

export default useFleetSubscription