'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  ArrowRight,
  Gift,
  TrendingUp,
  Package,
  Truck,
  Shield,
  Star,
  Zap,
  AlertCircle
} from 'lucide-react'
import SmartRecommendations from '@/components/cart/recommendation-engine/SmartRecommendations'

// FlexVolt battery products
const batteryProducts = [
  {
    id: '6Ah',
    name: '6Ah FlexVolt Battery',
    runtime: 'Up to 4 hours',
    weight: '1.9 lbs',
    price: 95,
    msrp: 169,
    voltage: "20V/60V",
    features: "Compatible with all DeWalt 20V/60V tools",
    workOutput: '225 screws / 175 ft cuts',
    chargingTime: '45 minutes',
    savings: 44,
    popular: false
  },
  {
    id: '9Ah',
    name: '9Ah FlexVolt Battery',
    runtime: 'Up to 6.5 hours',
    weight: '2.4 lbs',
    price: 125,
    msrp: 249,
    voltage: "20V/60V",
    features: "Compatible with all DeWalt 20V/60V tools",
    workOutput: '340 screws / 260 ft cuts',
    chargingTime: '55 minutes',
    savings: 50,
    popular: true
  },
  {
    id: '15Ah',
    name: '15Ah FlexVolt Battery',
    runtime: 'Up to 10 hours',
    weight: '3.2 lbs',
    price: 245,
    msrp: 379,
    voltage: "20V/60V",
    features: "Compatible with all DeWalt 20V/60V tools",
    workOutput: '565 screws / 435 ft cuts',
    chargingTime: '90 minutes',
    savings: 35,
    popular: false
  }
]

