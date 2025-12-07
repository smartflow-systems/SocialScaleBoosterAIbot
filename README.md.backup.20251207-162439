# SmartFlow AI - AI E-Commerce Social Media Bot Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/smartflowsystems/smartflow-ai)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/smartflowsystems/smartflow-ai)

A premium no-code AI platform designed to automate e-commerce social media sales through intelligent bot builders. Create, manage, and deploy social media automation bots across multiple platforms to increase engagement and drive revenue.

**Part of the SmartFlow Systems ecosystem** - Premium AI automation solutions for modern businesses.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Freemium Model](#freemium-model)
- [Stripe Integration](#stripe-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Functionality

#### Multi-Platform Bot Management
- **TikTok Integration**: Automated posting and engagement
- **Instagram Integration**: Story, post, and reel automation
- **Facebook Integration**: Page and group management
- **Twitter Integration**: Tweet scheduling and engagement
- **YouTube Integration**: Video promotion and community management

#### AI-Powered Content Generation
- **Google Gemini AI Integration**: Advanced content creation
- **OpenAI Post Generator**: Generate 3 optimized posts per request
- **Hashtag Enhancement**: AI-powered hashtag optimization
- **Tone Adjustment**: Customizable brand voice and style
- **Vibe Detection**: Automatic content mood analysis

#### Advanced Analytics Dashboard
- **Revenue Tracking**: Real-time revenue monitoring ($4,550+ tracked)
- **ROI Metrics**: 340% average ROI calculations
- **Engagement Rates**: Platform-specific performance tracking
- **Chart.js Visualization**: Interactive charts and graphs
- **Performance Analytics**: Comprehensive KPI dashboard
- **Export Capabilities**: CSV/JSON data export

#### Comprehensive Marketplace
- **Template System**: Pre-built bot configurations
- **Category Filtering**: E-commerce, Beauty, Fashion, Technology
- **Search Functionality**: Find templates quickly
- **Premium Templates**: Exclusive Pro-tier templates
- **Community Ratings**: User reviews and ratings
- **One-Click Deployment**: Apply templates instantly

#### Smart Scheduling System
- **Advanced Cron UI**: Visual scheduling interface
- **If-Then Automation**: Conditional posting rules
- **Peak Hours Optimization**: AI-driven posting times
- **Engagement Threshold**: Automatic posting triggers
- **Multi-timezone Support**: Global scheduling

#### Bot Personality Designer
- **Tone Sliders**: Customize communication style
- **Formality Levels**: Professional to casual range
- **Enthusiasm Control**: Energy level adjustment
- **Creativity Settings**: Innovation vs. consistency
- **Real-time Preview**: See changes instantly
- **Personality Presets**: Quick configuration templates

#### Platform Integration Wizard
- **Multi-step Setup**: Guided integration process
- **Secure API Management**: Encrypted credential storage
- **OAuth Support**: Secure platform authentication
- **Connection Testing**: Verify integrations
- **Status Monitoring**: Real-time connection health

### Premium Features

#### Freemium Monetization Model
- **Free Tier**: 3-bot limit for free users
- **Pro Plan**: $49/month unlimited bots
- **Premium Templates**: Exclusive Pro content
- **Advanced Analytics**: Enhanced reporting for Pro users
- **Priority Support**: Dedicated support channels

#### Stripe Payment Integration
- **Subscription Management**: Automated billing
- **One-Time Purchases**: Premium template sales
- **Payment Success Notifications**: Real-time updates
- **Webhook Support**: Subscription lifecycle events
- **Secure Processing**: PCI-compliant payments
- **Invoice Generation**: Automatic billing statements

### Design and User Experience

#### Premium UI/UX
- **Dark Theme**: Black and gold SFS branding
- **Glassmorphism**: Modern glass effects
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Smooth Animations**: Framer Motion integration

#### SEO-Optimized Landing Page
- **Server-Side Rendering**: Crawlable content
- **Static HTML**: Optimized meta tags
- **Schema Markup**: Rich snippets support
- **Performance Optimized**: Fast page loads
- **Conversion Focused**: Designed for signups

## Getting Started

### Prerequisites

- **Node.js** 20.0.0 or higher
- **PostgreSQL** 14+ (for production)
- **Stripe Account** (for payment processing)
- **Google Gemini API Key** (for AI features)
- **Git** for version control

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/smartflowsystems/smartflow-ai.git
cd smartflow-ai
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**:
```bash
# Push database schema
npm run db:push
```

5. **Start development server**:
```bash
npm run dev
```

6. **Open your browser** to `http://localhost:3000`

### Quick Start for Replit

1. Import this repository to Replit
2. Click "Run" - the server starts automatically
3. Auto-sync handles all git operations
4. Access via the Replit webview

## Environment Variables

Create a `.env` file in the root directory. See [.env.example](.env.example) for a complete list.

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartflow_ai

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Session Security
SESSION_SECRET=your_secure_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Optional Variables

```bash
# OpenAI Integration (optional)
OPENAI_API_KEY=sk-xxxxx

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

See complete configuration in [.env.example](.env.example).

## Development

### Project Structure

```
smartflow-ai/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities
├── server/                    # Express backend
│   ├── index.ts              # Main server file
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Data layer
│   ├── db.ts                 # Database connection
│   └── middleware/           # Express middleware
├── shared/                    # Shared types/schemas
│   └── schema.ts             # Drizzle ORM schema
├── public/                    # Static assets
├── scripts/                   # Build and deployment scripts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### System Architecture

#### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components on Radix UI
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js for analytics visualization

#### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions
- **Error Handling**: Centralized error middleware
- **WebSockets**: Socket.io for real-time updates

#### Dual-Mode Architecture

SmartFlow AI supports dual-mode operation:

**Mode 1: Python Flask (AI Post Generator)**
- File: `app.py`
- Features: AI content generation, hashtag enhancement
- Endpoints: `/api/boost`, `/health`
- Port: 3000

**Mode 2: Node.js Platform (Full Application)**
- File: `server/index.ts`
- Features: Complete platform with all features
- Port: 3000

Toggle between modes:
```bash
./toggle_mode.sh [python|node]
# Or use mode_manager.py web interface on port 8000
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:5000        # Start on port 5000

# Building
npm run build           # Build frontend and backend
npm run build:frontend  # Build frontend only
npm run build:backend   # Build backend only

# Database
npm run db:push         # Push schema to database

# Git Synchronization
npm run sync            # Pull, merge, and push
npm run pull            # Pull from remote
npm run push            # Push to remote
npm run sync-all        # Auto-commit and sync

# Production
npm start               # Start production server
```

### Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration
- **Prettier**: Consistent formatting
- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for components and classes
  - UPPER_CASE for constants

## Database Schema

### Tables Overview

The application uses PostgreSQL with Drizzle ORM for type-safe database operations.

#### Users Table

Stores user authentication and subscription information.

```typescript
{
  id: serial (primary key)
  username: text (unique, required)
  password: text (required)
  email: text
  isPremium: boolean (default: false)
  stripeCustomerId: text
  stripeSubscriptionId: text
  botCount: integer (default: 0)
  createdAt: timestamp
}
```

**Key Features**:
- Tracks premium subscription status
- Stores Stripe customer and subscription IDs
- Monitors bot count for tier limits

#### Bots Table

Stores bot configurations and performance metrics.

```typescript
{
  id: serial (primary key)
  userId: integer (foreign key to users)
  name: text (required)
  description: text
  platform: text (required) // 'tiktok', 'instagram', 'facebook', 'twitter', 'youtube'
  status: text (default: 'active') // 'active', 'paused', 'stopped'
  config: jsonb // Bot configuration settings
  metrics: jsonb // Performance metrics
  createdAt: timestamp
}
```

**Key Features**:
- Multi-platform support
- Flexible JSON configuration
- Performance tracking
- Status management

#### Bot Templates Table

Marketplace templates for quick bot setup.

```typescript
{
  id: serial (primary key)
  name: text (required)
  description: text
  category: text (required) // 'E-commerce', 'Beauty', 'Fashion', 'Technology'
  platform: text (required)
  isPremium: boolean (default: false)
  price: decimal(10, 2)
  rating: decimal(3, 2) (default: 0)
  reviewCount: integer (default: 0)
  config: jsonb // Template configuration
  imageUrl: text
  createdAt: timestamp
}
```

**Key Features**:
- Premium template support
- Community ratings and reviews
- Category-based organization
- Configurable pricing

#### Analytics Table

Tracks bot performance and revenue metrics.

```typescript
{
  id: serial (primary key)
  userId: integer (foreign key to users)
  botId: integer (foreign key to bots)
  date: timestamp
  revenue: decimal(10, 2) (default: 0)
  engagement: decimal(5, 2) (default: 0)
  posts: integer (default: 0)
  clicks: integer (default: 0)
  conversions: integer (default: 0)
}
```

**Key Features**:
- Revenue tracking
- Engagement metrics
- Conversion analytics
- Time-series data

### Database Migrations

```bash
# Generate migration
npx drizzle-kit generate:pg

# Push schema to database
npm run db:push

# View database in Drizzle Studio
npx drizzle-kit studio
```

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "isPremium": false
  }
}
```

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "isPremium": false
  }
}
```

