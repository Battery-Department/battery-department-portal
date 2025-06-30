'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package,
  ShoppingCart,
  Heart,
  Home,
  User,
  CreditCard,
  MapPin,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Eye,
  RefreshCw,
  Download,
  Truck
} from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'

const orders = [
  {
    id: 'ORD-2024-005',
    date: 'May 22, 2025',
    status: 'Delivered',
    total: '$2,645.00',
    items: [
      { name: 'LithiPro 150Ah Battery', quantity: 2, price: '$1,198.00' },
      { name: 'Smart BMS Module', quantity: 2, price: '$398.00' },
      { name: 'Premium Cable Kit', quantity: 1, price: '$49.00' }
    ],
    trackingNumber: '1Z999AA10123456784',
    deliveryDate: 'May 24, 2025',
    shippingAddress: '456 Park Ave, San Francisco, CA 94105'
  },
  {
    id: 'ORD-2024-004',
    date: 'May 18, 2025',
    status: 'In Transit',
    total: '$1,797.00',
    items: [
      { name: 'PowerMax 100Ah Battery', quantity: 3, price: '$599.00' }
    ],
    trackingNumber: '1Z999AA10123456783',
    estimatedDelivery: 'May 27, 2025',
    shippingAddress: '456 Park Ave, San Francisco, CA 94105'
  },
  {
    id: 'ORD-2024-003',
    date: 'May 14, 2025',
    status: 'Processing',
    total: '$3,245.00',
    items: [
      { name: 'Contractor Bundle - 5 Pack', quantity: 1, price: '$2,999.00' },
      { name: 'Fast Charger Station', quantity: 1, price: '$199.00' },
      { name: 'Safety Equipment Kit', quantity: 1, price: '$47.00' }
    ],
    trackingNumber: null,
    estimatedDelivery: 'May 29, 2025',
    shippingAddress: '456 Park Ave, San Francisco, CA 94105'
  },
  {
    id: 'ORD-2024-002',
    date: 'May 5, 2025',
    status: 'Delivered',
    total: '$899.00',
    items: [
      { name: 'EcoCharge 50Ah Battery', quantity: 2, price: '$398.00' },
      { name: 'Universal Mounting Bracket', quantity: 2, price: '$50.00' },
      { name: 'Quick Connect Kit', quantity: 1, price: '$53.00' }
    ],
    trackingNumber: '1Z999AA10123456782',
    deliveryDate: 'May 7, 2025',
    shippingAddress: '789 Oak St, San Francisco, CA 94105'
  }
]

