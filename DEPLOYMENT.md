# Battery Department Portal - Render Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Battery Department Customer Portal to Render.com. The application is a Next.js 14 e-commerce platform with PostgreSQL database, Prisma ORM, and Stripe payment integration.

## Prerequisites

- GitHub account with repository access
- Render.com account
- Stripe account for payment processing
- SMTP service for email notifications (e.g., Resend, SendGrid)

## Deployment Architecture

- **Web Service**: Next.js application running on Node.js
- **Database**: PostgreSQL managed by Render
- **File Storage**: Static assets served from Next.js
- **CDN**: Render's global CDN for static assets

## Step-by-Step Deployment

### 1. Fork or Clone Repository

Ensure your code is pushed to a GitHub repository that Render can access.

### 2. Create Render Account

Sign up at [render.com](https://render.com) and connect your GitHub account.

### 3. Deploy Using render.yaml

The repository includes a `render.yaml` file that automates the deployment process:

1. In Render Dashboard, click "New" → "Blueprint"
2. Connect your GitHub repository
3. Select the branch to deploy (usually `main`)
4. Review the services that will be created:
   - Web service: `battery-department-portal`
   - PostgreSQL database: `battery-department-db`
5. Click "Apply" to create services

### 4. Configure Environment Variables

After deployment, configure the following environment variables in Render Dashboard:

#### Required Variables:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `SMTP_HOST`: Email service hostname
- `SMTP_USER`: Email service username
- `SMTP_PASSWORD`: Email service password

#### Optional Variables:
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID
- `NEXT_PUBLIC_META_PIXEL_ID`: Meta Pixel ID
- `OPENAI_API_KEY`: OpenAI API key for AI features

### 5. Database Setup

The build process automatically:
1. Generates Prisma client
2. Runs database migrations
3. Creates necessary tables and indexes

To seed initial data (optional):
```bash
npx prisma db seed
```

### 6. Configure Stripe Webhooks

1. In Stripe Dashboard, create a webhook endpoint:
   - URL: `https://your-app.onrender.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.failed`

2. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` environment variable

### 7. Health Monitoring

The application includes a health check endpoint at `/api/health` that monitors:
- Database connectivity
- Stripe configuration
- Email service status
- Environment variables

Render automatically uses this endpoint for health monitoring.

## Production Considerations

### Security
- All environment variables are encrypted at rest
- Use strong, unique values for:
  - `NEXTAUTH_SECRET`
  - `JWT_SECRET`
- Enable Render's DDoS protection

### Performance
- Application uses Next.js standalone mode for optimal performance
- Docker multi-stage build minimizes image size
- Prisma queries are optimized with proper indexes

### Scaling
- Upgrade from Starter plan for:
  - More CPU/RAM
  - Auto-scaling capabilities
  - Zero-downtime deploys
  - Priority support

### Backups
- Render automatically backs up PostgreSQL databases
- Configure additional backup retention as needed
- Export critical data regularly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render Dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility (requires 18+)

2. **Database Connection Errors**
   - Verify DATABASE_URL is correctly set
   - Check database is in same region as web service
   - Ensure Prisma client is generated

3. **Missing Environment Variables**
   - Check `/api/health` endpoint for missing variables
   - Verify all required variables are set in Render Dashboard
   - Use correct variable names (case-sensitive)

4. **Stripe Webhook Failures**
   - Verify webhook endpoint URL
   - Check STRIPE_WEBHOOK_SECRET matches Stripe Dashboard
   - Review webhook logs in Stripe Dashboard

### Debug Commands

Connect to your service via Render Shell:
```bash
# Check environment variables
env | grep -E "DATABASE|STRIPE|SMTP"

# Test database connection
npx prisma db pull

# View application logs
pm2 logs

# Check disk usage
df -h
```

## Maintenance

### Updating the Application

1. Push changes to GitHub
2. Render automatically deploys on push to main branch
3. Monitor deployment in Render Dashboard
4. Check health endpoint after deployment

### Database Migrations

For schema changes:
1. Update Prisma schema
2. Create migration locally: `npx prisma migrate dev`
3. Commit migration files
4. Push to GitHub (auto-deploys and runs migrations)

### Manual Deployment

If automatic deployment is disabled:
1. Go to service in Render Dashboard
2. Click "Manual Deploy"
3. Select commit to deploy
4. Monitor deployment progress

## Monitoring

### Application Metrics
- View in Render Dashboard → Metrics
- Monitor CPU, Memory, Disk usage
- Set up alerts for thresholds

### Logs
- Access via Render Dashboard → Logs
- Filter by service, time range
- Download logs for analysis

### Custom Monitoring
- Integrate with services like:
  - Sentry for error tracking
  - LogRocket for session replay
  - DataDog for APM

## Cost Optimization

### Starter Plan Limitations
- Spins down after 15 minutes of inactivity
- Limited CPU/RAM
- Suitable for development/testing

### Production Recommendations
- Use Individual or Team plan for production
- Enable auto-scaling for traffic spikes
- Use Render's CDN for static assets
- Optimize images with Next.js Image component

## Support

### Render Support
- Documentation: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Status: [status.render.com](https://status.render.com)

### Application Issues
- Check application logs
- Review error responses
- Test locally with production environment variables
- Create GitHub issue for bugs

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] render.yaml configured correctly
- [ ] All environment variables set
- [ ] Database migrations created
- [ ] Stripe webhooks configured
- [ ] Health check endpoint working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place

## Next Steps

1. Monitor initial deployment
2. Test all critical user flows
3. Configure custom domain
4. Set up monitoring alerts
5. Plan for scaling strategy

---

For questions or issues, please create a GitHub issue or contact support.