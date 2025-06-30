import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Battery,
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  Clock,
  Star,
  ChevronRight,
  Calculator,
  MessageCircle,
  Award
} from 'lucide-react'

const FeaturedProduct = ({ name, price, originalPrice, image, badge }: {
  name: string
  price: string
  originalPrice?: string
  image: string
  badge?: string
}) => (
  <Card className="interactive-card group cursor-pointer">
    <CardHeader className="p-4">
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <Battery className="w-12 h-12 text-blue-600" />
      </div>
      {badge && (
        <Badge variant="secondary" className="w-fit mb-2">
          {badge}
        </Badge>
      )}
      <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
        {name}
      </CardTitle>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">{price}</span>
        {originalPrice && (
          <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Button className="w-full" size="sm">
        Add to Cart
      </Button>
    </CardContent>
  </Card>
)

const FeatureCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <Card className="text-center">
    <CardContent className="p-6">
      <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </CardContent>
  </Card>
)

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Battery Department</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors">
                Battery Quiz
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link href="/customer/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/customer/cart">
                <Button size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Power Your Projects with
            <span className="block text-yellow-400">Professional Batteries</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Discover premium lithium-ion batteries for DeWalt, Milwaukee, Makita, and more. 
            Professional-grade power solutions for contractors and DIY enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
                Shop Batteries
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Calculator className="w-5 h-5 mr-2" />
                Find My Battery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Battery Department?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Zap}
              title="High Performance"
              description="Premium lithium-ion technology for maximum power and runtime"
            />
            <FeatureCard
              icon={Shield}
              title="Quality Guaranteed"
              description="All batteries come with comprehensive warranty and quality assurance"
            />
            <FeatureCard
              icon={Truck}
              title="Fast Shipping"
              description="Free shipping on orders over $50 with expedited delivery options"
            />
            <FeatureCard
              icon={Award}
              title="Expert Support"
              description="Get professional advice from our battery specialists"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="outline">
                View All Products
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeaturedProduct
              name="DeWalt 20V MAX 6.0Ah"
              price="$159.99"
              originalPrice="$199.99"
              image="/products/dewalt-6ah.jpg"
              badge="Best Seller"
            />
            <FeaturedProduct
              name="Milwaukee M18 9.0Ah"
              price="$189.99"
              originalPrice="$229.99"
              image="/products/milwaukee-9ah.jpg"
              badge="High Capacity"
            />
            <FeaturedProduct
              name="Makita 18V LXT 5.0Ah"
              price="$139.99"
              image="/products/makita-5ah.jpg"
              badge="Professional"
            />
            <FeaturedProduct
              name="Ryobi ONE+ 4.0Ah"
              price="$79.99"
              originalPrice="$99.99"
              image="/products/ryobi-4ah.jpg"
              badge="Budget Pick"
            />
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Tools to Help You Choose</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="interactive-card">
              <CardHeader>
                <Calculator className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Battery Quiz</CardTitle>
                <CardDescription>
                  Answer a few questions to find the perfect battery for your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/quiz">
                  <Button className="w-full">Start Quiz</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="interactive-card">
              <CardHeader>
                <Zap className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Runtime Calculator</CardTitle>
                <CardDescription>
                  Calculate how long your battery will last with specific tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/calculator">
                  <Button className="w-full">Calculate Runtime</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="interactive-card">
              <CardHeader>
                <MessageCircle className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Expert Chat</CardTitle>
                <CardDescription>
                  Get instant help from our battery specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/chat">
                  <Button className="w-full">Start Chat</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Mike Johnson",
                role: "Contractor",
                content: "Best battery selection and prices I've found. Fast shipping and great customer service.",
                rating: 5
              },
              {
                name: "Sarah Davis",
                role: "DIY Enthusiast",
                content: "The battery quiz helped me find exactly what I needed. Saved me time and money!",
                rating: 5
              },
              {
                name: "Tom Wilson",
                role: "Electrician",
                content: "Reliable batteries that last all day. Perfect for professional use.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Power Up?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of professionals who trust Battery Department for their power needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Create Account
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Battery className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">Battery Department</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted source for premium battery solutions since 2020.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products/dewalt" className="hover:text-white">DeWalt Batteries</Link></li>
                <li><Link href="/products/milwaukee" className="hover:text-white">Milwaukee Batteries</Link></li>
                <li><Link href="/products/makita" className="hover:text-white">Makita Batteries</Link></li>
                <li><Link href="/products/ryobi" className="hover:text-white">Ryobi Batteries</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/support/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/support/warranty" className="hover:text-white">Warranty</Link></li>
                <li><Link href="/support/shipping" className="hover:text-white">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/customer/auth/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/customer/auth/register" className="hover:text-white">Create Account</Link></li>
                <li><Link href="/customer/orders" className="hover:text-white">Order History</Link></li>
                <li><Link href="/customer/account" className="hover:text-white">Account Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Battery Department. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}