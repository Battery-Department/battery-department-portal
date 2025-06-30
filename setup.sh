#!/bin/bash
# 🚀 Battery Department Customer Portal Setup Script
# Automated setup for development and deployment

set -e

echo "🔋 BATTERY DEPARTMENT CUSTOMER PORTAL SETUP"
echo "============================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check prerequisites
echo ""
echo "🔍 Checking Prerequisites..."
echo "============================="

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js detected: $NODE_VERSION"
    
    # Check if version is 18+
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [[ $NODE_MAJOR -ge 18 ]]; then
        log_success "Node.js version is compatible (v18+)"
    else
        log_error "Node.js version too old. Please install Node.js v18+"
        exit 1
    fi
else
    log_error "Node.js not found. Please install Node.js v18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm detected: v$NPM_VERSION"
else
    log_error "npm not found. Please install npm"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    log_success "Git detected"
else
    log_warning "Git not found. Version control features will be limited"
fi

# Setup environment
echo ""
echo "⚙️ Environment Setup..."
echo "======================"

# Create .env.local if it doesn't exist
if [[ ! -f ".env.local" ]]; then
    log_info "Creating .env.local from template..."
    cp .env.example .env.local
    log_success ".env.local created"
    log_warning "Please configure environment variables in .env.local"
else
    log_info ".env.local already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing Dependencies..."
echo "============================"

log_info "Installing npm packages..."
npm install

if [[ $? -eq 0 ]]; then
    log_success "Dependencies installed successfully"
else
    log_error "Failed to install dependencies"
    exit 1
fi

# Database setup
echo ""
echo "🗄️ Database Setup..."
echo "==================="

if [[ -f "prisma/schema.prisma" ]]; then
    log_info "Generating Prisma client..."
    npx prisma generate
    
    if [[ $? -eq 0 ]]; then
        log_success "Prisma client generated"
    else
        log_warning "Prisma client generation failed. Please check database configuration."
    fi
    
    # Only run migrations if DATABASE_URL is configured
    if grep -q "DATABASE_URL=" .env.local && ! grep -q "your-database-url" .env.local; then
        log_info "Running database migrations..."
        npx prisma migrate dev --name init
        
        if [[ $? -eq 0 ]]; then
            log_success "Database migrations completed"
        else
            log_warning "Database migrations failed. Please check DATABASE_URL configuration."
        fi
    else
        log_warning "DATABASE_URL not configured. Skipping migrations."
        log_info "Please configure DATABASE_URL in .env.local and run: npx prisma migrate dev"
    fi
else
    log_warning "Prisma schema not found. Skipping database setup."
fi

# Build verification
echo ""
echo "🏗️ Build Verification..."
echo "======================="

log_info "Checking TypeScript compilation..."
npx tsc --noEmit

if [[ $? -eq 0 ]]; then
    log_success "TypeScript compilation successful"
else
    log_warning "TypeScript compilation has issues. Check the output above."
fi

# Git initialization
echo ""
echo "📝 Git Setup..."
echo "==============="

if [[ ! -d ".git" ]]; then
    log_info "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Battery Department Customer Portal

🔋 Complete customer portal setup with:
- Next.js 14 with App Router
- TypeScript configuration
- Stripe payment integration
- Prisma database setup
- Tailwind CSS styling
- Authentication system
- Product catalog
- Shopping cart
- Order management

Ready for development and deployment!"
    
    log_success "Git repository initialized"
else
    log_info "Git repository already exists"
fi

# Final setup verification
echo ""
echo "✅ Setup Verification..."
echo "======================="

SETUP_ERRORS=0

# Check essential files
ESSENTIAL_FILES=(
    "package.json"
    "tsconfig.json"
    "next.config.js"
    "tailwind.config.js"
    ".env.local"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "prisma/schema.prisma"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        log_success "$file exists"
    else
        log_error "$file missing"
        ((SETUP_ERRORS++))
    fi
done

# Check essential directories
ESSENTIAL_DIRS=(
    "src/app"
    "src/components"
    "src/lib"
    "src/types"
    "public"
)

for dir in "${ESSENTIAL_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        log_success "$dir directory exists"
    else
        log_error "$dir directory missing"
        ((SETUP_ERRORS++))
    fi
done

echo ""
echo "🎯 SETUP COMPLETE!"
echo "=================="

if [[ $SETUP_ERRORS -eq 0 ]]; then
    log_success "All setup checks passed!"
else
    log_warning "$SETUP_ERRORS issues found. Please review the errors above."
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Configure environment variables in .env.local"
echo "2. Set up your database and run: npx prisma migrate dev"
echo "3. Start development server: npm run dev"
echo "4. Visit http://localhost:3000"
echo ""
echo "🚀 DEPLOYMENT:"
echo "1. Push to GitHub/GitLab"
echo "2. Connect to Render.com"
echo "3. Configure environment variables on Render"
echo "4. Deploy!"
echo ""
echo "📚 DOCUMENTATION:"
echo "- README.md - Complete setup and usage guide"
echo "- docs/deployment.md - Deployment instructions"
echo "- prisma/schema.prisma - Database schema"
echo ""

if [[ $SETUP_ERRORS -eq 0 ]]; then
    log_success "🎉 Battery Department Customer Portal is ready!"
    echo "Happy coding! 🔋⚡"
    exit 0
else
    log_warning "⚠️  Setup completed with warnings. Please address the issues above."
    exit 1
fi