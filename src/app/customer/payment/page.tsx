'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  Download,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState(0)
  const [showAddCard, setShowAddCard] = useState(false)

  // Mock data - would come from API
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      brand: 'Mastercard',
      expiry: '03/26',
      isDefault: false
    }
  ])

  const [invoices] = useState([
    {
      id: 'INV-2025-001',
      date: '2025-05-15',
      amount: 4599.00,
      status: 'paid',
      description: 'Tesla Powerwall 2 + Installation'
    },
    {
      id: 'INV-2025-002',
      date: '2025-05-10',
      amount: 2999.00,
      status: 'paid',
      description: 'LG Chem RESU 10H'
    },
    {
      id: 'INV-2025-003',
      date: '2025-05-03',
      amount: 1599.00,
      status: 'pending',
      description: 'Enphase IQ7+ Microinverters'
    }
  ])

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280'
    },
    grid: {
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    cardTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827'
    },
    paymentMethod: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      borderRadius: '8px',
      border: '2px solid #e5e7eb',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    paymentMethodSelected: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4'
    },
    creditCardIcon: {
      width: '48px',
      height: '32px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      borderRadius: '6px',
      marginRight: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonSecondary: {
      backgroundColor: '#374151',
      color: 'white'
    },
    invoice: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      marginBottom: '12px'
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    badgePaid: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    badgePending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Payment & Billing</h1>
        <p style={styles.subtitle}>Manage your payment methods and view invoices</p>
      </div>

      <div style={styles.grid}>
        {/* Payment Methods */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <CreditCard size={20} />
              Payment Methods
            </div>
            <button
              onClick={() => setShowAddCard(true)}
              style={styles.button}
            >
              <Plus size={16} />
              Add Card
            </button>
          </div>

          {paymentMethods.map((method, index) => (
            <div
              key={method.id}
              style={{
                ...styles.paymentMethod,
                ...(selectedCard === index ? styles.paymentMethodSelected : {})
              }}
              onClick={() => setSelectedCard(index)}
            >
              <div style={styles.creditCardIcon}>
                {method.brand}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {method.brand} •••• {method.last4}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Expires {method.expiry}
                </div>
              </div>
              {method.isDefault && (
                <div style={{ ...styles.badge, ...styles.badgePaid }}>
                  Default
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Invoices */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <FileText size={20} />
              Recent Invoices
            </div>
          </div>

          {invoices.map((invoice) => (
            <div key={invoice.id} style={styles.invoice}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {invoice.id}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {new Date(invoice.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  ...styles.badge,
                  ...(invoice.status === 'paid' ? styles.badgePaid : styles.badgePending)
                }}>
                  {invoice.status}
                </div>
                <span style={{ fontWeight: '600' }}>${invoice.amount.toFixed(2)}</span>
                <button
                  style={{
                    ...styles.button,
                    ...styles.buttonSecondary,
                    padding: '6px 12px'
                  }}
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Summary */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <DollarSign size={20} />
            Billing Summary
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#6b7280' }}>Current Balance</span>
              <span style={{ fontWeight: '600', fontSize: '20px' }}>$1,599.00</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#6b7280' }}>Due Date</span>
              <span style={{ fontWeight: '500' }}>June 1, 2025</span>
            </div>

            <button
              style={{
                ...styles.button,
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                marginTop: '24px'
              }}
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <AlertCircle size={20} />
            Payment Settings
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <input type="checkbox" defaultChecked style={{ marginRight: '12px' }} />
              <span>Enable automatic payments</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <input type="checkbox" defaultChecked style={{ marginRight: '12px' }} />
              <span>Send invoice reminders</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" style={{ marginRight: '12px' }} />
              <span>Require approval for large orders</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}