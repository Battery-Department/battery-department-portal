'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, CreditCard, FileText, ChevronRight, Truck, Clock, Shield, Package, 
  Battery, CheckCircle, Trash2
} from 'lucide-react';
import { ProductGrid } from '@/components/battery/ProductGrid';
import { PackageCard, PackageData } from '@/components/battery/PackageCard';
import { ProductData } from '@/components/battery/ProductCard';
import { ProductGridSkeleton } from '@/components/battery/ProductSkeleton';
import { VolumeDiscountVisualizer, useDiscountRecommendations } from '@/components/battery/VolumeDiscountVisualizer';
import { Card, CardContent } from '@/components/ui/card';

// Force dynamic rendering with no cache
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const batteriesData: ProductData[] = [
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
    workOutput: '560 screws / 430 ft cuts',
    chargingTime: '90 minutes',
    savings: 35,
    popular: false
  }
];

const discountTiers = [
  { threshold: 1000, percentage: 10 },
  { threshold: 2500, percentage: 15 },
  { threshold: 5000, percentage: 20 }
];

const jobsiteSolutions: PackageData[] = [
  {
    id: 'starter',
    name: "STARTER CREW PACKAGE",
    teamSize: "1-3 person teams",
    details: ["2× 6Ah", "2× 9Ah", "2× 15Ah"],
    price: 1270,
    msrp: 1649,
    savings: 379,
    hours: 64,
    description: "Most popular for residential contractors",
    purchases: 127,
    isPopular: false,
    features: [
      "64 hours total runtime",
      "Perfect for small crews",
      "Covers all tool types"
    ],
    quantities: { '6Ah': 2, '9Ah': 2, '15Ah': 2 }
  },
  {
    id: 'midsize',
    name: "MID-SIZE CREW PACKAGE",
    teamSize: "4-6 person teams",
    details: ["10× 6Ah", "10× 9Ah", "5× 15Ah"],
    price: 4425,
    msrp: 5530,
    savings: 1105,
    hours: 224,
    description: "Recommended for commercial projects",
    purchases: 86,
    isPopular: true,
    features: [
      "224 hours total runtime",
      "Optimal for medium crews",
      "Best value per battery"
    ],
    quantities: { '6Ah': 10, '9Ah': 10, '15Ah': 5 }
  },
  {
    id: 'workforce',
    name: "FULL WORKFORCE SOLUTION",
    teamSize: "7-12 person teams",
    details: ["15× 6Ah", "20× 9Ah", "15× 15Ah"],
    price: 8875,
    msrp: 11095,
    savings: 2220,
    hours: 450,
    description: "Preferred by general contractors",
    purchases: 42,
    isPopular: false,
    features: [
      "450 hours total runtime",
      "Complete fleet solution",
      "Maximum savings"
    ],
    quantities: { '6Ah': 15, '9Ah': 20, '15Ah': 15 }
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<{[key: string]: number}>({
    '6Ah': 0,
    '9Ah': 0,
    '15Ah': 0
  });
  const [showCartDetails, setShowCartDetails] = useState(true);
  const [activeTab, setActiveTab] = useState('batteries');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const subtotal = Object.entries(quantities).reduce((sum, [battery, qty]) => {
    const batteryData = batteriesData.find(b => b.id === battery);
    return sum + (batteryData ? batteryData.price * qty : 0);
  }, 0);

  // Calculate discount
  let discountPercentage = 0;
  for (const tier of [...discountTiers].reverse()) {
    if (subtotal >= tier.threshold) {
      discountPercentage = tier.percentage;
      break;
    }
  }

  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const updateQuantity = (battery: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [battery]: Math.max(0, (prev[battery] ?? 0) + delta)
    }));
  };

  const addPackageToCart = (packageQuantities: { [key: string]: number }) => {
    setQuantities(prev => ({
      '6Ah': (prev['6Ah'] ?? 0) + (packageQuantities['6Ah'] || 0),
      '9Ah': (prev['9Ah'] ?? 0) + (packageQuantities['9Ah'] || 0),
      '15Ah': (prev['15Ah'] ?? 0) + (packageQuantities['15Ah'] || 0)
    }));
    setShowCartDetails(true);
  };

  const clearCart = () => {
    setQuantities({ '6Ah': 0, '9Ah': 0, '15Ah': 0 });
  };

  const handleCheckout = () => {
    const orderData = {
      items: quantities,
      subtotal,
      discount: discountAmount,
      total,
      discountPercentage
    };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    router.push('/customer/checkout');
  };

  const handleInvoice = () => {
    const orderData = {
      items: quantities,
      subtotal,
      discount: discountAmount,
      total,
      discountPercentage
    };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    router.push('/customer/invoice');
  };

  // Get next discount tier
  const nextTier = discountTiers.find(t => t.threshold > subtotal);
  const amountToNextTier = nextTier ? nextTier.threshold - subtotal : 0;

  // Product prices for discount calculations
  const productPrices = React.useMemo(() => {
    const prices: Record<string, number> = {};
    batteriesData.forEach(battery => {
      prices[battery.id] = battery.price;
    });
    return prices;
  }, []);

  // Discount recommendations
  const discountData = useDiscountRecommendations(quantities, productPrices);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#0048AC] via-[#006FEE] to-[#0084FF] text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
          <div className="relative px-6 py-12 text-center">
            <div className="max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-6">
                <Package size={20} />
                <span className="font-semibold text-sm">BULK SAVINGS: 20% OFF BULK ORDERS</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                HEAVY-DUTY FLEXVOLT BATTERIES
              </h1>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span>WORKS WITH ALL YOUR DEWALT 20V/60V TOOLS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} />
                  <span>UPS SHIPPING</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} />
                  <span>ZERO-HASSLE REPLACEMENTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button
              onClick={() => setActiveTab('batteries')}
              className={`relative px-6 py-4 font-semibold transition-all duration-200 ${
                activeTab === 'batteries'
                  ? 'bg-[#006FEE] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Battery size={20} />
                Individual Batteries
              </div>
              {activeTab === 'batteries' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`relative px-6 py-4 font-semibold transition-all duration-200 ${
                activeTab === 'packages'
                  ? 'bg-[#006FEE] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package size={20} />
                Complete Jobsite Packages
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              {activeTab === 'packages' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
              )}
            </button>
          </div>
        </Card>

        {/* Products Section */}
        {activeTab === 'batteries' && (
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-3">
              {isLoading ? (
                <ProductGridSkeleton count={3} />
              ) : (
                <ProductGrid
                  products={batteriesData}
                  quantities={quantities}
                  onUpdateQuantity={updateQuantity}
                />
              )}
            </div>
            
            {/* Volume Discount Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <VolumeDiscountVisualizer
                  currentAmount={subtotal}
                  discountTiers={discountTiers.map(tier => ({
                    ...tier,
                    label: tier.threshold === 1000 ? 'Small fleet discount' : 
                           tier.threshold === 2500 ? 'Medium fleet discount' : 
                           'Large fleet discount'
                  }))}
                  onTargetClick={(tier) => {
                    // Auto-suggest products to reach the tier
                    const recommendations = discountData.recommendations;
                    if (recommendations.length > 0) {
                      const rec = recommendations[0];
                      if (rec) {
                        updateQuantity(rec.productId, rec.quantity);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Packages Section */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {jobsiteSolutions.map(pkg => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onAddToCart={addPackageToCart}
              />
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {totalItems > 0 && (
          <Card className="sticky bottom-4 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#0A051E]">Your Order</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCartDetails(!showCartDetails)}
                    className="text-[#006FEE] text-sm font-medium hover:underline"
                  >
                    {showCartDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              {showCartDetails && (
                <div className="mb-4 space-y-3">
                  {Object.entries(quantities).map(([batteryId, qty]) => {
                    if (qty === 0) return null;
                    const battery = batteriesData.find(b => b.id === batteryId);
                    if (!battery) return null;
                    
                    return (
                      <div
                        key={batteryId}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-[#0A051E]">{battery.name}</p>
                          <p className="text-sm text-gray-600">
                            ${battery.price} × {qty} = ${(battery.price * qty).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => updateQuantity(batteryId, -qty)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Discount Progress */}
              {nextTier && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#0A051E]">
                      {discountPercentage > 0 
                        ? `You're saving ${discountPercentage}%!` 
                        : 'Unlock bulk savings'}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${amountToNextTier.toFixed(0)} to {nextTier.percentage}% off
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#006FEE] transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / nextTier.threshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount ({discountPercentage}%)</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-[#0A051E] pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#006FEE]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleCheckout}
                  className="bg-[#006FEE] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#0059D1] transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Checkout
                </button>
                <button
                  onClick={handleInvoice}
                  className="border-2 border-[#006FEE] text-[#006FEE] py-3 px-6 rounded-xl font-semibold hover:bg-[#F0F9FF] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Get Invoice
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Free shipping on orders over $1,000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>12-month warranty on all batteries</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Same-day processing for orders before 2PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty Cart */}
        {totalItems === 0 && (
          <Card className="text-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Select batteries or packages above to get started
            </p>
            <button
              onClick={() => setActiveTab('batteries')}
              className="px-6 py-3 bg-[#006FEE] text-white rounded-xl font-semibold hover:bg-[#0059D1] transition-colors"
            >
              Browse Products
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}