import { Button } from "@/components/ui/button";
import { Bot, Menu } from "lucide-react";
import { useLocation } from "wouter";

export default function Navigation() {
  const [, setLocation] = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-secondary-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setLocation("/")}>
            <Bot className="text-accent-gold w-8 h-8" />
            <span className="text-xl font-bold text-accent-gold">FlowScale AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-gray hover:text-accent-gold transition-colors">Features</a>
            <a href="#pricing" className="text-neutral-gray hover:text-accent-gold transition-colors">Pricing</a>
            <a href="#marketplace" className="text-neutral-gray hover:text-accent-gold transition-colors">Marketplace</a>
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="bg-accent-gold text-primary-black font-semibold hover:shadow-lg gold-glow-hover transition-all"
            >
              Sign In
            </Button>
          </div>
          <div className="md:hidden">
            <Menu className="text-accent-gold w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
}
