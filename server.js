import express from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "sfs-dev-secret-change-in-prod";
const FREE_BOT_LIMIT = 3;

// Stripe webhook needs raw body — register before express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return res.status(503).json({ ok: false, error: "Stripe not configured" });
  }

  let event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ ok: false, error: "Invalid signature" });
  }

  try {
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const sub = event.data.object;
      const customerId = sub.customer;
      const isActive = sub.status === "active" || sub.status === "trialing";
      const users = readUsers();
      const user = users.users.find(u => u.stripeCustomerId === customerId);
      if (user) {
        user.isPremium = isActive;
        user.stripeSubscriptionId = sub.id;
        user.updatedAt = new Date().toISOString();
        writeUsers(users);
        console.log(`✓ Subscription ${event.type} — user ${user.email} isPremium=${isActive}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const users = readUsers();
      const user = users.users.find(u => u.stripeCustomerId === sub.customer);
      if (user) {
        user.isPremium = false;
        user.stripeSubscriptionId = null;
        user.updatedAt = new Date().toISOString();
        writeUsers(users);
        console.log(`✓ Subscription cancelled — user ${user.email} downgraded to free`);
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err.message);
  }

  res.json({ received: true });
});

// Global middleware (after webhook raw handler)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load config once at startup
const config = JSON.parse(readFileSync("./public/site.config.json", "utf-8"));

// Ensure data directory exists
const dataDir = "./data";
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// --- File storage helpers ---

const leadsFile = join(dataDir, "leads.json");
const usersFile = join(dataDir, "users.json");
const botsFile  = join(dataDir, "bots.json");

function initFile(path, initial) {
  if (!existsSync(path)) writeFileSync(path, JSON.stringify(initial, null, 2));
}
initFile(leadsFile, { leads: [] });
initFile(usersFile, { users: [] });
initFile(botsFile,  { bots: [] });

function readLeads() {
  try { return JSON.parse(readFileSync(leadsFile, "utf-8")); }
  catch { return { leads: [] }; }
}
function writeLeads(data) {
  try { writeFileSync(leadsFile, JSON.stringify(data, null, 2)); return true; }
  catch { return false; }
}
function readUsers() {
  try { return JSON.parse(readFileSync(usersFile, "utf-8")); }
  catch { return { users: [] }; }
}
function writeUsers(data) {
  try { writeFileSync(usersFile, JSON.stringify(data, null, 2)); return true; }
  catch { return false; }
}
function readBots() {
  try { return JSON.parse(readFileSync(botsFile, "utf-8")); }
  catch { return { bots: [] }; }
}
function writeBots(data) {
  try { writeFileSync(botsFile, JSON.stringify(data, null, 2)); return true; }
  catch { return false; }
}

// --- Auth middleware ---

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Missing token" });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}

// --- Static files ---
app.use(express.static("public"));

// --- Health ---
app.get("/health",     (_req, res) => res.json({ ok: true, siteName: config.siteName, version: config.version }));
app.get("/api/health", (_req, res) => res.json({ ok: true, siteName: config.siteName, version: config.version }));

// --- Auth routes ---

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password required" });
    if (password.length < 8) return res.status(400).json({ ok: false, error: "Password must be at least 8 characters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ ok: false, error: "Invalid email" });

    const db = readUsers();
    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ ok: false, error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      email,
      name: name || email.split("@")[0],
      password: hash,
      isPremium: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      botCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(user);
    writeUsers(db);

    const token = jwt.sign({ id: user.id, email: user.email, isPremium: false }, JWT_SECRET, { expiresIn: "7d" });
    console.log(`✓ New user registered: ${email}`);
    res.status(201).json({ ok: true, token, user: safeUser(user) });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ ok: false, error: "Registration failed" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password required" });

    const db = readUsers();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, isPremium: user.isPremium }, JWT_SECRET, { expiresIn: "7d" });
    console.log(`✓ Login: ${email}`);
    res.json({ ok: true, token, user: safeUser(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", requireAuth, (req, res) => {
  const db = readUsers();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ ok: false, error: "User not found" });
  res.json({ ok: true, user: safeUser(user) });
});

function safeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// --- Bot routes ---

// GET /api/bots
app.get("/api/bots", requireAuth, (req, res) => {
  const db = readBots();
  const userBots = db.bots.filter(b => b.userId === req.user.id);
  res.json({ ok: true, bots: userBots });
});

// POST /api/bots
app.post("/api/bots", requireAuth, (req, res) => {
  try {
    const { name, platform, description, config } = req.body;
    if (!name || !platform) return res.status(400).json({ ok: false, error: "Name and platform required" });

    const validPlatforms = ["tiktok", "instagram", "facebook", "twitter", "youtube", "linkedin"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ ok: false, error: `Platform must be one of: ${validPlatforms.join(", ")}` });
    }

    // Enforce free tier bot limit
    const db = readBots();
    const userBots = db.bots.filter(b => b.userId === req.user.id);
    const users = readUsers();
    const user = users.users.find(u => u.id === req.user.id);

    if (!user?.isPremium && userBots.length >= FREE_BOT_LIMIT) {
      return res.status(403).json({
        ok: false,
        error: `Free plan limited to ${FREE_BOT_LIMIT} bots. Upgrade to Pro to create unlimited bots.`,
        upgradeRequired: true,
      });
    }

    const bot = {
      id: `bot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId: req.user.id,
      name,
      platform,
      description: description || "",
      status: "active",
      config: config || {},
      metrics: { posts: 0, engagement: 0, clicks: 0, conversions: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.bots.push(bot);
    writeBots(db);

    // Keep botCount in sync on the user record
    if (user) {
      user.botCount = userBots.length + 1;
      user.updatedAt = new Date().toISOString();
      writeUsers(users);
    }

    console.log(`✓ Bot created: ${name} (${platform}) for ${req.user.email}`);
    res.status(201).json({ ok: true, bot });
  } catch (err) {
    console.error("Create bot error:", err.message);
    res.status(500).json({ ok: false, error: "Failed to create bot" });
  }
});

// PUT /api/bots/:id
app.put("/api/bots/:id", requireAuth, (req, res) => {
  try {
    const db = readBots();
    const idx = db.bots.findIndex(b => b.id === req.params.id && b.userId === req.user.id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Bot not found" });

    const { name, description, status, config } = req.body;
    const bot = db.bots[idx];
    if (name)        bot.name = name;
    if (description !== undefined) bot.description = description;
    if (status)      bot.status = status;
    if (config)      bot.config = { ...bot.config, ...config };
    bot.updatedAt = new Date().toISOString();

    db.bots[idx] = bot;
    writeBots(db);
    res.json({ ok: true, bot });
  } catch (err) {
    console.error("Update bot error:", err.message);
    res.status(500).json({ ok: false, error: "Failed to update bot" });
  }
});

// DELETE /api/bots/:id
app.delete("/api/bots/:id", requireAuth, (req, res) => {
  try {
    const db = readBots();
    const idx = db.bots.findIndex(b => b.id === req.params.id && b.userId === req.user.id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Bot not found" });

    db.bots.splice(idx, 1);
    writeBots(db);

    // Sync botCount
    const users = readUsers();
    const user = users.users.find(u => u.id === req.user.id);
    if (user) {
      user.botCount = Math.max(0, (user.botCount || 1) - 1);
      user.updatedAt = new Date().toISOString();
      writeUsers(users);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Delete bot error:", err.message);
    res.status(500).json({ ok: false, error: "Failed to delete bot" });
  }
});

// --- Leads ---
app.post("/api/leads", (req, res) => {
  try {
    const { firstName, lastName, email, company, phone, source } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: "First name, last name, and email are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    const data = readLeads();
    const existingLead = data.leads.find(l => l.email === email);
    if (existingLead) return res.json({ success: true, message: "Lead already exists", leadId: existingLead.id });

    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      firstName, lastName, email,
      company: company || "", phone: phone || "",
      source: source || "direct", status: "new",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    data.leads.push(newLead);
    writeLeads(data);
    console.log(`✓ New lead: ${email}`);
    res.status(201).json({ success: true, message: "Lead captured", leadId: newLead.id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/leads", (_req, res) => {
  const data = readLeads();
  res.json({ success: true, count: data.leads.length, leads: data.leads });
});

// --- Stripe Checkout (create session) ---
app.post("/api/stripe/checkout", async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_xxx")) {
    return res.status(503).json({ success: false, message: "Stripe not configured" });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { planId, successUrl, cancelUrl, email } = req.body;

    const pricingData = JSON.parse(readFileSync("./public/pricing.json", "utf-8"));
    const plan = pricingData.plans.find(p => p.id === planId);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const sessionParams = {
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: plan.currency.toLowerCase(),
          recurring: { interval: plan.interval },
          product_data: { name: `SmartFlow AI — ${plan.name}`, description: `${plan.name} plan — billed monthly` },
          unit_amount: plan.price * 100,
        },
        quantity: 1,
      }],
      success_url: successUrl || `${origin}/success.html?plan=${planId}`,
      cancel_url: cancelUrl || `${origin}/pricing.html`,
      metadata: { planId },
    };

    // Pre-fill email and link to existing customer if provided
    if (email) {
      const db = readUsers();
      const user = db.users.find(u => u.email === email);
      if (user?.stripeCustomerId) {
        sessionParams.customer = user.stripeCustomerId;
      } else {
        sessionParams.customer_email = email;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log(`✓ Checkout session for plan: ${planId}`);
    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ success: false, message: "Failed to create checkout session" });
  }
});

// port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`SmartFlow AI serving on ${port}`));
export default app;