export default function CustomerOrdersPage() {
  // const { user, loading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('customerUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E6F4FF',
          borderTopColor: '#006FEE',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  if (!user) {
    router.push('/customer/auth/login')
    return null
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || order.status.toLowerCase() === selectedStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleReorder = (orderId: string) => {
    // Handle reorder logic
    console.log('Reordering:', orderId)
  }

  const handleTrackShipment = (trackingNumber: string) => {
    // Handle tracking logic
    window.open(`https://tracking.example.com/${trackingNumber}`, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Content area */}
      <div style={{ paddingLeft: 0 }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(to right, #006FEE, #0050B3)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>Order History</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Mike Johnson</span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                MJ
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{ padding: '32px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Page header */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: '#5B6B7D', fontSize: '14px' }}>Track your battery orders and shipments</p>
            </div>

            {/* Search and filters */}
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                  <Search size={20} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#5B6B7D'
                  }} />
                  <input
                    type="text"
                    placeholder="Search orders or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      border: '2px solid #E6F4FF',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#006FEE'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E6F4FF'
                    }}
                  />
                </div>
                <button
                  style={{
                    padding: '12px 20px',
                    border: '2px solid #E6F4FF',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#5B6B7D',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC'
                    e.currentTarget.style.borderColor = '#006FEE'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = '#E6F4FF'
                  }}
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>

              {/* Status filters */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'processing', 'in transit', 'delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: selectedStatus === status ? '#006FEE' : '#E6F4FF',
                      backgroundColor: selectedStatus === status ? '#006FEE' : 'white',
                      color: selectedStatus === status ? 'white' : '#5B6B7D',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredOrders.map((order) => (
                <div key={order.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '2px solid #E6F4FF',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === order.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === order.id ? '0 12px 24px rgba(0, 111, 238, 0.15)' : 'none'
                }}
                onMouseEnter={() => setHoveredCard(order.id)}
                onMouseLeave={() => setHoveredCard(null)}>
                  <div style={{
                    padding: '24px',
                    borderBottom: expandedOrder === order.id ? '2px solid #E6F4FF' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{order.id}</h3>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: order.status === 'Delivered' ? '#F0FDF4' : 
                                           order.status === 'In Transit' ? '#FFF7ED' : 
                                           order.status === 'Processing' ? '#EFF6FF' : '#F3F4F6',
                            color: order.status === 'Delivered' ? '#16A34A' : 
                                  order.status === 'In Transit' ? '#EA580C' : 
                                  order.status === 'Processing' ? '#006FEE' : '#6B7280'
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#5B6B7D' }}>{order.date}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#006FEE' }}>{order.total}</p>
                        <p style={{ fontSize: '14px', color: '#5B6B7D' }}>{order.items.length} items</p>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {order.items.slice(0, 2).map((item, index) => (
                        <span key={index} style={{
                          padding: '8px 16px',
                          backgroundColor: '#E6F4FF',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#006FEE',
                          fontWeight: '500'
                        }}>
                          {item.name}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span style={{
                          padding: '8px 16px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#5B6B7D',
                          fontWeight: '500'
                        }}>
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {order.trackingNumber && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTrackShipment(order.trackingNumber!)
                          }}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#006FEE',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#0050B3'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#006FEE'
                          }}
                        >
                          <Truck size={16} />
                          Track Shipment
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReorder(order.id)
                        }}
                        style={{
                          padding: '10px 20px',
                          border: '2px solid #E6F4FF',
                          backgroundColor: 'white',
                          color: '#006FEE',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC'
                          e.currentTarget.style.borderColor = '#006FEE'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white'
                          e.currentTarget.style.borderColor = '#E6F4FF'
                        }}
                      >
                        <RefreshCw size={16} />
                        Reorder
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        style={{
                          padding: '10px 20px',
                          border: '2px solid #E6F4FF',
                          backgroundColor: 'white',
                          color: '#5B6B7D',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8FAFC'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white'
                        }}
                      >
                        <Download size={16} />
                        Invoice
                      </button>
                    </div>
                  </div>

                  {/* Expanded order details */}
                  {expandedOrder === order.id && (
                    <div style={{ padding: '24px', backgroundColor: '#F8FAFC' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Order items */}
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                            Order Items
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {order.items.map((item, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '16px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '2px solid #E6F4FF'
                              }}>
                                <div>
                                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{item.name}</p>
                                  <p style={{ fontSize: '13px', color: '#5B6B7D' }}>Quantity: {item.quantity}</p>
                                </div>
                                <p style={{ fontSize: '16px', fontWeight: '700', color: '#006FEE' }}>{item.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping information */}
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                            Shipping Information
                          </h4>
                          <div style={{
                            padding: '20px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '2px solid #E6F4FF'
                          }}>
                            <div style={{ marginBottom: '16px' }}>
                              <p style={{ fontSize: '12px', color: '#5B6B7D', marginBottom: '4px' }}>Shipping Address</p>
                              <p style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{order.shippingAddress}</p>
                            </div>
                            {order.trackingNumber && (
                              <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', color: '#5B6B7D', marginBottom: '4px' }}>Tracking Number</p>
                                <p style={{ fontSize: '14px', color: '#006FEE', fontFamily: 'monospace', fontWeight: '600' }}>{order.trackingNumber}</p>
                              </div>
                            )}
                            <div>
                              <p style={{ fontSize: '12px', color: '#5B6B7D', marginBottom: '4px' }}>
                                {order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}
                              </p>
                              <p style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                                {order.deliveryDate || order.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #E6F4FF',
                padding: '48px',
                textAlign: 'center'
              }}>
                <Package size={48} style={{ color: '#E6F4FF', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  No orders found
                </h3>
                <p style={{ color: '#5B6B7D' }}>
                  {searchTerm ? `No orders matching "${searchTerm}"` : 'You haven\'t placed any orders yet'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}