### Bot Management Endpoints

#### GET `/api/bots`
Get all bots for authenticated user.

**Response**:
```json
[
  {
    "id": 1,
    "name": "My TikTok Bot",
    "platform": "tiktok",
    "status": "active",
    "config": {...},
    "metrics": {...}
  }
]
```

#### POST `/api/bots`
Create a new bot.

**Request Body**:
```json
{
  "name": "My Instagram Bot",
  "description": "E-commerce automation",
  "platform": "instagram",
  "config": {
    "personality": "enthusiastic",
    "schedule": "daily"
  }
}
```

**Response**:
```json
{
  "success": true,
  "bot": {
    "id": 2,
    "name": "My Instagram Bot",
    "platform": "instagram",
    "status": "active"
  }
}
```

#### PUT `/api/bots/:id`
Update bot configuration.

#### DELETE `/api/bots/:id`
Delete a bot.

### Analytics Endpoints

#### GET `/api/analytics`
Get analytics data for user's bots.

**Query Parameters**:
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `botId` (optional): Filter by bot ID

**Response**:
```json
{
  "totalRevenue": 4550.50,
  "roi": 340,
  "engagementRate": 8.5,
  "platformPerformance": {
    "tiktok": {...},
    "instagram": {...}
  }
}
```

### Template Marketplace Endpoints