// Volume discount tiers
const discountTiers = [
  { threshold: 1000, discount: '10% OFF', percentage: 0.10, color: '#10B981' },
  { threshold: 2500, discount: '15% OFF', percentage: 0.15, color: '#006FEE' },
  { threshold: 5000, discount: '20% OFF', percentage: 0.20, color: '#7C3AED' }
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  msrp: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isVisible, setIsVisible] = useState(false)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error('Error parsing saved cart:', error)
        // Fallback to default cart items
        setCartItems([
          { id: '9Ah', name: '9Ah FlexVolt Battery', price: 125, quantity: 8, msrp: 249 },
          { id: '6Ah', name: '6Ah FlexVolt Battery', price: 95, quantity: 4, msrp: 169 },
          { id: '15Ah', name: '15Ah FlexVolt Battery', price: 245, quantity: 2, msrp: 379 }
        ])
      }
    } else {
      // Default cart items for new users
      setCartItems([
        { id: '9Ah', name: '9Ah FlexVolt Battery', price: 125, quantity: 8, msrp: 249 },
        { id: '6Ah', name: '6Ah FlexVolt Battery', price: 95, quantity: 4, msrp: 169 },
        { id: '15Ah', name: '15Ah FlexVolt Battery', price: 245, quantity: 2, msrp: 379 }
      ])
    }
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } else {
      localStorage.removeItem('cart')
    }
  }, [cartItems])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change)
          return newQuantity === 0 
            ? null 
            : { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const msrpTotal = cartItems.reduce((sum, item) => sum + (item.msrp * item.quantity), 0)
  
  // Calculate current discount
  let currentDiscount = 0
  let discountPercentage = 0
  for (let i = discountTiers.length - 1; i >= 0; i--) {
    const tier = discountTiers[i]
    if (tier && subtotal >= tier.threshold) {
      discountPercentage = tier.percentage
      break
    }
  }
  currentDiscount = subtotal * discountPercentage
  const finalTotal = subtotal - currentDiscount

  // Find next tier
  const nextTier = discountTiers.find(tier => subtotal < tier.threshold)
  const nextTierAmount = nextTier ? nextTier.threshold - subtotal : 0

  // Progress calculation
  let progressPercentage = 0
  if (nextTier) {
    const currentTierIndex = discountTiers.findIndex(tier => tier.threshold === nextTier.threshold) - 1
    const currentTierThreshold = currentTierIndex >= 0 ? (discountTiers[currentTierIndex]?.threshold ?? 0) : 0
    const tierRange = nextTier.threshold - currentTierThreshold
    const progressInTier = subtotal - currentTierThreshold
    progressPercentage = Math.min(100, (progressInTier / tierRange) * 100)
  } else {
    progressPercentage = 100
  }

  return (
    <div style={{ 
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s ease-in-out'
    }}>
      {/* Blue Gradient Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0048AC 0%, #006FEE 50%, #0084FF 100%)',
        color: 'white',
        padding: '60px 24px 40px',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 16px 48px rgba(0, 111, 238, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '12px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <ShoppingCart size={24} />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '0',
              lineHeight: '1.1'
            }}>
              Shopping Cart
            </h1>
          </div>

          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            lineHeight: '1.6',
            marginBottom: '0'
          }}>
            Review your FlexVolt battery order and unlock volume discounts
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Cart Items */}
          <div>
            {/* Volume Discount Progress */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
              border: '1px solid #E6F4FF'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <TrendingUp size={20} color="#006FEE" />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0A051E',
                  margin: 0
                }}>
                  Volume Discount Progress
                </h3>
              </div>

              {/* Progress Bar */}
              <div style={{
                position: 'relative',
                height: '40px',
                background: '#F3F4F6',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                    borderRadius: '20px',
                    transition: 'width 0.6s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '12px'
                  }}
                >
                  {progressPercentage > 20 && (
                    <span style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      ${subtotal.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Tier markers */}
                {discountTiers.map((tier, index) => {
                  const maxThreshold = Math.max(...discountTiers.map(t => t.threshold))
                  const position = (tier.threshold / maxThreshold) * 100
                  const isReached = subtotal >= tier.threshold
                  const isActive = discountPercentage === tier.percentage
                  
                  return (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${Math.min(95, Math.max(5, position))}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isReached ? tier.color : 'white',
                        border: `3px solid ${isReached ? tier.color : '#E5E7EB'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: '700',
                        color: isReached ? 'white' : '#64748B',
                        zIndex: 2,
                        boxShadow: isActive ? `0 0 12px ${tier.color}40` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {tier.discount.replace(' OFF', '')}
                    </div>
                  )
                })}
              </div>

              {/* Current status */}
              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#64748B'
              }}>
                {discountPercentage > 0 ? (
                  <span style={{ color: '#10B981', fontWeight: '600' }}>
                    🎉 You&apos;re saving {(discountPercentage * 100).toFixed(0)}%! 
                    {nextTier && (
                      <> Add ${nextTierAmount.toLocaleString()} more for {nextTier.discount}</>
                    )}
                  </span>
                ) : (
                  <span>
                    Add ${nextTierAmount.toLocaleString()} to unlock{' '}
                    <span style={{ fontWeight: '600', color: '#006FEE' }}>
                      {nextTier?.discount}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
              border: '1px solid #E6F4FF',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: cartItems.length > 0 ? '1px solid #E6F4FF' : 'none'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0A051E',
                  margin: 0
                }}>
                  {cartItems.length > 0 
                    ? `Cart Items (${cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)`
                    : 'Your Cart is Empty'
                  }
                </h3>
              </div>

              {cartItems.length === 0 ? (
                /* Empty State */
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px'
                }}>
                  {/* Empty Cart Icon */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #E6F4FF 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #E6F4FF'
                  }}>
                    <ShoppingCart size={48} color="#94A3B8" />
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0A051E',
                      marginBottom: '8px'
                    }}>
                      No FlexVolt Batteries Yet
                    </h4>
                    <p style={{
                      fontSize: '16px',
                      color: '#64748B',
                      lineHeight: '1.6',
                      marginBottom: '0',
                      maxWidth: '400px'
                    }}>
                      Start building your battery collection with professional-grade FlexVolt batteries. 
                      Compatible with all DeWalt 20V/60V tools.
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => router.push('/customer/products')}
                      style={{
                        background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                        color: 'white',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 8px 24px rgba(0, 111, 238, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 111, 238, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 111, 238, 0.3)'
                      }}
                    >
                      <Package size={20} />
                      Browse FlexVolt Batteries
                    </button>
                    
                    <button
                      onClick={() => router.push('/customer/quiz')}
                      style={{
                        background: 'transparent',
                        color: '#006FEE',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        border: '2px solid #006FEE',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#006FEE'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#006FEE'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <Zap size={20} />
                      Take Battery Quiz
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '24px',
                    borderBottom: index < cartItems.length - 1 ? '1px solid #F1F5F9' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '120px',
                    height: '90px',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #E6F4FF',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Battery Body */}
                    <div style={{
                      width: '70px',
                      height: '45px',
                      background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)',
                      borderRadius: '6px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                    }}>
                      {/* Battery Terminal */}
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '15px',
                        width: '8px',
                        height: '8px',
                        background: '#FFD700',
                        borderRadius: '2px'
                      }} />
                      
                      {/* DeWalt Logo Area */}
                      <div style={{
                        fontSize: '8px',
                        fontWeight: 'bold',
                        color: '#000',
                        textAlign: 'center'
                      }}>
                        {item.id}
                      </div>
                    </div>
                    
                    {/* FlexVolt Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      fontSize: '8px',
                      fontWeight: '600',
                      color: '#FFD700',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      FLEXVOLT
                    </div>
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0A051E',
                      marginBottom: '4px'
                    }}>
                      {item.name}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#006FEE'
                      }}>
                        ${item.price}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#64748B',
                        textDecoration: 'line-through'
                      }}>
                        MSRP ${item.msrp}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{
                          padding: '8px 16px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#0A051E',
                          minWidth: '40px',
                          textAlign: 'center'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: '8px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0A051E'
                    }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748B'
                    }}>
                      Save ${((item.msrp - item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* Quick Reorder Section */}
            {cartItems.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '24px',
                boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
                border: '1px solid #E6F4FF'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0A051E',
                  marginBottom: '16px'
                }}>
                  🚀 Quick Add More
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {batteryProducts.filter(product => !cartItems.some(item => item.id === product.id)).map(product => (
                    <div
                      key={product.id}
                      style={{
                        padding: '16px',
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        border: '1px solid #E6F4FF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#0A051E',
                            marginBottom: '4px'
                          }}>
                            {product.name}
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: '#64748B',
                            marginBottom: '8px'
                          }}>
                            {product.runtime}
                          </p>
                        </div>
                        {product.popular && (
                          <span style={{
                            background: '#10B981',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            POPULAR
                          </span>
                        )}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#006FEE'
                          }}>
                            ${product.price}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: '#64748B',
                            textDecoration: 'line-through',
                            marginLeft: '8px'
                          }}>
                            ${product.msrp}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            const newItem: CartItem = {
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              msrp: product.msrp
                            }
                            setCartItems(prev => [...prev, newItem])
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Plus size={12} />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Recommendations */}
            <SmartRecommendations
              cartItems={cartItems}
              userProfile={{
                customerId: 'demo_customer',
                jobType: 'commercial',
                experienceLevel: 'professional',
                purchaseHistory: ['9Ah', '6Ah', 'DCB115'],
                preferences: {
                  budget: 'mid-range',
                  workload: 'heavy',
                  brands: ['DeWalt']
                }
              }}
              orderHistory={[
                {
                  id: 'order_1',
                  items: [
                    { id: '9Ah', name: '9Ah FlexVolt Battery', price: 125, quantity: 2, msrp: 249 },
                    { id: 'DCB115', name: 'Fast Charger', price: 49, quantity: 1, msrp: 79 }
                  ],
                  total: 299,
                  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]}
              onAddToCart={(item) => {
                const newItem = {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  msrp: item.msrp
                }
                setCartItems(prev => [...prev, newItem])
              }}
              className="mt-6"
            />
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
              border: '1px solid #E6F4FF',
              position: 'sticky',
              top: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A051E',
                marginBottom: '20px'
              }}>
                Order Summary
              </h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#64748B' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>${subtotal.toLocaleString()}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#64748B' }}>MSRP Total</span>
                <span style={{ 
                  textDecoration: 'line-through',
                  color: '#94A3B8'
                }}>
                  ${msrpTotal.toLocaleString()}
                </span>
              </div>

              {discountPercentage > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  color: '#10B981'
                }}>
                  <span>Volume Discount ({(discountPercentage * 100).toFixed(0)}%)</span>
                  <span style={{ fontWeight: '600' }}>
                    -${currentDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#64748B' }}>Shipping</span>
                <span style={{ fontWeight: '600', color: '#10B981' }}>FREE</span>
              </div>

              <hr style={{
                border: 'none',
                borderTop: '1px solid #E6F4FF',
                margin: '16px 0'
              }} />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <span style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#0A051E'
                }}>
                  Total
                </span>
                <span style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#006FEE'
                }}>
                  ${finalTotal.toLocaleString()}
                </span>
              </div>

              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <CheckCircle size={16} color="#10B981" />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10B981'
                  }}>
                    Total Savings: ${(msrpTotal - finalTotal).toLocaleString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#059669'
                }}>
                  You&apos;re saving {(((msrpTotal - finalTotal) / msrpTotal) * 100).toFixed(0)}% vs MSRP
                </div>
              </div>

              <button
                onClick={() => router.push('/customer/checkout')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0, 111, 238, 0.3)',
                  transition: 'all 0.3s ease',
                  marginBottom: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 111, 238, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 111, 238, 0.3)'
                }}
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => router.push('/customer/products')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#006FEE',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #006FEE',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#006FEE'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#006FEE'
                }}
              >
                Continue Shopping
              </button>

              {/* Badges */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #F1F5F9'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#64748B'
                }}>
                  <Truck size={14} color="#10B981" />
                  Free shipping on all orders
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#64748B'
                }}>
                  <Shield size={14} color="#10B981" />
                  12-month warranty included
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#64748B'
                }}>
                  <Star size={14} color="#10B981" />
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 400px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}