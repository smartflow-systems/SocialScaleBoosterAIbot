import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import { BarChart3, Store, Wand2, Play, Rocket } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleStartFree = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-black to-dark-bg overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-brown rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-accent-gold">FlowScale AI:</span><br />
            <span className="text-white">10x E-Com Sales</span><br />
            <span className="text-accent-gold">with AI Bots</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-gray mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium no-code platform for e-commerce automation. Boost revenue, engagement, and conversions across all social platforms with intelligent AI-powered bots.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleStartFree}
              className="bg-accent-gold text-primary-black px-8 py-4 text-lg font-bold gold-glow gold-glow-hover hover:scale-105 transition-all"
              size="lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free
            </Button>
            <Button 
              variant="outline" 
              className="border-accent-gold text-accent-gold px-8 py-4 text-lg font-semibold hover:bg-accent-gold hover:text-primary-black transition-all"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <BarChart3 className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Analytics & ROI</h3>
                <p className="text-neutral-gray">Track engagement, sales, and revenue metrics in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <Store className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Bot Marketplace</h3>
                <p className="text-neutral-gray">Access pre-built templates for every e-commerce niche</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
              <CardContent className="p-6">
                <Wand2 className="text-accent-gold w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">No-Code Builder</h3>
                <p className="text-neutral-gray">Drag-and-drop interface for creating powerful automation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