#### GET `/api/templates`
Get available bot templates.

**Query Parameters**:
- `category` (optional): Filter by category
- `platform` (optional): Filter by platform
- `search` (optional): Search query

**Response**:
```json
[
  {
    "id": 1,
    "name": "E-commerce Starter",
    "category": "E-commerce",
    "platform": "instagram",
    "isPremium": false,
    "price": 0,
    "rating": 4.8,
    "reviewCount": 125
  }
]
```

#### POST `/api/templates/:id/apply`
Apply template to create new bot.

### Payment Endpoints

#### POST `/api/payments/create-checkout-session`
Create Stripe checkout session for Pro subscription.

**Response**:
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/..."
}
```

#### POST `/api/payments/create-payment-intent`
Create payment intent for one-time purchases.

#### POST `/api/webhooks/stripe`
Handle Stripe webhook events (subscription updates, payments).

### AI Content Generation Endpoints

#### POST `/api/boost`
Generate AI-powered social media posts.

**Request Body**:
```json
{
  "product": "Organic Skincare",
  "platform": "instagram",
  "tone": "professional",
  "hashtags": true
}
```

**Response**:
```json
{
  "posts": [
    {
      "content": "Transform your skincare routine...",
      "hashtags": ["#OrganicBeauty", "#SkincareTips"],
      "vibe": "inspiring"
    }
  ]
}
```

## Usage Examples

### Creating a Bot

```typescript
import { createBot } from './api/bots';

