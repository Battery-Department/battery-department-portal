'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HelpCircle,
  MessageCircle,
  FileText,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronRight,
  Star,
  Send,
  Paperclip,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Truck,
  Package,
  CreditCard,
  User,
  Plus
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  date: string
  lastUpdate: string
  description: string
}

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  expanded?: boolean
}

export default function SupportPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('tickets')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  })

  // Mock support tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      subject: 'Question about 15Ah battery compatibility',
      status: 'resolved',
      priority: 'medium',
      category: 'Technical',
      date: '2024-12-30',
      lastUpdate: '2024-12-31',
      description: 'Need clarification on tool compatibility for the 15Ah FlexVolt battery'
    },
    {
      id: 'TKT-002',
      subject: 'Bulk order discount calculation',
      status: 'in-progress',
      priority: 'low',
      category: 'Billing',
      date: '2024-12-29',
      lastUpdate: '2024-12-30',
      description: 'Need help understanding how volume discounts are applied to mixed orders'
    },
    {
      id: 'TKT-003',
      subject: 'Expedited shipping for urgent order',
      status: 'open',
      priority: 'high',
      category: 'Shipping',
      date: '2024-12-28',
      lastUpdate: '2024-12-28',
      description: 'Need batteries delivered by tomorrow for critical project'
    }
  ])

  // Mock FAQ data
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: 'What is the warranty period for FlexVolt batteries?',
      answer: 'All FlexVolt batteries come with a comprehensive 12-month warranty covering manufacturing defects and performance issues. The warranty includes free replacement and covers normal wear and tear.',
      category: 'Warranty',
      helpful: 24,
      notHelpful: 2
    },
    {
      id: 2,
      question: 'How do volume discounts work?',
      answer: 'Volume discounts are automatically applied based on your order total: 10% off at $1,000+, 15% off at $2,500+, and 20% off at $5,000+. Discounts apply to the entire order and can be combined with promotional offers.',
      category: 'Pricing',
      helpful: 31,
      notHelpful: 1
    },
    {
      id: 3,
      question: 'What tools are compatible with FlexVolt batteries?',
      answer: 'FlexVolt batteries are compatible with all DeWalt 20V MAX and 60V MAX tools. They automatically switch between 20V and 60V depending on the tool, providing maximum versatility for your projects.',
      category: 'Technical',
      helpful: 18,
      notHelpful: 0
    },
    {
      id: 4,
      question: 'How long does shipping take?',
      answer: 'We offer free standard shipping (3-5 business days) on all orders. Expedited shipping options include 2-day ($15) and overnight ($35) delivery. Orders placed before 2 PM EST ship the same day.',
      category: 'Shipping',
      helpful: 27,
      notHelpful: 3
    },
    {
      id: 5,
      question: 'Can I return or exchange batteries?',
      answer: 'Yes, we offer a 30-day return policy for unused batteries in original packaging. Defective batteries can be exchanged under warranty. Return shipping is free for defective items.',
      category: 'Returns',
      helpful: 15,
      notHelpful: 1
    },
    {
      id: 6,
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status in the Order History section of your account dashboard.',
      category: 'Orders',
      helpful: 22,
      notHelpful: 0
    }
  ])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444'
      case 'in-progress': return '#F59E0B'
      case 'resolved': return '#10B981'
      case 'closed': return '#64748B'
      default: return '#64748B'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626'
      case 'high': return '#EA580C'
      case 'medium': return '#CA8A04'
      case 'low': return '#65A30D'
      default: return '#64748B'
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (id: number) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ))
  }

  const submitTicket = () => {
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      status: 'open',
      priority: newTicket.priority as any,
      category: newTicket.category,
      date: new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10),
      lastUpdate: new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10),
      description: newTicket.description
    }
    
    setTickets(prev => [ticket, ...prev])
    setNewTicket({ subject: '', category: '', priority: 'medium', description: '' })
    setShowNewTicket(false)
    alert('Support ticket created successfully!')
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
              <HelpCircle size={24} />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '0',
              lineHeight: '1.1'
            }}>
              Support Center
            </h1>
          </div>

          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            lineHeight: '1.6',
            marginBottom: '0'
          }}>
            Get help with your FlexVolt battery orders and technical questions
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Support Options Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
            border: '1px solid #E6F4FF',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Phone size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0A051E',
              marginBottom: '8px'
            }}>
              Phone Support
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Speak directly with our battery experts
            </p>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#10B981',
              marginBottom: '8px'
            }}>
              1-800-BATTERY
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748B'
            }}>
              Mon-Fri 8AM-8PM EST
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
            border: '1px solid #E6F4FF',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Mail size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0A051E',
              marginBottom: '8px'
            }}>
              Email Support
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Get detailed technical assistance
            </p>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#006FEE',
              marginBottom: '8px'
            }}>
              support@lithibattery.com
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748B'
            }}>
              Response within 2 hours
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
            border: '1px solid #E6F4FF',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <MessageCircle size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0A051E',
              marginBottom: '8px'
            }}>
              Live Chat
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Instant help from our team
            </p>
            <button
              onClick={() => router.push('/customer/chat')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start Chat
            </button>
            <div style={{
              fontSize: '12px',
              color: '#64748B',
              marginTop: '8px'
            }}>
              Available 24/7
            </div>
          </div>
        </div>

        {/* Main Support Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 111, 238, 0.08)',
          border: '1px solid #E6F4FF',
          overflow: 'hidden'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #E6F4FF'
          }}>
            <button
              onClick={() => setActiveTab('tickets')}
              style={{
                flex: 1,
                padding: '20px',
                background: activeTab === 'tickets' ? '#E6F4FF' : 'transparent',
                color: activeTab === 'tickets' ? '#006FEE' : '#64748B',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <FileText size={20} />
              Support Tickets
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              style={{
                flex: 1,
                padding: '20px',
                background: activeTab === 'faq' ? '#E6F4FF' : 'transparent',
                color: activeTab === 'faq' ? '#006FEE' : '#64748B',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <HelpCircle size={20} />
              FAQ
            </button>
          </div>

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0A051E',
                  margin: 0
                }}>
                  Your Support Tickets
                </h2>
                <button
                  onClick={() => setShowNewTicket(true)}
                  style={{
                    background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Plus size={16} />
                  New Ticket
                </button>
              </div>

              {/* New Ticket Form */}
              {showNewTicket && (
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid #E2E8F0'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#0A051E',
                    marginBottom: '16px'
                  }}>
                    Create New Support Ticket
                  </h3>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({...prev, subject: e.target.value}))}
                        placeholder="Brief description of your issue"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #E6F4FF',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Category *
                      </label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket(prev => ({...prev, category: e.target.value}))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #E6F4FF',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Billing">Billing</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Returns">Returns</option>
                        <option value="Orders">Orders</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Priority
                      </label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket(prev => ({...prev, priority: e.target.value}))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #E6F4FF',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Description *
                    </label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({...prev, description: e.target.value}))}
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #E6F4FF',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={submitTicket}
                      disabled={!newTicket.subject || !newTicket.category || !newTicket.description}
                      style={{
                        background: newTicket.subject && newTicket.category && newTicket.description
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : '#94A3B8',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: newTicket.subject && newTicket.category && newTicket.description ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Send size={16} />
                      Submit Ticket
                    </button>
                    <button
                      onClick={() => setShowNewTicket(false)}
                      style={{
                        background: 'transparent',
                        color: '#64748B',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: '2px solid #E2E8F0',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Tickets List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#006FEE'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#0A051E'
                          }}>
                            {ticket.subject}
                          </span>
                          <span style={{
                            background: getStatusColor(ticket.status) + '15',
                            color: getStatusColor(ticket.status),
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                          <span style={{
                            background: getPriorityColor(ticket.priority) + '15',
                            color: getPriorityColor(ticket.priority),
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}>
                            {ticket.priority}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748B',
                          marginBottom: '8px'
                        }}>
                          {ticket.description}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '12px',
                          color: '#94A3B8'
                        }}>
                          <span>#{ticket.id}</span>
                          <span>{ticket.category}</span>
                          <span>Created: {new Date(ticket.date).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="#94A3B8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0A051E',
                  margin: 0
                }}>
                  Frequently Asked Questions
                </h2>
              </div>

              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  position: 'relative',
                  flex: 1
                }}>
                  <Search 
                    size={20} 
                    color="#94A3B8"
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search FAQs..."
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 44px',
                      border: '2px solid #E6F4FF',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '12px',
                    border: '2px solid #E6F4FF',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    minWidth: '150px'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Warranty">Warranty</option>
                  <option value="Returns">Returns</option>
                  <option value="Orders">Orders</option>
                </select>
              </div>

              {/* FAQ Items */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        padding: '20px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#0A051E'
                      }}>
                        {faq.question}
                      </span>
                      {faq.expanded ? (
                        <ChevronDown size={20} color="#64748B" />
                      ) : (
                        <ChevronRight size={20} color="#64748B" />
                      )}
                    </button>
                    
                    {faq.expanded && (
                      <div style={{
                        padding: '0 20px 20px',
                        borderTop: '1px solid #E2E8F0'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          color: '#64748B',
                          lineHeight: '1.6',
                          marginBottom: '16px'
                        }}>
                          {faq.answer}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#94A3B8'
                          }}>
                            Was this helpful?
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <button style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#10B981',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              👍 {faq.helpful}
                            </button>
                            <button style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#EF4444',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              👎 {faq.notHelpful}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Help Section */}
        <div style={{
          background: 'linear-gradient(135deg, #E6F4FF 0%, #F0F9FF 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          border: '1px solid #006FEE20'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#0A051E',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Need Quick Help?
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Get instant answers to common questions about FlexVolt batteries
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #006FEE20',
              textAlign: 'center'
            }}>
              <Package size={24} color="#006FEE" style={{ margin: '0 auto 12px' }} />
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A051E',
                marginBottom: '8px'
              }}>
                Battery Compatibility
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                Check tool compatibility guide
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #006FEE20',
              textAlign: 'center'
            }}>
              <Truck size={24} color="#006FEE" style={{ margin: '0 auto 12px' }} />
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A051E',
                marginBottom: '8px'
              }}>
                Shipping Information
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                Track orders and delivery
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #006FEE20',
              textAlign: 'center'
            }}>
              <Shield size={24} color="#006FEE" style={{ margin: '0 auto 12px' }} />
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A051E',
                marginBottom: '8px'
              }}>
                Warranty Claims
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                File warranty claims
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #006FEE20',
              textAlign: 'center'
            }}>
              <CreditCard size={24} color="#006FEE" style={{ margin: '0 auto 12px' }} />
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#0A051E',
                marginBottom: '8px'
              }}>
                Billing Support
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                Payment and invoice help
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '2fr 1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}