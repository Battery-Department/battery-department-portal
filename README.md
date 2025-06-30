# 🔋 Battery Department Customer Portal

A modern, self-serve battery marketplace built with Next.js, TypeScript, and Stripe integration.

**Deployment Status**: Ready for production

## 🌟 Features

- **Product Catalog**: Browse and compare battery products
- **Smart Quiz**: AI-powered battery recommendation system
- **Shopping Cart**: Persistent cart with real-time calculations
- **Secure Checkout**: Stripe-powered payment processing
- **User Accounts**: Registration, login, order history
- **Fleet Management**: Bulk ordering and subscription management
- **Customer Support**: Integrated chat and support system
- **Mobile Responsive**: Optimized for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- SMTP email service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Battery_Dep_Main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Setup database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Email**: Nodemailer
- **Deployment**: Render.com

### Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Customer dashboard
│   ├── products/       # Product catalog
│   ├── cart/          # Shopping cart
│   ├── checkout/      # Checkout flow
│   ├── account/       # Account management
│   ├── orders/        # Order history
│   └── api/           # API routes
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── auth/          # Authentication components
│   ├── cart/          # Cart components
│   ├── checkout/      # Checkout components
│   └── products/      # Product components
├── hooks/             # Custom React hooks
├── services/          # Business logic services
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## 💳 Stripe Integration

The portal includes comprehensive Stripe integration:

- **Payment Intent API**: Secure payment processing
- **Webhook Handling**: Real-time payment status updates
- **Subscription Management**: For fleet customers
- **Tax Calculation**: Automatic tax calculation
- **Invoice Generation**: PDF invoice creation

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Configure webhook endpoints for payment status updates
4. Set up tax rates and shipping zones

## 📊 Features Deep Dive

### Smart Quiz System

AI-powered recommendation engine that suggests optimal battery solutions based on:
- Usage patterns
- Power requirements
- Budget constraints
- Environmental factors

### Fleet Management

Enterprise features for bulk customers:
- Volume pricing
- Subscription management
- Usage analytics
- Automated reordering

### Customer Support

Integrated support system with:
- Live chat functionality
- Ticket management
- Knowledge base
- FAQ system

## 🚀 Deployment

### Render.com Deployment

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Select "Web Service" type

2. **Configure Build**
   - Build Command: `./build.sh`
   - Start Command: `npm start`
   - Environment: Node

3. **Environment Variables**
   - Set all required environment variables
   - Configure database connection
   - Add Stripe keys

4. **Database Setup**
   - Create PostgreSQL database on Render
   - Run migrations: `npx prisma migrate deploy`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Analytics & Monitoring

The portal includes:
- Google Analytics integration
- Meta Pixel for conversion tracking
- Custom event tracking
- Performance monitoring
- Error boundary logging

## 🔒 Security Features

- **Authentication**: Secure user authentication with NextAuth.js
- **Authorization**: Role-based access control
- **Data Validation**: Comprehensive input validation
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting
- **Secure Headers**: Security headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ by the Battery Department team