const newBot = await createBot({
  name: 'Fashion Brand Bot',
  description: 'Automated Instagram promotion',
  platform: 'instagram',
  config: {
    personality: {
      tone: 7,
      formality: 5,
      enthusiasm: 8,
      creativity: 6
    },
    schedule: {
      frequency: 'daily',
      times: ['09:00', '15:00', '20:00']
    },
    targeting: {
      hashtags: ['#fashion', '#style'],
      locations: ['New York', 'Los Angeles']
    }
  }
});
```

### Fetching Analytics

```typescript
import { getAnalytics } from './api/analytics';

const analyticsData = await getAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  botId: 1
});

console.log('Revenue:', analyticsData.totalRevenue);
console.log('ROI:', analyticsData.roi);
console.log('Engagement:', analyticsData.engagementRate);
```

### Applying a Template

```typescript
import { applyTemplate } from './api/templates';

const botFromTemplate = await applyTemplate(templateId, {
  name: 'My Custom Bot Name',
  overrides: {
    schedule: {
      frequency: 'twice-daily'
    }
  }
});
```

### Generating AI Content

```typescript
import { generateContent } from './api/ai';

const generatedPosts = await generateContent({
  product: 'Artisan Coffee Beans',
  platform: 'tiktok',
  tone: 'casual',
  count: 3
});

generatedPosts.forEach(post => {
  console.log(post.content);
  console.log(post.hashtags.join(' '));
});
```

## Freemium Model

### Free Tier
- **Bot Limit**: 3 bots maximum
- **Features**:
  - Basic bot creation
  - Standard templates
  - Basic analytics
  - Community support

### Pro Plan ($49/month)
- **Bot Limit**: Unlimited
- **Features**:
  - All Free tier features
  - Premium templates
  - Advanced analytics
  - Priority support
  - Custom branding
  - API access
  - Export capabilities

### Upgrade Flow

Users can upgrade via:
1. Dashboard upgrade button
2. Bot limit reached prompt
3. Premium template access prompt

Payment processed through Stripe with instant activation.

## Stripe Integration

### Setup

1. **Create Stripe Account**: https://stripe.com
2. **Get API Keys**: Dashboard > Developers > API Keys
3. **Set Webhook Endpoint**: Dashboard > Developers > Webhooks
4. **Configure Environment Variables**:

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Subscription Management

The application handles:
- **Subscription Creation**: Automatic when user upgrades
- **Payment Success**: Instant premium activation
- **Payment Failure**: Notification and retry logic
- **Subscription Cancellation**: Graceful downgrade
- **Subscription Updates**: Plan changes

### Webhook Events

Handled webhook events:
- `checkout.session.completed` - New subscription
- `customer.subscription.created` - Subscription active
- `customer.subscription.updated` - Plan change
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

### Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

```bash
# Listen to webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- bots.test.ts

# Run in watch mode
npm run test:watch
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: User flows validated

### Testing Stripe Integration

```bash
# Use Stripe CLI for webhook testing
stripe trigger customer.subscription.created

# Test checkout flow
stripe checkout sessions create \
  --line-items '[{"price":"price_xxxxx","quantity":1}]'
```

## Deployment

### Build for Production

```bash
# Build frontend and backend
npm run build

# Output:
# - Frontend: /dist/public
# - Backend: /dist/index.js
```

### Deployment Checklist

