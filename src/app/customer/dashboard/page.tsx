'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SkeletonCard, SkeletonLine, SkeletonButton } from '@/components/ui/skeleton'
import MobileDashboard from '@/components/dashboard/mobile/MobileDashboard'
import { useOnlineStatus } from '@/utils/offline'
import {
  Package,
  TrendingUp,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Eye,
  DollarSign,
  Battery,
  Zap,
  ChevronRight,
  RefreshCw,
  Activity,
  Award,
  Bell,
  CreditCard,
  Gift,
  Truck,
  Shield,
  Star,
  AlertCircle,
  Calculator,
  FileText,
  Grid,
  Download,
  X,
  Trash2,
  CheckCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'

export default function CustomerDashboardPage() {
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [showEmptyStates, setShowEmptyStates] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [user, setUser] = useState({
    name: 'Mike Johnson',
    email: 'mike@constructionco.com',
    tier: 'Gold Partner',
    savings: 12456.00
  })

  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Cart state for product cards
  const [cart, setCart] = useState<{[key: string]: number}>({
    '6Ah': 0,
    '9Ah': 0,
    '15Ah': 0
  })
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    const ordersTimer = setTimeout(() => {
      setOrdersLoading(false)
    }, 2000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(ordersTimer)
    }
  }, [])

  const stats = {
    totalOrders: 3,
    monthlySpend: 4875,
    fleetSize: 247,
    discountTier: 15
  }

  const recentOrders = [
    {
      id: 'ORD-BD-2405-001',
      date: 'May 22, 2025',
      product: '9Ah FlexVolt Battery × 24 units',
      total: 3000.00,
      status: 'Delivered',
      savings: 1500.00
    },
    {
      id: 'ORD-BD-2405-002',
      date: 'May 20, 2025',
      product: 'Mid-Size Crew Package (10×6Ah, 10×9Ah, 5×15Ah)',
      total: 4425.00,
      status: 'In Transit',
      savings: 1105.00
    },
    {
      id: 'ORD-BD-2405-003',
      date: 'May 18, 2025',
      product: '15Ah FlexVolt Battery × 12 units',
      total: 2940.00,
      status: 'Processing',
      savings: 1008.00
    }
  ]

  const batteryProducts = [
    {
      id: '6Ah',
      name: '6Ah FlexVolt Battery',
      runtime: 'Up to 4 hours',
      weight: '1.9 lbs',
      price: 95,
      msrp: 169,
      savings: 44,
      workOutput: '225 screws / 175 ft cuts',
      chargingTime: '45 minutes',
      popular: false
    },
    {
      id: '9Ah',
      name: '9Ah FlexVolt Battery',
      runtime: 'Up to 6.5 hours',
      weight: '2.4 lbs',
      price: 125,
      msrp: 249,
      savings: 50,
      workOutput: '340 screws / 260 ft cuts',
      chargingTime: '55 minutes',
      popular: true
    },
    {
      id: '15Ah',
      name: '15Ah FlexVolt Battery',
      runtime: 'Up to 10 hours',
      weight: '3.2 lbs',
      price: 245,
      msrp: 379,
      savings: 35,
      workOutput: '560 screws / 430 ft cuts',
      chargingTime: '90 minutes',
      popular: false
    }
  ]

  const handleMouseEnter = (cardId: string) => {
    setHoveredCard(cardId)
  }

  const handleMouseLeave = () => {
    setHoveredCard(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#E6F9F0', color: '#059669' }
      case 'In Transit':
        return { bg: '#E0E7FF', color: '#4F46E5' }
      case 'Processing':
        return { bg: '#FEF3C7', color: '#F59E0B' }
      default:
        return { bg: '#F3F4F6', color: '#6B7280' }
    }
  }

  const updateQuantity = (batteryId: string, delta: number) => {
    setCart(prev => ({
      ...prev,
      [batteryId]: Math.max(0, (prev[batteryId] ?? 0) + delta)
    }))
  }

  const subtotal = Object.entries(cart).reduce((sum, [battery, qty]) => {
    const batteryData = batteryProducts.find(b => b.id === battery)
    return sum + (batteryData ? batteryData.price * qty : 0)
  }, 0)

  const discountPercentage = subtotal >= 5000 ? 20 : subtotal >= 2500 ? 15 : subtotal >= 1000 ? 10 : 0
  const discountAmount = subtotal * (discountPercentage / 100)
  const total = subtotal - discountAmount

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  // Order selection functions
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    setSelectedOrders(recentOrders.map(order => order.id))
  }

  const clearOrderSelection = () => {
    setSelectedOrders([])
  }

  const handleBulkReorder = () => {
    const selectedOrdersData = recentOrders.filter(order => selectedOrders.includes(order.id))
    console.log('Bulk reorder selected orders:', selectedOrdersData)
    alert(`Reordering ${selectedOrders.length} selected orders`)
    clearOrderSelection()
  }

  // Render mobile dashboard for mobile devices
  if (isMobile) {
    return (
      <MobileDashboard
        onSync={() => {
          console.log('Mobile dashboard sync requested')
          // Implement sync logic here
        }}
        onNotificationRead={(notificationId) => {
          console.log('Notification read:', notificationId)
        }}
      />
    )
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header with gradient background - REDUCED PADDING */}
      <div style={{
        background: 'linear-gradient(135deg, #0048AC 0%, #006FEE 50%, #0084FF 100%)',
        color: 'white',
        padding: '20px 24px', // Reduced from 32px to 20px
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 8px 24px rgba(0, 111, 238, 0.15)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                marginBottom: '8px'
              }}>
                Welcome back, {user.name}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Your Battery Department Fleet Management Portal
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Award size={20} />
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>Customer Tier</p>
                  <p style={{ fontSize: '18px', fontWeight: '700' }}>{user.tier}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/customer/notifications')}
                style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                }}
              >
                <Bell size={20} color="white" />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%'
                }} />
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { label: 'Total Savings', value: `$${user.savings.toFixed(2)}`, icon: DollarSign, color: '#22C55E' },
              { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: '#3B82F6' },
              { label: 'Discount Tier', value: `Gold Partner - ${stats.discountTier}% Off`, icon: Gift, color: '#7C3AED' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '72px', // Fixed height for consistency
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '13px', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Quick Actions - Moved to top */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            {
              title: 'Quick Reorder',
              icon: RefreshCw,
              color: '#3B82F6',
              href: '/customer/orders'
            },
            {
              title: 'Runtime Calculator',
              icon: Calculator,
              color: '#10B981',
              href: '/customer/configure'
            },
            {
              title: 'Browse Products',
              icon: Grid,
              color: '#F59E0B',
              href: '/customer/products'
            },
            {
              title: 'Download Invoice',
              icon: Download,
              color: '#7C3AED',
              href: '/customer/invoice'
            }
          ].map(action => (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              style={{
                padding: '20px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: action.color,
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: `0 4px 12px ${action.color}30`,
                transform: hoveredCard === action.title ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={() => handleMouseEnter(action.title)}
              onMouseLeave={handleMouseLeave}
            >
              <action.icon size={20} />
              {action.title}
            </button>
          ))}
        </div>

        {/* Activity Overview Grid - 3 cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {loading ? (
            // Loading skeletons for activity cards
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: '#F8FAFC',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #E6F4FF',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <SkeletonLine style={{ width: '120px', height: '16px', marginBottom: '12px' }} />
                      <SkeletonLine style={{ width: '180px', height: '32px', marginBottom: '8px' }} />
                      <SkeletonLine style={{ width: '100px', height: '14px' }} />
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#E6F4FF',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <SkeletonLine style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            [
              {
                id: 'orders',
                title: 'Active Orders',
                value: '3',
                change: '+1 this week',
                icon: ShoppingCart,
                color: '#3B82F6',
                bgGradient: 'linear-gradient(135deg, #E6F4FF 0%, #F0F9FF 100%)'
              },
              {
                id: 'fleet',
                title: 'Fleet Size',
                value: '247 Batteries',
                change: 'Across 6 jobsites',
                icon: Battery,
                color: '#10B981',
                bgGradient: 'linear-gradient(135deg, #E6FFF9 0%, #F0FFF8 100%)'
              },
              {
                id: 'spend',
                title: 'Avg Monthly Spend',
                value: `$${stats.monthlySpend.toLocaleString()}`,
                change: '+18% vs last year',
                icon: TrendingUp,
                color: '#7C3AED',
                bgGradient: 'linear-gradient(135deg, #F3E6FF 0%, #F9F0FF 100%)'
              }
            ].map(item => (
              <div
                key={item.id}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  background: item.bgGradient,
                  padding: '24px',
                  borderRadius: '16px',
                  border: `1px solid ${item.color}20`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === item.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === item.id 
                    ? `0 12px 24px ${item.color}20` 
                    : '0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ color: '#5B6B7D', fontSize: '14px', fontWeight: '500' }}>{item.title}</p>
                    <p style={{ fontSize: '30px', fontWeight: '800', color: '#0A051E', marginTop: '8px' }}>
                      {item.value}
                    </p>
                    <p style={{ 
                      color: item.change.includes('+') ? '#10B981' : '#5B6B7D', 
                      fontSize: '14px', 
                      marginTop: '8px',
                      fontWeight: '500' 
                    }}>
                      {item.change}
                    </p>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: `${item.color}15`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <item.icon size={24} color={item.color} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Orders */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #E6F4FF',
          boxShadow: '0 4px 12px rgba(0, 111, 238, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0A051E', marginBottom: '4px' }}>
                Recent Orders
              </h2>
              <p style={{ fontSize: '14px', color: '#5B6B7D' }}>
                Track your latest battery orders and reorder with one click
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {recentOrders.length > 0 && selectedOrders.length > 0 && (
                <>
                  <span style={{ fontSize: '14px', color: '#5B6B7D' }}>
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={handleBulkReorder}
                    style={{
                      backgroundColor: '#10B981',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10B981'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <RefreshCw size={16} />
                    Reorder Selected ({selectedOrders.length})
                  </button>
                  <button
                    onClick={clearOrderSelection}
                    style={{
                      backgroundColor: '#EF4444',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF4444'
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              )}
              {recentOrders.length > 0 && selectedOrders.length === 0 && (
                <button
                  onClick={selectAllOrders}
                  style={{
                    backgroundColor: '#006FEE',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0059D1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#006FEE'
                  }}
                >
                  Select All
                </button>
              )}
              <button
                onClick={() => router.push('/customer/orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#006FEE',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0059D1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#006FEE'}
              >
                View all orders
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ordersLoading ? (
              // Loading skeletons for recent orders
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      padding: '20px',
                      paddingLeft: '40px',
                      border: '1px solid #E6F4FF',
                      borderRadius: '12px',
                      background: 'white'
                    }}
                  >
                    {/* Timeline dot skeleton */}
                    <div style={{
                      position: 'absolute',
                      left: '16px',
                      top: '28px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#E6F4FF',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 0 0 4px #F8FAFC'
                    }} />
                    
                    {/* Timeline line skeleton */}
                    {i < 3 && (
                      <div style={{
                        position: 'absolute',
                        left: '21px',
                        top: '52px',
                        width: '2px',
                        height: 'calc(100% + 16px)',
                        backgroundColor: '#E6F4FF'
                      }} />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <SkeletonLine style={{ width: '140px', height: '20px' }} />
                          <SkeletonLine style={{ width: '100px', height: '16px' }} />
                        </div>
                        <SkeletonLine style={{ width: '300px', height: '16px', marginBottom: '12px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <SkeletonLine style={{ width: '80px', height: '24px' }} />
                          <SkeletonLine style={{ width: '120px', height: '24px', borderRadius: '20px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SkeletonLine style={{ width: '90px', height: '32px', borderRadius: '20px' }} />
                        <SkeletonButton style={{ width: '110px', height: '36px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : showEmptyStates || recentOrders.length === 0 ? (
              // Empty state for recent orders
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                textAlign: 'center',
                border: '2px dashed #E6F4FF',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F8FBFF 0%, #F0F9FF 100%)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#E6F4FF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <ShoppingCart size={32} color="#006FEE" />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0A051E',
                  marginBottom: '8px'
                }}>
                  No Recent Orders
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#5B6B7D',
                  marginBottom: '24px',
                  maxWidth: '400px'
                }}>
                  Start building your battery fleet with our premium FlexVolt batteries designed for professionals.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    onClick={() => router.push('/customer/products')}
                    style={{
                      backgroundColor: '#006FEE',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0059D1'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#006FEE'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <ShoppingBag size={18} />
                    Browse Products
                  </button>
                  <button
                    onClick={() => router.push('/customer/configure')}
                    style={{
                      backgroundColor: 'white',
                      color: '#006FEE',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '2px solid #006FEE',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F9FF'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <Calculator size={18} />
                    Configure Kit
                  </button>
                </div>
              </div>
            ) : (
              recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    position: 'relative',
                    padding: '20px',
                    paddingLeft: '40px',
                    border: '1px solid #E6F4FF',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: hoveredCard === order.id ? '#F8FBFF' : 'white'
                  }}
                  onMouseEnter={() => handleMouseEnter(order.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => router.push(`/customer/orders/${order.id}`)}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '28px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: getStatusColor(order.status).color,
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 0 0 4px ' + getStatusColor(order.status).bg
                  }} />
                  
                  {/* Timeline line */}
                  {index < recentOrders.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '21px',
                      top: '52px',
                      width: '2px',
                      height: 'calc(100% + 16px)',
                      backgroundColor: '#E6F4FF'
                    }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '16px', flex: 1 }}>
                      {/* Selection checkbox */}
                      <label style={{ 
                        marginTop: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#006FEE',
                            cursor: 'pointer'
                          }}
                        />
                      </label>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#0A051E', fontSize: '16px' }}>{order.id}</span>
                          <span style={{ fontSize: '14px', color: '#5B6B7D' }}>{order.date}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#5B6B7D', marginBottom: '12px' }}>
                          {order.product}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <p style={{ fontSize: '20px', fontWeight: '700', color: '#0A051E' }}>
                            ${order.total.toFixed(2)}
                          </p>
                          <span style={{
                            backgroundColor: '#E6F9F0',
                            color: '#059669',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            Saved ${order.savings.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).color
                      }}>
                        {order.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Reorder:', order.id)
                        }}
                        style={{
                          backgroundColor: '#006FEE',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0059D1'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#006FEE'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <RefreshCw size={16} />
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Frequently Ordered Products */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #E6F4FF',
          boxShadow: '0 4px 12px rgba(0, 111, 238, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0A051E' }}>
              Frequently Ordered Products
            </h2>
            <button
              onClick={() => router.push('/customer/favorites')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#006FEE',
                fontSize: '14px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0059D1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#006FEE'}
            >
              View all products
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Product Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {batteryProducts.map(battery => (
              <div
                key={battery.id}
                style={{
                  position: 'relative',
                  background: 'white',
                  border: '2px solid #E6F4FF',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === battery.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === battery.id 
                    ? '0 12px 24px rgba(0, 111, 238, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={() => handleMouseEnter(battery.id)}
                onMouseLeave={handleMouseLeave}
              >
                {battery.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: '#FFB800',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(255, 184, 0, 0.3)'
                  }}>
                    <Star size={14} fill="white" />
                    MOST POPULAR
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0A051E', marginBottom: '8px' }}>
                      {battery.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '28px', fontWeight: '800', color: '#006FEE' }}>
                        ${battery.price}
                      </span>
                      <span style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                        ${battery.msrp}
                      </span>
                      <span style={{
                        backgroundColor: '#E6F9F0',
                        color: '#059669',
                        padding: '2px 8px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        -{battery.savings}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #E6F4FF 0%, #F0F9FF 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Battery size={32} color="#006FEE" />
                  </div>
                </div>

                <div style={{ marginBottom: '16px', fontSize: '14px', color: '#5B6B7D' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Clock size={14} />
                    <span>{battery.runtime} continuous operation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Zap size={14} />
                    <span>{battery.chargingTime} charge time</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={14} />
                    <span>{battery.workOutput}</span>
                  </div>
                </div>

                {/* Quantity selector buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {[5, 10, 25].map(qty => (
                    <button
                      key={qty}
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(battery.id, qty)
                        setShowCartDrawer(true)
                      }}
                      style={{
                        padding: '8px',
                        border: '1px solid #E6F4FF',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        color: '#006FEE',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F0F9FF'
                        e.currentTarget.style.borderColor = '#006FEE'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#E6F4FF'
                      }}
                    >
                      +{qty}
                    </button>
                  ))}
                </div>

                {/* Custom quantity controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateQuantity(battery.id, -1)
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #E6F4FF',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFE6E6'
                      e.currentTarget.style.borderColor = '#EF4444'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.borderColor = '#E6F4FF'
                    }}
                  >
                    <Minus size={16} color="#5B6B7D" />
                  </button>
                  
                  <div style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0A051E'
                  }}>
                    {cart[battery.id] || 0} units
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateQuantity(battery.id, 1)
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #E6F4FF',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E6FFF9'
                      e.currentTarget.style.borderColor = '#10B981'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                      e.currentTarget.style.borderColor = '#E6F4FF'
                    }}
                  >
                    <Plus size={16} color="#5B6B7D" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        {totalItems > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E6F4FF',
            boxShadow: '0 4px 12px rgba(0, 111, 238, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0A051E' }}>
                Cart Summary
              </h2>
              <button
                onClick={() => setShowCartDrawer(!showCartDrawer)}
                style={{
                  color: '#006FEE',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
              >
                {showCartDrawer ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {/* Cart items */}
            {showCartDrawer && (
              <div style={{ marginBottom: '20px' }}>
                {Object.entries(cart).map(([batteryId, qty]) => {
                  if (qty === 0) return null
                  const battery = batteryProducts.find(b => b.id === batteryId)
                  if (!battery) return null
                  
                  return (
                    <div
                      key={batteryId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #F3F4F6'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600', color: '#0A051E' }}>{battery.name}</p>
                        <p style={{ fontSize: '14px', color: '#5B6B7D' }}>
                          ${battery.price} × {qty} = ${(battery.price * qty).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => updateQuantity(batteryId, -qty)}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#FFE6E6',
                          color: '#DC2626',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFE6E6'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Totals */}
            <div style={{ borderTop: '2px solid #E6F4FF', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#5B6B7D' }}>Subtotal</span>
                <span style={{ fontWeight: '600', color: '#0A051E' }}>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#059669' }}>Bulk Discount ({discountPercentage}%)</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0A051E' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#006FEE' }}>${total.toFixed(2)}</span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => router.push('/customer/payment')}
                  style={{
                    backgroundColor: '#006FEE',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0059D1'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#006FEE'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <CreditCard size={18} />
                  Checkout
                </button>
                <button
                  onClick={() => router.push('/customer/invoice')}
                  style={{
                    backgroundColor: 'white',
                    color: '#006FEE',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '2px solid #006FEE',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0F9FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  <FileText size={18} />
                  Get Invoice
                </button>
              </div>

              {/* Benefits */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={16} color="#10B981" />
                  <span style={{ color: '#5B6B7D' }}>Free shipping on orders over $1,000</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={16} color="#10B981" />
                  <span style={{ color: '#5B6B7D' }}>12-month warranty on all batteries</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#10B981" />
                  <span style={{ color: '#5B6B7D' }}>Same-day processing for orders before 2PM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}