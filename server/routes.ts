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
  // Server-side rendered landing page for SEO crawlability
  app.get("/landing-ssr", (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FlowScale AI - 10x E-Com Sales with AI Bots | Premium Automation Platform</title>
  <meta name="description" content="FlowScale AI: 10x E-Com Sales with AI Bots. Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across all social platforms." />
  <meta name="keywords" content="FlowScale AI, e-commerce automation, AI sales bots, social media automation, no-code platform" />
  <meta property="og:title" content="FlowScale AI - 10x E-Com Sales with AI Bots" />
  <meta property="og:description" content="Premium AI-powered e-commerce automation platform. 10x your sales with intelligent social media bots." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { 
      margin: 0; 
      font-family: 'Inter', sans-serif; 
      background: #000000; 
      color: #FFFFFF; 
      line-height: 1.6;
    }
    .hero { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      text-align: center; 
      padding: 2rem;
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
    }
    .hero h1 { 
      font-size: 4rem; 
      font-weight: 800; 
      margin-bottom: 1.5rem; 
      color: #FFD700;
      text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    }
    .hero p { 
      font-size: 1.5rem; 
      margin-bottom: 2rem; 
      color: #808080; 
      max-width: 600px;
    }
    .cta { 
      background: #FFD700; 
      color: #000000; 
      padding: 1rem 2rem; 
      font-size: 1.2rem; 
      font-weight: 700; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      transition: all 0.3s ease;
    }
    .cta:hover { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); 
      transform: translateY(-2px);
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
      <h1>FlowScale AI: 10x E-Com Sales with AI Bots</h1>
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
