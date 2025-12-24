/**
 * SmartFlow Systems - SocialScale AI
 * Freemium Stripe Routes with Bot Limit Enforcement
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Load pricing config
const pricingConfig = require('../../../stripe-products-config.json').socialscale;

/**
 * POST /api/stripe/upgrade
 * Upgrade from free tier to Pro or Agency
 */
router.post('/upgrade', async (req, res) => {
  try {
    const { tier, userId, email } = req.body;

    if (!tier || !userId || !email) {
      return res.status(400).json({
        error: 'Missing required fields: tier, userId, email'
      });
    }

    // Validate tier (can't upgrade to free)
    if (tier === 'free') {
      return res.status(400).json({ error: 'Cannot upgrade to free tier' });
    }

    // Find the pricing tier
    const pricingTier = pricingConfig.products.find(p => p.tier === tier);
    if (!pricingTier) {
      return res.status(400).json({ error: 'Invalid pricing tier' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: pricingTier.price_id,
          quantity: 1
        }
      ],
      customer_email: email,
      client_reference_id: userId,
      subscription_data: {
        trial_period_days: pricingTier.trial_days || 0,
        metadata: {
          userId: userId,
          tier: tier,
          app: 'socialscale',
          previousTier: 'free' // Track upgrade path
        }
      },
      metadata: {
        userId: userId,
        tier: tier,
        app: 'socialscale'
      },
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?canceled=true`
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe upgrade error:', error);
    res.status(500).json({
      error: 'Failed to create upgrade session',
      message: error.message
    });
  }
});

/**
 * GET /api/user/limits
 * Get current user's tier limits and usage
 */
router.get('/user/limits', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // TODO: Fetch user from database
    // const user = await db.users.findUnique({ where: { id: userId } });

    // For now, return mock data
    const user = {
      tier: 'free',
      botCount: 2,
      limits: pricingConfig.products.find(p => p.tier === 'free').limits
    };

    const canCreateBot = user.botCount < user.limits.bots || user.limits.bots === -1;

    res.json({
      tier: user.tier,
      usage: {
        bots: user.botCount,
        aiPosts: 15, // TODO: Track actual usage
        templates: 3
      },
      limits: user.limits,
      canCreateBot,
      upgradeRequired: !canCreateBot
    });

  } catch (error) {
    console.error('Get limits error:', error);
    res.status(500).json({
      error: 'Failed to get user limits',
      message: error.message
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * GET /api/stripe/customer-portal
 * Create a customer portal session
 */
router.get('/customer-portal', async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Customer portal error:', error);
    res.status(500).json({
      error: 'Failed to create customer portal session',
      message: error.message
    });
  }
});

// ============================================================================
// Webhook Event Handlers
// ============================================================================

async function handleCheckoutComplete(session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const tier = session.metadata?.tier;

  console.log('SocialScale - Checkout completed:', { userId, tier, sessionId: session.id });

  // TODO: Upgrade user from free to paid tier
  // - Update user tier in database
  // - Remove bot count limit
  // - Enable premium templates
  // - Increase AI generation quota
  // - Send welcome email
}

async function handleSubscriptionCreated(subscription) {
  const userId = subscription.metadata?.userId;
  const tier = subscription.metadata?.tier;

  console.log('SocialScale - Subscription created:', { userId, tier, subscriptionId: subscription.id });

  // TODO: Apply tier benefits
  // - Unlock unlimited bots
  // - Enable advanced features
  // - Update usage limits
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.userId;

  console.log('SocialScale - Subscription updated:', { userId, subscriptionId: subscription.id });

  // TODO: Handle subscription changes
  // - Handle upgrades from Pro to Agency
  // - Adjust feature access
  // - Update billing
}

async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.userId;

  console.log('SocialScale - Subscription deleted:', { userId, subscriptionId: subscription.id });

  // TODO: Downgrade to free tier
  // - Enforce 3-bot limit (disable excess bots)
  // - Remove premium template access
  // - Reset AI generation quota
  // - Send downgrade confirmation email
}

async function handlePaymentSucceeded(invoice) {
  console.log('SocialScale - Payment succeeded:', { invoiceId: invoice.id, amount: invoice.amount_paid });

  // TODO: Send receipt, track MRR
}

async function handlePaymentFailed(invoice) {
  console.log('SocialScale - Payment failed:', { invoiceId: invoice.id, attempt: invoice.attempt_count });

  // TODO: Handle payment failure
  // - Email user to update payment method
  // - After max retries, downgrade to free tier
}

/**
 * Middleware to enforce bot creation limits
 */
function enforceBotLimit(req, res, next) {
  // TODO: Check user's current bot count against tier limits
  // If limit reached and not on paid tier, return error with upgrade prompt
  next();
}

module.exports = router;
module.exports.enforceBotLimit = enforceBotLimit;
