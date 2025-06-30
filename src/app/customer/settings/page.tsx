'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Bell, CreditCard, MapPin, Truck, Eye, EyeOff, Save, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false
  })

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@company.com',
    phone: '(555) 123-4567',
    company: 'Smith Construction Co.',
    title: 'Operations Manager'
  })

  const updateNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="p-8 space-y-6" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, #006FEE, #0050B3)',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0, 111, 238, 0.15)',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'white',
          marginBottom: '8px'
        }}>
          Account Settings
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
          Manage your account preferences and information
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList style={{
          backgroundColor: 'white',
          padding: '4px',
          borderRadius: '8px',
          border: '2px solid #E6F4FF'
        }}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <Button style={{
                  padding: '12px 24px',
                  backgroundColor: '#006FEE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '48px',
                        backgroundColor: '#F9FAFB',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: '8px' }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#F9FAFB',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#F9FAFB',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <Alert style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #3B82F6',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription style={{ color: '#1E40AF', marginLeft: '8px' }}>
                    Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                  </AlertDescription>
                </Alert>

                <Button style={{
                  padding: '12px 24px',
                  backgroundColor: '#006FEE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Authentication</p>
                  <p className="text-sm text-gray-600">Receive security codes via text message</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                  <Switch 
                    checked={notifications.orderUpdates}
                    onCheckedChange={() => updateNotification('orderUpdates')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Promotions & Deals</p>
                    <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                  </div>
                  <Switch 
                    checked={notifications.promotions}
                    onCheckedChange={() => updateNotification('promotions')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Newsletter</p>
                    <p className="text-sm text-gray-600">Monthly updates about products and company news</p>
                  </div>
                  <Switch 
                    checked={notifications.newsletter}
                    onCheckedChange={() => updateNotification('newsletter')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={() => updateNotification('sms')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4567</p>
                        <p className="text-sm text-gray-600">Expires 12/26</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" style={{
                  width: '100%',
                  padding: '12px 24px',
                  border: '2px solid #E6F4FF',
                  backgroundColor: 'white',
                  color: '#006FEE',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                <Input placeholder="Street Address" style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#F9FAFB',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="City" style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} />
                  <Select>
                    <SelectTrigger style={{
                      backgroundColor: '#F9FAFB',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="ZIP Code" style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }} />
                </div>
                <Button style={{
                  padding: '12px 24px',
                  backgroundColor: '#006FEE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Save Billing Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Addresses
              </CardTitle>
              <CardDescription>
                Manage your shipping addresses for faster checkout
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Primary Address</p>
                      <p className="text-sm text-gray-600">123 Construction Ave</p>
                      <p className="text-sm text-gray-600">New York, NY 10001</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" style={{
                  width: '100%',
                  padding: '12px 24px',
                  border: '2px solid #E6F4FF',
                  backgroundColor: 'white',
                  color: '#006FEE',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Add New Address
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '2px solid #E6F4FF',
            padding: '32px'
          }}>
            <CardHeader className="p-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Shipping Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultShipping">Default Shipping Method</Label>
                  <Select>
                    <SelectTrigger style={{
                      backgroundColor: '#F9FAFB',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px'
                    }}>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (5-7 days) - FREE</SelectItem>
                      <SelectItem value="express">Express (2-3 days) - $29.99</SelectItem>
                      <SelectItem value="overnight">Overnight - $59.99</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Delivery Instructions</p>
                    <p className="text-sm text-gray-600">Always require signature for delivery</p>
                  </div>
                  <Switch />
                </div>

                <Button style={{
                  padding: '12px 24px',
                  backgroundColor: '#006FEE',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}