import { useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Load Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/dashboard?upgraded=true',
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome to Pro! 🎉",
          description: "Your account has been upgraded. Enjoy unlimited bots!",
          className: "bg-accent-gold text-primary-black",
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary-black p-4 rounded-lg border border-accent-gold">
        <PaymentElement 
          options={{
            layout: "tabs",
            paymentMethodOrder: ['card', 'paypal'],
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-accent-gold text-primary-black hover:opacity-90 font-bold py-3 gold-glow-hover"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-primary-black border-t-transparent rounded-full" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Upgrade to Pro - $49/month
          </div>
        )}
      </Button>
    </form>
  );
};

interface StripeCheckoutProps {
  children: React.ReactNode;
}

export default function StripeCheckout({ children }: StripeCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSubscription = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-subscription");
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: () => {
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = () => {
    setOpen(true);
    if (!clientSecret) {
      createSubscription.mutate();
    }
  };

  const handlePaymentSuccess = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/user/status"] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpenDialog}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-secondary-brown border-accent-gold">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent-gold flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Upgrade to SmartFlow AI Pro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pro Plan Features */}
          <Card className="bg-primary-black border-accent-gold">
            <CardHeader>
              <CardTitle className="text-accent-gold flex items-center justify-between">
                Pro Plan Benefits
                <Badge className="bg-accent-gold text-primary-black">Best Value</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">Unlimited AI Bots</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">Advanced Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">Premium Bot Templates</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">Priority Customer Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">Real-time Performance Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent-gold" />
                <span className="text-white">AI Optimization Suggestions</span>
              </div>
            </CardContent>
          </Card>

          {/* ROI Calculator */}
          <Card className="bg-primary-black border-accent-gold">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray text-sm">Average Pro User Results:</p>
                <div className="flex justify-around mt-2">
                  <div>
                    <p className="text-accent-gold font-bold text-lg">340%</p>
                    <p className="text-gray text-xs">ROI Increase</p>
                  </div>
                  <div>
                    <p className="text-accent-gold font-bold text-lg">$2,450</p>
                    <p className="text-gray text-xs">Avg Monthly Revenue</p>
                  </div>
                  <div>
                    <p className="text-accent-gold font-bold text-lg">25+</p>
                    <p className="text-gray text-xs">Active Bots</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          {clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#FFD700',
                    colorBackground: '#000000',
                    colorText: '#FFFFFF',
                    colorDanger: '#FF4444',
                    fontFamily: 'Inter, sans-serif',
                  }
                }
              }}
            >
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          ) : (
            <div className="flex items-center justify-center py-8">
              {createSubscription.isPending ? (
                <div className="flex items-center gap-2 text-accent-gold">
                  <div className="animate-spin w-5 h-5 border-2 border-accent-gold border-t-transparent rounded-full" />
                  Setting up payment...
                </div>
              ) : (
                <Button 
                  onClick={() => createSubscription.mutate()}
                  className="bg-accent-gold text-primary-black font-bold gold-glow-hover"
                >
                  Initialize Payment
                </Button>
              )}
            </div>
          )}

          <p className="text-gray text-xs text-center">
            Secure payment processing by Stripe. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}