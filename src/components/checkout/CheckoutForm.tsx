'use client'
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */


import { useState } from 'react'
import { useForm } from 'react-hook-form'
const useCart = () => ({ cart: { items: [], totals: { subtotal: 0, tax: 0, shipping: 0, total: 0, discountAmount: 0, volumeDiscount: null } }, loading: false }) as any
const Button = ({ children, ...props }: any) => <button {...props}>{children}</button>
const Input = ({ ...props }: any) => <input {...props} />
const Label = ({ children, ...props }: any) => <label {...props}>{children}</label>
const Select = ({ children, ...props }: any) => <select {...props}>{children}</select>
const SelectContent = ({ children }: any) => <>{children}</>
const SelectItem = ({ children, value }: any) => <option value={value}>{children}</option>
const SelectTrigger = ({ children }: any) => <>{children}</>
const SelectValue = ({ placeholder }: any) => <option value="">{placeholder}</option>
const Checkbox = ({ ...props }: any) => <input type="checkbox" {...props} />
const Card = ({ children, ...props }: any) => <div {...props}>{children}</div>
const CardContent = ({ children, ...props }: any) => <div {...props}>{children}</div>
const CardHeader = ({ children, ...props }: any) => <div {...props}>{children}</div>
const CardTitle = ({ children, ...props }: any) => <h3 {...props}>{children}</h3>
const Separator = () => <hr />
import { CreditCard, Lock, Truck, CheckCircle } from 'lucide-react'

interface CheckoutFormData {
  customerEmail: string
  customerName: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  billingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  useSameAddress: boolean
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export function CheckoutForm() {
  const { cart, loading: cartLoading } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useSameAddress, setUseSameAddress] = useState(true)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    defaultValues: {
      useSameAddress: true,
      shippingAddress: {
        country: 'US'
      },
      billingAddress: {
        country: 'US'
      }
    }
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true)
      
      const checkoutData = {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        shippingAddress: data.shippingAddress,
        billingAddress: useSameAddress ? data.shippingAddress : data.billingAddress
      }
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Checkout failed')
      }
      
      const result = await response.json()
      
      // Redirect to Stripe checkout
      if (result.sessionUrl) {
        window.location.href = result.sessionUrl
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to process checkout')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart?.items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-4">Your cart is empty</h1>
        <p className="text-[#6B7280] mb-6">Add some items to your cart before checkout.</p>
        <Button
          className="bg-[#006FEE] hover:bg-[#0050B3] text-white"
          onClick={() => window.location.href = '/customer/products'}
        >
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Checkout</h1>
        <p className="text-[#6B7280]">Complete your order for FlexVolt batteries</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-2 border-[#E6F4FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#111827]">
                  <CheckCircle className="h-5 w-5 text-[#006FEE]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="mt-1"
                    placeholder="your@email.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-[#EF4444] mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    {...register('customerName', { required: 'Name is required' })}
                    className="mt-1"
                    placeholder="John Doe"
                  />
                  {errors.customerName && (
                    <p className="text-sm text-[#EF4444] mt-1">{errors.customerName.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-2 border-[#E6F4FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#111827]">
                  <Truck className="h-5 w-5 text-[#006FEE]" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shippingName">Full Name *</Label>
                  <Input
                    id="shippingName"
                    {...register('shippingAddress.name', { required: 'Name is required' })}
                    className="mt-1"
                  />
                  {errors.shippingAddress?.name && (
                    <p className="text-sm text-[#EF4444] mt-1">{errors.shippingAddress.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="shippingStreet">Street Address *</Label>
                  <Input
                    id="shippingStreet"
                    {...register('shippingAddress.street', { required: 'Street address is required' })}
                    className="mt-1"
                    placeholder="123 Main Street"
                  />
                  {errors.shippingAddress?.street && (
                    <p className="text-sm text-[#EF4444] mt-1">{errors.shippingAddress.street.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">City *</Label>
                    <Input
                      id="shippingCity"
                      {...register('shippingAddress.city', { required: 'City is required' })}
                      className="mt-1"
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-[#EF4444] mt-1">{errors.shippingAddress.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="shippingState">State *</Label>
                    <Select onValueChange={(value: any) => setValue('shippingAddress.state', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-[#EF4444] mt-1">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="shippingZip">ZIP Code *</Label>
                  <Input
                    id="shippingZip"
                    {...register('shippingAddress.zip', { 
                      required: 'ZIP code is required',
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Invalid ZIP code format'
                      }
                    })}
                    className="mt-1"
                    placeholder="12345"
                  />
                  {errors.shippingAddress?.zip && (
                    <p className="text-sm text-[#EF4444] mt-1">{errors.shippingAddress.zip.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="border-2 border-[#E6F4FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#111827]">
                  <CreditCard className="h-5 w-5 text-[#006FEE]" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="useSameAddress"
                    checked={useSameAddress}
                    onCheckedChange={(checked: any) => {
                      setUseSameAddress(checked as boolean)
                      setValue('useSameAddress', checked as boolean)
                    }}
                  />
                  <Label htmlFor="useSameAddress" className="text-sm">
                    Same as shipping address
                  </Label>
                </div>
                
                {!useSameAddress && (
                  <div className="space-y-4">
                    {/* Billing address fields - similar to shipping */}
                    <p className="text-sm text-[#6B7280]">
                      Please enter your billing address details (similar form fields as shipping)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="border-2 border-[#E6F4FF] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#111827]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cart?.items?.map((item: any) => {
                    const price = typeof item.price === 'number' ? item.price : Number(item.price)
                    const itemTotal = price * item.quantity
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium text-[#111827]">{item?.product?.name || 'Product'}</p>
                          <p className="text-[#6B7280]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${itemTotal.toFixed(2)}</p>
                      </div>
                    )
                  })}
                </div>
                
                <Separator />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#374151]">
                    <span>Subtotal</span>
                    <span>${cart.totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {cart.totals.volumeDiscount && (
                    <div className="flex justify-between text-[#10B981]">
                      <span>{cart.totals.volumeDiscount.label}</span>
                      <span>-${cart.totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-[#374151]">
                    <span>Tax</span>
                    <span>${cart.totals.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#374151]">
                    <span>Shipping</span>
                    <span>{cart.totals.shipping === 0 ? 'FREE' : `$${cart.totals.shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#111827]">Total</span>
                    <span className="text-[#006FEE]">${cart.totals.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#006FEE] hover:bg-[#0050B3] text-white font-semibold py-3"
                  disabled={isSubmitting}
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 111, 238, 0.25)'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Secure Checkout
                    </div>
                  )}
                </Button>
                
                {/* Security Badge */}
                <div className="text-center text-xs text-[#6B7280] pt-2">
                  <p className="flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Secured by Stripe
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}