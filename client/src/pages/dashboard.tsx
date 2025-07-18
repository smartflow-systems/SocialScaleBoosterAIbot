import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Bot, BarChart3, Store, File, Search, Calendar, Users, Zap, Settings } from "lucide-react";
import BotCard from "@/components/bots/bot-card";
import CreateBotDialog from "@/components/bots/create-bot-dialog";
import BotStatsDialog from "@/components/bots/bot-stats-dialog";
import TemplateCard from "@/components/marketplace/template-card";
import AnalyticsCharts from "@/components/analytics/charts";
import CategoryFilter from "@/components/marketplace/category-filter";
import EngagementMetrics from "@/components/analytics/engagement-metrics";
import AdvancedMetrics from "@/components/analytics/advanced-metrics";
import SchedulerInterface from "@/components/scheduling/scheduler-interface";
import PersonalityDesigner from "@/components/personality/personality-designer";
import IntegrationWizard from "@/components/integrations/integration-wizard";
import EnhancedMarketplace from "@/components/marketplace/enhanced-marketplace";
import RealTimeDashboard from "@/components/analytics/real-time-dashboard";
import StripeCheckout from "@/components/billing/stripe-checkout";
import SocialIntegrationWizard from "@/components/integrations/social-integration-wizard";
import { analyticsService } from "@/services/analytics";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("bots");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userStatus } = useQuery({
    queryKey: ["/api/user/status"],
  });

  const { data: bots } = useQuery({
    queryKey: ["/api/bots"],
  });

  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: analyticsMetrics } = useQuery({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: engagementMetrics } = useQuery({
    queryKey: ["engagement-metrics"],
    queryFn: () => analyticsService.getEngagementByPlatform(),
  });

  // Filter templates based on category and search
  const filteredTemplates = templates?.filter((template: any) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Dashboard Header - Matches Reference Images */}
      <header className="bg-dark-bg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="text-accent-gold w-8 h-8" />
              <span className="text-xl font-bold text-white">Dashboard</span>
              <Badge className="bg-accent-gold text-black px-3 py-1 rounded-full font-medium">
                {userStatus?.isPremium ? "Pro Plan" : `Free Plan (${userStatus?.botCount || 0}/3 bots)`}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {!userStatus?.isPremium && (
                <StripeCheckout>
                  <Button className="bg-accent-gold text-black hover:bg-yellow-500 font-medium px-4 py-2 rounded-lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Pro
                  </Button>
                </StripeCheckout>
              )}
              <div className="w-8 h-8 bg-accent-gold rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Tab Navigation - Matches Reference Images */}
      <div className="bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-dark-bg rounded-lg p-1 h-auto flex space-x-1 w-fit">
              <TabsTrigger 
                value="bots" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <Bot className="w-4 h-4 mr-2" />
                My Bots
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <Store className="w-4 h-4 mr-2" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="scheduling" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Scheduling
              </TabsTrigger>
              <TabsTrigger 
                value="personality" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Personality
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="data-[state=active]:bg-accent-gold data-[state=active]:text-black text-white px-4 py-2 rounded-md font-medium transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-dark-bg min-h-screen">
              <TabsContent value="bots" className="mt-0">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">My Bots</h2>
                  <CreateBotDialog 
                    isPremium={userStatus?.isPremium || false}
                    botCount={userStatus?.botCount || 0}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bots?.map((bot: any) => (
                    <BotCard key={bot.id} bot={bot} />
                  ))}
                  
                  {/* Upgrade prompt card */}
                  {!userStatus?.isPremium && (
                    <div className="bg-gradient-to-br from-accent-gold to-yellow-500 rounded-xl p-6 text-black">
                      <div className="text-center">
                        <Crown className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Create More Bots</h3>
                        <p className="mb-4 text-sm opacity-80">Upgrade to Pro for unlimited bot creation</p>
                        <StripeCheckout>
                          <Button className="bg-black text-accent-gold hover:bg-gray-800 font-medium">
                            Unlock Now - $49/mo
                          </Button>
                        </StripeCheckout>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-accent-gold">Real-Time Analytics</h2>
                  <Badge className="bg-accent-gold text-primary-black px-3 py-1 font-bold pulse-gold">
                    LIVE DATA
                  </Badge>
                </div>
                <RealTimeDashboard />
                <AdvancedMetrics metrics={analyticsMetrics} />
              </TabsContent>

              <TabsContent value="marketplace" className="mt-0">
                <h2 className="text-3xl font-bold mb-8">Premium Bot Marketplace</h2>
                <EnhancedMarketplace userStatus={userStatus} />
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <h2 className="text-3xl font-bold mb-8">E-Commerce Bot Presets</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Store className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Product Showcase Bot</h3>
                    <p className="text-neutral-gray mb-4">Highlight product features with engaging visuals and automatic hashtag optimization</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Crown className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Flash Sale Announcer</h3>
                    <p className="text-neutral-gray mb-4">Create urgency with flash sales, countdown timers, and limited-time offers</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Customer Testimonial Bot</h3>
                    <p className="text-neutral-gray mb-4">Share authentic customer reviews and success stories to build social proof</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Bot className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Behind the Scenes Bot</h3>
                    <p className="text-neutral-gray mb-4">Show product creation process and company culture to build authentic connections</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <File className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Trend Tracker Bot</h3>
                    <p className="text-neutral-gray mb-4">AI-powered trend analysis to create viral content that drives maximum engagement</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Crown className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Multi-Platform Scheduler</h3>
                    <p className="text-neutral-gray mb-4">Coordinate campaigns across TikTok, Instagram, Facebook, and Twitter simultaneously</p>
                    <CreateBotDialog 
                      isPremium={userStatus?.isPremium || false}
                      botCount={userStatus?.botCount || 0}
                    >
                      <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                        Create Bot
                      </Button>
                    </CreateBotDialog>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scheduling" className="mt-0">
                <h2 className="text-3xl font-bold mb-8">Smart Scheduling & Automation</h2>
                <SchedulerInterface />
              </TabsContent>

              <TabsContent value="personality" className="mt-0">
                <h2 className="text-3xl font-bold mb-8">Bot Personality Designer</h2>
                <PersonalityDesigner />
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-accent-gold">Social Media Integrations</h2>
                  <Badge className="bg-accent-gold text-primary-black px-3 py-1 font-bold">
                    Secure API Management
                  </Badge>
                </div>
                <SocialIntegrationWizard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
