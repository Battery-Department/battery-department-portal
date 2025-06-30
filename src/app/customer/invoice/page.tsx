'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Zap, Calendar, CheckCircle, Download, Printer, ArrowLeft } from 'lucide-react';

// Force dynamic rendering with no cache
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Print CSS
const printStyles = `
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    
    /* Hide mobile header and action buttons for print */
    .no-print {
      display: none !important;
    }
    
    /* Ensure proper page breaks */
    .page-break-inside-avoid {
      page-break-inside: avoid;
    }
    
    /* Remove shadows and borders for cleaner print */
    .print-clean {
      box-shadow: none !important;
      border: 1px solid #e0e0e0 !important;
    }
  }
`;

export default function InvoicePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get data from sessionStorage (passed from products page)
  const [invoiceData, setInvoiceData] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem('invoiceData');
    if (storedData) {
      setInvoiceData(JSON.parse(storedData));
    }
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!mounted) {
    return null;
  }

  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 30);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Generate invoice number
  const invoiceNumber = `INV-${today.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
  
  // Create payment reference number for accounting systems
  const paymentReference = `BD-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000) + 1000}`;
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality will be implemented with a PDF generation library');
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      {/* Mobile Header */}
      {isMobile && (
        <div className="no-print" style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          borderBottom: '1px solid #E6F4FF',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50
        }}>
          <button
            onClick={() => router.push('/customer/products')}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#006FEE',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#003D88'
          }}>Invoice</h3>
          
          <div style={{ width: '60px' }}></div>
        </div>
      )}
      
      <div style={{
        padding: isMobile ? '16px' : '32px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          padding: isMobile ? '24px' : '40px'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            marginBottom: '32px',
            gap: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                  padding: '12px',
                  borderRadius: '12px',
                  marginRight: '12px'
                }}>
                  <Zap size={24} color="white" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#0A051E',
                    margin: 0
                  }}>Battery Department LLC</h1>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748B',
                    margin: 0
                  }}>Professional Power Solutions</p>
                </div>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748B',
                lineHeight: '1.6'
              }}>
                <p style={{ margin: '2px 0' }}>1250 Industrial Parkway</p>
                <p style={{ margin: '2px 0' }}>Chicago, IL 60642</p>
                <p style={{ margin: '2px 0' }}>Tax ID: 87-1234567</p>
                <p style={{ margin: '2px 0' }}>support@batterydepartment.com</p>
                <p style={{ margin: '2px 0' }}>(312) 555-7890</p>
              </div>
            </div>
            
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{
                background: '#F1F5F9',
                padding: '20px',
                borderRadius: '12px',
                display: 'inline-block'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#0A051E',
                  marginBottom: '4px'
                }}>INVOICE</h2>
                <p style={{
                  color: '#64748B',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>{invoiceNumber}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isMobile ? 'flex-start' : 'flex-end',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  <Calendar size={16} color="#006FEE" style={{ marginRight: '6px' }} />
                  <span style={{ color: '#64748B' }}>
                    <span style={{ fontWeight: '600' }}>Date:</span> {formatDate(today)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isMobile ? 'flex-start' : 'flex-end',
                  fontSize: '14px',
                  marginTop: '4px'
                }}>
                  <Calendar size={16} color="#006FEE" style={{ marginRight: '6px' }} />
                  <span style={{ color: '#64748B' }}>
                    <span style={{ fontWeight: '600' }}>Due:</span> {formatDate(dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Info */}
          <div style={{
            marginBottom: '32px',
            background: '#F8FAFC',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#64748B',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Bill To:</h3>
            <p style={{ color: '#0A051E', fontWeight: '600', margin: '4px 0' }}>Construction Partners Inc.</p>
            <p style={{ color: '#64748B', margin: '4px 0' }}>Attn: Site Manager</p>
            <p style={{ color: '#64748B', margin: '4px 0' }}>4570 Construction Way</p>
            <p style={{ color: '#64748B', margin: '4px 0' }}>Denver, CO 80223</p>
          </div>
          
          {/* Order Summary */}
          <div style={{
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FileText size={18} color="#006FEE" style={{ marginRight: '8px' }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0A051E'
            }}>Order Summary</h3>
          </div>
          
          <div style={{
            background: '#E6F4FF',
            padding: '12px 16px',
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2px'
          }}>
            <CheckCircle size={16} color="#10B981" style={{ marginRight: '6px' }} />
            <span style={{
              color: '#006FEE',
              fontSize: '14px',
              fontWeight: '600'
            }}>JOBSITE SAVINGS: 20% OFF BULK ORDERS</span>
          </div>
          
          {/* Table */}
          <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748B'
                  }}>SKU</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748B'
                  }}>Item Description</th>
                  <th style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748B'
                  }}>Qty</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748B'
                  }}>Unit Price</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748B'
                  }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item: any, index: number) => {
                  const sku = `BD-FV${item.type}-PRO`;
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #E6F4FF' }}>
                      <td style={{ padding: '16px', color: '#64748B', fontFamily: 'monospace' }}>
                        {sku}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#0A051E' }}>
                          Battery Department FlexVolt {item.type} Professional Series
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748B',
                          marginTop: '4px'
                        }}>
                          Compatible with DeWalt® 20V/60V Tools - USA Made
                        </div>
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: '#0A051E'
                      }}>{item.quantity}</td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'right',
                        color: '#0A051E'
                      }}>${item.unitPrice.toFixed(2)}</td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#0A051E'
                      }}>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '32px'
          }}>
            <div style={{
              width: isMobile ? '100%' : '350px'
            }}>
              <div style={{
                background: '#F8FAFC',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <span style={{ color: '#0A051E' }}>${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  color: '#10B981'
                }}>
                  <span style={{ fontWeight: '600' }}>Bulk Order Discount (20%):</span>
                  <span style={{ fontWeight: '600' }}>-${invoiceData.discount.toFixed(2)}</span>
                </div>
                <div style={{
                  borderTop: '2px solid #E6F4FF',
                  marginTop: '12px',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '700'
                }}>
                  <span style={{ color: '#0A051E' }}>Total:</span>
                  <span style={{ fontSize: '20px', color: '#006FEE' }}>${invoiceData.total.toFixed(2)}</span>
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#64748B',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  Maximum discount applied - Thank you for your business!
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Reference for Accounting */}
          <div style={{
            background: '#E6F4FF',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #BAE0FF'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
                  Purchase Order Reference:
                </span>
                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#0A051E', fontFamily: 'monospace' }}>
                  _________________________
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
                  Payment Reference:
                </span>
                <span style={{ marginLeft: '8px', fontSize: '14px', color: '#0A051E', fontFamily: 'monospace', fontWeight: '600' }}>
                  {paymentReference}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Legal Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#64748B',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>Payment Terms</h4>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>
                NET 30 - Payment due within 30 days of invoice date
              </p>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>
                ACH/Wire: Contact accounting@batterydepartment.com
              </p>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>
                Check payable to: Battery Department LLC
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
                Tax ID: 87-1234567
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#64748B',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>Product Warranty & Legal</h4>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  12-MONTH WARRANTY - NO QUESTIONS ASKED
                </span>
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>
                Warranty covers Battery Department batteries only
              </p>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Compatible with DeWalt® tools - Will not void tool warranty
              </p>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#EA580C',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              IMPORTANT LEGAL NOTICE
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#7C2D12',
              lineHeight: '1.5',
              marginBottom: '6px'
            }}>
              <strong>Battery Department LLC is not affiliated with DeWalt®, Stanley Black & Decker, or their subsidiaries.</strong>
              DeWalt® is a registered trademark of Stanley Black & Decker, Inc. and is used solely for compatibility reference.
            </p>
            <p style={{
              fontSize: '13px',
              color: '#7C2D12',
              lineHeight: '1.5'
            }}>
              Battery Department LLC manufactures and sells its own brand of premium replacement batteries. 
              All products are made in the USA and designed for compatibility with DeWalt® 20V and 60V tools.
              Our warranty covers only the batteries we supply and does not extend to any power tool equipment.
            </p>
          </div>
          
          {/* Actions */}
          <div className="no-print" style={{
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'linear-gradient(135deg, #006FEE 0%, #0084FF 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 111, 238, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 111, 238, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 111, 238, 0.2)';
              }}
            >
              <Printer size={18} />
              Print Invoice
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                background: '#F1F5F9',
                color: '#0A051E',
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
              }}
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
          
          {/* Footer */}
          <div style={{
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid #E6F4FF',
            textAlign: 'center',
            fontSize: '12px',
            color: '#64748B'
          }}>
            <p>Questions? Contact our support team at support@batterydepartment.com or call (312) 555-7890</p>
            <p style={{ marginTop: '4px' }}>
              Battery Department LLC | Professional Portable Power Solutions | www.batterydepartment.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}