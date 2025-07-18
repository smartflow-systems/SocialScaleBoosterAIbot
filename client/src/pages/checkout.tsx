import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

// Load Stripe outside of component render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
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
        title: "Payment Successful",
        description: "Welcome to SmartFlow AI Pro!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex space-x-4">
        <Button 
          type="button"
          variant="outline"
          onClick={() => setLocation("/dashboard")}
          className="flex-1 border-secondary-brown text-neutral-gray"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button 
          type="submit"
          disabled={!stripe}
          className="flex-1 bg-accent-gold text-primary-black font-bold gold-glow-hover"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Create PaymentIntent for Pro upgrade ($29/month)
    apiRequest("POST", "/api/create-payment-intent", { amount: 29 })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Payment setup error:", error);
      });
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent-gold mb-2">Upgrade to SmartFlow Pro</h1>
          <p className="text-neutral-gray">Unlock unlimited AI bot creation and premium e-commerce features</p>
        </div>

        <Card className="bg-card-bg border-secondary-brown">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Crown className="text-accent-gold w-6 h-6 mr-2" />
              SmartFlow AI Pro - $29/month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Pro Features Include:</h3>
              <ul className="space-y-2 text-neutral-gray">
                <li>✓ Unlimited bot creation</li>
                <li>✓ Premium bot templates</li>
                <li>✓ Advanced analytics & insights</li>
                <li>✓ Priority customer support</li>
                <li>✓ Multi-platform automation</li>
              </ul>
            </div>

            <Elements stripe={stripePromise} options={{ 
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#FFD700',
                  colorBackground: '#1A1A1A',
                  colorText: '#FFFFFF',
                  colorDanger: '#df1b41',
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '8px',
                }
              }
            }}>
              <CheckoutForm />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}