#### Pre-Deployment
- [ ] Set all environment variables
- [ ] Configure production database
- [ ] Set up Stripe webhook endpoint
- [ ] Enable SSL/TLS certificates
- [ ] Configure CORS settings
- [ ] Set up error monitoring (Sentry)
- [ ] Configure email service
- [ ] Set up backup strategy

#### Security
- [ ] Enable HTTPS only
- [ ] Set secure session secrets
- [ ] Configure CSP headers
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Encrypt sensitive data
- [ ] Regular security audits

#### Performance
- [ ] Enable CDN for static assets
- [ ] Configure database connection pooling
- [ ] Set up caching (Redis)
- [ ] Optimize images
- [ ] Enable compression
- [ ] Configure load balancing

### Deployment Options

#### Replit (Recommended for Quick Start)
1. Import repository to Replit
2. Set environment variables in Secrets
3. Click "Deploy"
4. Automatic scaling and SSL

#### Docker

```bash
# Build image
docker build -t smartflow-ai .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e STRIPE_SECRET_KEY="sk_..." \
  smartflow-ai
```

#### Cloud Platforms

**Vercel**:
```bash
vercel deploy
```

**Heroku**:
```bash
git push heroku main
```

**AWS/GCP/Azure**:
- Use provided deployment scripts in `/scripts`
- Configure environment variables
- Set up database and storage

### Database Deployment

#### PostgreSQL Setup

```bash
# Create database
createdb smartflow_ai

# Push schema
npm run db:push

# Verify connection
psql -d smartflow_ai -c "SELECT * FROM users;"
```

#### Managed Database Options
- **Neon**: Serverless PostgreSQL
- **Supabase**: PostgreSQL with extras
- **AWS RDS**: Managed PostgreSQL
- **Google Cloud SQL**: Managed database

### Monitoring

Recommended monitoring tools:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User analytics
- **Stripe Dashboard**: Payment monitoring
- **Uptime Robot**: Uptime monitoring

## Architecture Diagrams

### System Architecture

```
┌─────────────────┐
│   Client App    │
│   (React/Vite)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Express Server │
│   (TypeScript)  │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    ↓          ↓          ↓          ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  PostgreSQL  │  Stripe │  Gemini│  Socket.io│
│  Database    │   API   │   AI   │  WebSocket│
└──────────┘ └────────┘ └────────┘ └────────┘
```

### Data Flow

```
User Action → React Component → TanStack Query → API Route →
Storage Layer → Database → Response → UI Update
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and commit: `git commit -m 'Add amazing feature'`
4. **Push to fork**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Workflow

1. Check existing issues or create new one
2. Discuss approach in issue comments
3. Fork and create feature branch
4. Write code with tests
5. Ensure all tests pass
6. Submit pull request
7. Respond to review feedback

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2024 SmartFlow Systems

## Support

### Need Help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/smartflowsystems/smartflow-ai/issues)
- **Email Support**: support@smartflowsystems.com
- **Documentation**: [Full documentation](https://docs.smartflowsystems.com)
- **Community Discord**: [Join our community](https://discord.gg/smartflowsystems)
- **WhatsApp**: Contact via landing page form

### Contact

- **Website**: https://smartflowsystems.com
- **Twitter**: @SmartFlowSys
- **Email**: info@smartflowsystems.com
- **Developer**: garethbowers@hotmail.com

## Credits

**Developed by SmartFlow Systems**

Built with:
- React 18 & TypeScript
- Express.js & Node.js
- PostgreSQL & Drizzle ORM
- Stripe Payments
- Google Gemini AI
- Tailwind CSS & Shadcn/ui
- Chart.js & Framer Motion

---

**SmartFlow AI** - Premium no-code AI automation for e-commerce social media success.

**Part of the SmartFlow Systems ecosystem** - AI automation solutions including booking systems, e-commerce shops, social media bots, websites, and marketing growth services.
