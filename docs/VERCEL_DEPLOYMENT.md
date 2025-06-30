# Vercel Deployment Guide

This guide walks you through deploying the Battery Department Customer Portal to Vercel.

## Prerequisites

- Vercel account (free tier works)
- GitHub repository connected
- PostgreSQL database (Vercel Postgres, Supabase, or external)

## Deployment Steps

### 1. Connect GitHub Repository

1. Log in to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `Battery-Department/battery-department-portal` repository

### 2. Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Set Environment Variables

In the Vercel dashboard, go to Settings → Environment Variables and add:

#### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Authentication
NEXTAUTH_SECRET="generate-a-random-string"
JWT_SECRET="generate-another-random-string"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Email Configuration

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@batterydepartment.com"
```

#### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="XXXXXXXXXXXXXXX"

# AI Features
OPENAI_API_KEY="sk-..."

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT="true"
NEXT_PUBLIC_ENABLE_QUIZ="true"
NEXT_PUBLIC_ENABLE_FLEET_MANAGEMENT="true"
```

### 4. Database Setup

#### Option A: Vercel Postgres

1. Go to Storage tab in Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: External Database (Supabase, Neon, etc.)

1. Create a PostgreSQL database
2. Copy the connection string
3. Add to Vercel environment variables
4. Ensure SSL is enabled (`?sslmode=require`)

### 5. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for the build to complete (3-5 minutes)
3. Your app will be available at `https://your-project.vercel.app`

### 6. Post-Deployment

#### Set up Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-project.vercel.app/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

#### Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Run Database Seed (Optional)

```bash
# Connect to your production database
export DATABASE_URL="your-production-database-url"

# Run seed
npm run db:seed
```

## Troubleshooting

### Build Failures

1. **TypeScript errors**: Already disabled in `next.config.js`
2. **Missing dependencies**: Check `package.json` is complete
3. **Environment variables**: Ensure all required vars are set

### Runtime Errors

1. **Database connection**: Verify `DATABASE_URL` is correct
2. **API routes failing**: Check function timeouts (default 10s)
3. **Stripe errors**: Verify API keys and webhook secret

### Performance Optimization

1. Enable caching:
   ```javascript
   export const revalidate = 3600; // Cache for 1 hour
   ```

2. Use Vercel Edge Functions for faster responses:
   ```javascript
   export const runtime = 'edge';
   ```

3. Enable ISR (Incremental Static Regeneration) for product pages

## Monitoring

1. **Vercel Analytics**: Automatically included
2. **Function Logs**: Available in Vercel dashboard
3. **Error Tracking**: Consider adding Sentry

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Set environment variables from CLI
vercel env add DATABASE_URL
```

## Cost Considerations

- **Free Tier**: 100GB bandwidth, suitable for testing
- **Pro Tier**: $20/month for production use
- **Database**: Vercel Postgres starts at $15/month
- **Functions**: 1M requests included in Pro

## Security Best Practices

1. Enable Vercel Authentication for preview deployments
2. Use environment variables for all secrets
3. Enable CORS only for your domains
4. Implement rate limiting for API routes
5. Regular security updates

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Support](https://vercel.com/support)