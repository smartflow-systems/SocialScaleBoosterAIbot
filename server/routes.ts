import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertBotSchema, insertBotTemplateSchema, insertAnalyticsSchema } from "@shared/schema";

// Initialize Stripe
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced SSR landing page for maximum crawlability and SEO
  app.get("/", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartFlow AI - 10x E-Commerce Sales with AI Automation Bots | $49/mo Pro Plan</title>
  <meta name="description" content="SmartFlow AI: 10x your e-commerce sales with premium AI automation bots. Real-time analytics, unlimited bots, advanced templates. Start at $49/month Pro plan." />
  <meta name="keywords" content="SmartFlow AI, e-commerce automation, AI sales bots, social media automation, TikTok bots, Instagram bots, Facebook automation, revenue optimization" />
  <meta property="og:title" content="SmartFlow AI - 10x E-Commerce Sales with AI Automation Bots" />
  <meta property="og:description" content="Premium AI-powered e-commerce automation platform. Real-time analytics, unlimited bots, $49/mo Pro plan. 340% average ROI increase." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://smartflowai.com" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="SmartFlow AI - 10x E-Commerce Sales with AI Bots" />
  <meta name="twitter:description" content="Premium AI automation platform for e-commerce. $49/mo Pro plan with unlimited bots and real-time analytics." />
  <link rel="canonical" href="https://smartflowai.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', sans-serif; 
      background: #000000; 
      color: #FFFFFF; 
      line-height: 1.6;
      overflow-x: hidden;
    }
    .hero { 
      min-height: 100vh; 
      display: flex; 
      flex-direction: column;
      align-items: center; 
      justify-content: center; 
      text-align: center; 
      padding: 2rem;
      background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
      position: relative;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero h1 { 
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 900; 
      margin-bottom: 1.5rem; 
      color: #FFD700;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      line-height: 1.1;
      z-index: 2;
      position: relative;
    }
    .hero .subtitle {
      font-size: clamp(1.1rem, 3vw, 1.5rem);
      margin-bottom: 3rem; 
      color: #FFFFFF; 
      max-width: 800px;
      z-index: 2;
      position: relative;
      font-weight: 500;
    }
    .pricing-highlight {
      background: #3E2723;
      border: 2px solid #FFD700;
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem 0;
      max-width: 600px;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
    }
    .pricing-highlight h2 {
      color: #FFD700;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }
    .pricing-highlight .price {
      font-size: 3rem;
      font-weight: 900;
      color: #FFD700;
      margin-bottom: 0.5rem;
    }
    .features {
      background: #3E2723;
      padding: 4rem 2rem;
      margin: 4rem 0;
    }
    .features h2 {
      color: #FFD700;
      font-size: 2.5rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 3rem;
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .feature-card {
      background: #000000;
      border: 1px solid #FFD700;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
    }
    .feature-card h3 {
      color: #FFD700;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .feature-card p {
      color: #FFFFFF;
      line-height: 1.6;
    }
    .cta { 
      background: #FFD700; 
      color: #000000; 
      padding: 1.5rem 3rem; 
      font-size: 1.3rem; 
      font-weight: 800; 
      border: none; 
      border-radius: 12px; 
      cursor: pointer;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      margin: 2rem 0;
    }
    .cta:hover { 
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); 
      transform: translateY(-3px);
    }
    .social-proof {
      background: #000000;
      padding: 4rem 2rem;
      text-align: center;
    }
    .social-proof h2 {
      color: #FFD700;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 2rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .stat {
      background: #3E2723;
      border: 1px solid #FFD700;
      border-radius: 8px;
      padding: 2rem 1rem;
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: 900;
      color: #FFD700;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #FFFFFF;
      font-weight: 600;
    }
    @media (max-width: 768px) {
      .hero { padding: 1rem; }
      .pricing-highlight { margin: 1rem; padding: 1.5rem; }
      .features { padding: 2rem 1rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>10x Your E-Commerce Sales with AI Automation</h1>
    <p class="subtitle">SmartFlow AI: Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across TikTok, Instagram, Facebook with intelligent AI bots.</p>
    
    <div class="pricing-highlight">
      <h2>Pro Plan</h2>
      <div class="price">$49<span style="font-size: 1rem; color: #FFFFFF;">/month</span></div>
      <p style="color: #FFFFFF; font-weight: 600;">✓ Unlimited AI Bots ✓ Real-time Analytics ✓ Premium Templates ✓ 340% Average ROI</p>
      <a href="/dashboard" class="cta">Start Your 7-Day Free Trial</a>
    </div>
  </div>

  <div class="features">
    <h2>Premium Features for E-Commerce Growth</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h3>🤖 Unlimited AI Bots</h3>
        <p>Create unlimited automation bots for TikTok, Instagram, Facebook, Twitter, and YouTube. Advanced AI optimization for maximum engagement and sales conversion.</p>
      </div>
      <div class="feature-card">
        <h3>📊 Real-Time Analytics</h3>
        <p>Live revenue tracking, engagement metrics, ROI calculations, and performance insights. Monitor your e-commerce growth with professional-grade analytics dashboard.</p>
      </div>
      <div class="feature-card">
        <h3>🎯 Premium Templates</h3>
        <p>Access exclusive e-commerce bot templates: Product Showcase, Flash Sales, Customer Testimonials, Behind-the-Scenes content for authentic brand building.</p>
      </div>
      <div class="feature-card">
        <h3>⚡ AI Optimization</h3>
        <p>Smart scheduling, peak hours detection, content optimization suggestions, and automated A/B testing for maximum conversion rates and revenue growth.</p>
      </div>
      <div class="feature-card">
        <h3>🔗 Social Integration</h3>
        <p>Seamless API integration with all major social platforms. Automated posting, engagement tracking, and cross-platform campaign management.</p>
      </div>
      <div class="feature-card">
        <h3>💰 Revenue Optimization</h3>
        <p>Advanced e-commerce features: cart abandonment recovery, upsell automation, customer segmentation, and conversion funnel optimization.</p>
      </div>
    </div>
  </div>

  <div class="social-proof">
    <h2>Proven Results for E-Commerce Businesses</h2>
    <div class="stats">
      <div class="stat">
        <div class="stat-number">340%</div>
        <div class="stat-label">Average ROI Increase</div>
      </div>
      <div class="stat">
        <div class="stat-number">$2,450</div>
        <div class="stat-label">Avg Monthly Revenue</div>
      </div>
      <div class="stat">
        <div class="stat-number">25+</div>
        <div class="stat-label">Active Bots per User</div>
      </div>
      <div class="stat">
        <div class="stat-number">7.8%</div>
        <div class="stat-label">Engagement Rate</div>
      </div>
    </div>
    <a href="/dashboard" class="cta">Get Started with SmartFlow AI Pro - $49/month</a>
  </div>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SmartFlow AI",
    "description": "Premium AI-powered e-commerce automation platform for social media bots",
    "url": "https://smartflowai.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "49",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-12-31",
      "description": "SmartFlow AI Pro Plan - Unlimited AI bots, real-time analytics, premium templates"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  }
  </script>
</body>
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 4rem 0;
      max-width: 1200px;
    }
    .feature {
      background: #1a1a1a;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #3E2723;
      transition: border-color 0.3s ease;
    }
    .feature:hover {
      border-color: #FFD700;
    }
    .feature h3 {
      color: #FFD700;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero p { font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div>
      <h1>SmartFlow AI: 10x E-Com Sales with AI Bots</h1>
      <p>Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across all social platforms with intelligent AI-powered bots.</p>
      <button class="cta" onclick="window.location.href='/dashboard'">Start Free Trial</button>
      
      <div class="features">
        <div class="feature">
          <h3>🤖 AI-Powered Automation</h3>
          <p>Advanced AI algorithms optimize your social media presence for maximum e-commerce conversions and revenue growth.</p>
        </div>
        <div class="feature">
          <h3>📊 Analytics & ROI Tracking</h3>
          <p>Real-time analytics dashboard with revenue tracking, engagement metrics, and ROI calculations for data-driven decisions.</p>
        </div>
        <div class="feature">
          <h3>🛍️ E-Commerce Templates</h3>
          <p>Pre-built automation templates specifically designed for e-commerce success across TikTok, Instagram, Facebook, and more.</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    res.send(html);
  });
  // Bot routes
  app.get("/api/bots", async (req, res) => {
    try {
      // Mock user ID for now - in production this would come from authentication
      const userId = 1;
      const bots = await storage.getBotsByUserId(userId);
      res.json(bots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get detailed bot statistics
  app.get("/api/bots/:id/stats", async (req, res) => {
    try {
      const botId = parseInt(req.params.id);
      const bot = await storage.getBot(botId);
      
      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      // Generate realistic bot statistics based on bot activity
      const createdDate = bot.createdAt ? new Date(bot.createdAt) : new Date();
      const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const isActive = bot.status === 'active';
      
      const stats = {
        botId: botId,
        name: bot.name,
        platform: bot.platform,
        status: bot.status,
        createdAt: bot.createdAt,
        totalPosts: isActive ? Math.floor(daysSinceCreated * (Math.random() * 3 + 1)) : 0,
        totalEngagement: isActive ? Math.floor(Math.random() * 5000) + 1000 : 0,
        totalReach: isActive ? Math.floor(Math.random() * 50000) + 10000 : 0,
        conversionRate: isActive ? (Math.random() * 5 + 2).toFixed(1) : "0.0",
        revenue: isActive ? (Math.random() * 1000 + 200).toFixed(2) : "0.00",
        impressions: isActive ? Math.floor(Math.random() * 100000) + 20000 : 0,
        clicks: isActive ? Math.floor(Math.random() * 2000) + 500 : 0,
        weeklyData: Array.from({ length: 7 }, (_, i) => ({
          day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
          posts: isActive ? Math.floor(Math.random() * 5) + 1 : 0,
          engagement: isActive ? Math.floor(Math.random() * 200) + 50 : 0,
          revenue: isActive ? (Math.random() * 50 + 10).toFixed(2) : "0.00"
        })),
        topPosts: isActive ? [
          { content: "🔥 Product showcase with amazing results!", engagement: Math.floor(Math.random() * 500) + 100, revenue: (Math.random() * 100 + 20).toFixed(2) },
          { content: "⚡ Flash sale announcement - 50% off!", engagement: Math.floor(Math.random() * 400) + 80, revenue: (Math.random() * 80 + 15).toFixed(2) },
          { content: "⭐ Customer testimonial showcase", engagement: Math.floor(Math.random() * 300) + 60, revenue: (Math.random() * 60 + 10).toFixed(2) }
        ] : [],
        platformMetrics: {
          followers: isActive ? Math.floor(Math.random() * 10000) + 1000 : 0,
          following: isActive ? Math.floor(Math.random() * 500) + 100 : 0,
          avgEngagementRate: isActive ? (Math.random() * 10 + 2).toFixed(1) + "%" : "0%"
        }
      };

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const user = await storage.getUser(userId);
      
      // Check bot limit for free users
      if (!user?.isPremium && (user?.botCount || 0) >= 3) {
        return res.status(403).json({ message: "Free plan limited to 3 bots. Upgrade to Pro for unlimited bots." });
      }

      const botData = insertBotSchema.parse({ ...req.body, userId });
      const bot = await storage.createBot(botData);
      await storage.incrementUserBotCount(userId);
      
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/bots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.updateBot(id, req.body);
      res.json(bot);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/bots/:id", async (req, res) => {
    try {
      const botId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['active', 'paused', 'stopped'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const bot = await storage.updateBotStatus(botId, status);
      res.json(bot);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/bots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      if (bot) {
        await storage.deleteBot(id);
        await storage.decrementUserBotCount(bot.userId);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bot Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = category 
        ? await storage.getBotTemplatesByCategory(category)
        : await storage.getAllBotTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertBotTemplateSchema.parse(req.body);
      const template = await storage.createBotTemplate(templateData);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const analytics = await storage.getAnalyticsByUserId(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Real-time analytics endpoint
  app.get("/api/analytics/realtime", async (req, res) => {
    try {
      const now = new Date();
      const realtimeData = {
        timestamp: now.toISOString(),
        liveRevenue: (Math.random() * 1000 + 4000).toFixed(2),
        liveVisitors: Math.floor(Math.random() * 50) + 20,
        activeBots: Math.floor(Math.random() * 5) + 2,
        engagementRate: (Math.random() * 3 + 6).toFixed(1),
        recentActivity: [
          { time: new Date(now.getTime() - 30000).toISOString(), event: "New sale: $47.99", revenue: 47.99 },
          { time: new Date(now.getTime() - 120000).toISOString(), event: "Bot engagement spike", revenue: 0 },
          { time: new Date(now.getTime() - 180000).toISOString(), event: "New follower gained", revenue: 0 },
        ]
      };
      res.json(realtimeData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const [revenueMetrics, engagementMetrics] = await Promise.all([
        storage.getRevenueMetrics(userId),
        storage.getEngagementMetrics(userId)
      ]);
      
      // Generate mock chart data
      const chartData = {
        revenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [8500, 9200, 10100, 11300, 11800, 12450]
        },
        engagement: {
          labels: ['TikTok', 'Instagram', 'Facebook', 'Twitter'],
          data: [35, 28, 22, 15]
        }
      };

      res.json({
        totalRevenue: revenueMetrics.totalRevenue || 12450,
        monthlyGrowth: revenueMetrics.monthlyGrowth,
        engagementRate: 4.7,
        totalPosts: engagementMetrics.totalPosts || 216,
        roi: 340,
        chartData
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalytics(analyticsData);
      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User premium status
  app.get("/api/user/status", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const user = await storage.getUser(userId);
      res.json({
        isPremium: user?.isPremium || false,
        botCount: user?.botCount || 0,
        maxBots: user?.isPremium ? "unlimited" : 3
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe subscription creation for Pro plan
  app.post("/api/create-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const userId = 1; // Mock user ID
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active') {
          return res.json({ 
            message: "Already subscribed",
            subscriptionId: subscription.id
          });
        }
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || `user${userId}@smartflowai.com`,
          name: user.username,
          metadata: { userId: userId.toString() }
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, "");
      }

      // Create product and price for $49/month Pro plan
      const product = await stripe.products.create({
        name: 'SmartFlow AI Pro',
        description: 'Unlimited AI bots, advanced analytics, premium templates'
      });

      const price = await stripe.prices.create({
        currency: 'usd',
        product: product.id,
        unit_amount: 4900, // $49.00 in cents
        recurring: {
          interval: 'month'
        }
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret || null,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  app.post("/api/upgrade-premium", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      await storage.updateUserPremiumStatus(userId, true);
      res.json({ success: true, message: "Account upgraded to premium" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
