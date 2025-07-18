import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Bot, BarChart3, Store, File, Search } from "lucide-react";
import BotCard from "@/components/bots/bot-card";
import CreateBotDialog from "@/components/bots/create-bot-dialog";
import TemplateCard from "@/components/marketplace/template-card";
import AnalyticsCharts from "@/components/analytics/charts";
import CategoryFilter from "@/components/marketplace/category-filter";
import EngagementMetrics from "@/components/analytics/engagement-metrics";
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
      {/* Dashboard Header */}
      <header className="bg-card-bg border-b border-secondary-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Bot className="text-accent-gold w-8 h-8" />
              <span className="text-xl font-bold">Dashboard</span>
              <Badge className="bg-accent-gold text-primary-black font-semibold">
                {userStatus?.isPremium ? "Pro Plan" : `Free Plan (${userStatus?.botCount || 0}/3 bots)`}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = "/checkout"}
                className="bg-accent-gold text-primary-black font-semibold gold-glow-hover"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Pro
              </Button>
              <div className="w-8 h-8 bg-accent-gold rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-card-bg border-b border-secondary-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-secondary-brown h-auto p-0 space-x-8">
              <TabsTrigger 
                value="bots" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:text-accent-gold text-neutral-gray py-4 px-2 font-semibold rounded-none bg-transparent"
              >
                <Bot className="w-4 h-4 mr-2" />
                My Bots
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:text-accent-gold text-neutral-gray py-4 px-2 font-semibold rounded-none bg-transparent"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:text-accent-gold text-neutral-gray py-4 px-2 font-semibold rounded-none bg-transparent"
              >
                <Store className="w-4 h-4 mr-2" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="templates" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:text-accent-gold text-neutral-gray py-4 px-2 font-semibold rounded-none bg-transparent"
              >
                <File className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <div className="bg-gradient-to-br from-accent-gold to-yellow-600 rounded-xl p-6 text-primary-black">
                      <div className="text-center">
                        <Crown className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Create More Bots</h3>
                        <p className="mb-4 text-sm opacity-90">Upgrade to Pro for unlimited bot creation</p>
                        <Button 
                          onClick={() => window.location.href = "/checkout"}
                          className="bg-primary-black text-accent-gold hover:bg-secondary-brown"
                        >
                          Unlock Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <h2 className="text-3xl font-bold mb-8">Analytics & ROI</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <AnalyticsCharts metrics={analyticsMetrics} />
                  </div>
                  <div>
                    <EngagementMetrics metrics={engagementMetrics || []} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="marketplace" className="mt-0">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Bot Marketplace</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search templates..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-card-bg border border-secondary-brown rounded-lg pl-10 pr-4 py-2 text-white focus:border-accent-gold focus:outline-none w-80"
                    />
                  </div>
                </div>

                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates?.map((template: any) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                  
                  {filteredTemplates?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-neutral-gray text-lg">No templates found matching your criteria.</p>
                      <Button 
                        onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                        className="mt-4 bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
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
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Crown className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Flash Sale Announcer</h3>
                    <p className="text-neutral-gray mb-4">Create urgency with flash sales, countdown timers, and limited-time offers</p>
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Customer Testimonial Bot</h3>
                    <p className="text-neutral-gray mb-4">Share authentic customer reviews and success stories to build social proof</p>
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Bot className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Behind the Scenes Bot</h3>
                    <p className="text-neutral-gray mb-4">Show product creation process and company culture to build authentic connections</p>
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <File className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Trend Tracker Bot</h3>
                    <p className="text-neutral-gray mb-4">AI-powered trend analysis to create viral content that drives maximum engagement</p>
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>

                  <div className="bg-card-bg border border-secondary-brown rounded-xl p-6 hover:border-accent-gold transition-colors">
                    <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                      <Crown className="text-primary-black w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Multi-Platform Scheduler</h3>
                    <p className="text-neutral-gray mb-4">Coordinate campaigns across TikTok, Instagram, Facebook, and Twitter simultaneously</p>
                    <Button className="w-full bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black">
                      Create Bot
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
