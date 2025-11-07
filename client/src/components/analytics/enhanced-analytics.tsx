import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Calendar,
  Clock,
  Award
} from "lucide-react";

interface PlatformMetric {
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  growth: number;
  revenue: number;
}

const MOCK_PLATFORM_DATA: PlatformMetric[] = [
  { platform: "TikTok", views: 125000, likes: 8500, comments: 420, shares: 1200, growth: 24.5, revenue: 1250 },
  { platform: "Instagram", views: 98000, likes: 6200, comments: 310, shares: 890, growth: 18.2, revenue: 980 },
  { platform: "Facebook", views: 67000, likes: 3800, comments: 180, shares: 520, growth: 12.8, revenue: 670 },
  { platform: "Twitter", views: 45000, likes: 2100, comments: 95, shares: 340, growth: 8.4, revenue: 450 },
];

const MOCK_TOP_CONTENT = [
  { id: 1, title: "Product Launch Video", platform: "TikTok", views: 45000, engagement: 12.5 },
  { id: 2, title: "Customer Success Story", platform: "Instagram", views: 32000, engagement: 9.8 },
  { id: 3, title: "Behind the Scenes", platform: "TikTok", views: 28000, engagement: 11.2 },
  { id: 4, title: "How-To Tutorial", platform: "Instagram", views: 21000, engagement: 8.5 },
  { id: 5, title: "Flash Sale Announcement", platform: "Facebook", views: 19000, engagement: 7.3 },
];

const MOCK_AUDIENCE_INSIGHTS = {
  demographics: {
    age: [
      { range: "18-24", percentage: 35 },
      { range: "25-34", percentage: 42 },
      { range: "35-44", percentage: 15 },
      { range: "45+", percentage: 8 },
    ],
    gender: [
      { type: "Female", percentage: 58 },
      { type: "Male", percentage: 40 },
      { type: "Other", percentage: 2 },
    ],
    topLocations: [
      { country: "United States", percentage: 45 },
      { country: "United Kingdom", percentage: 25 },
      { country: "Canada", percentage: 12 },
      { country: "Australia", percentage: 10 },
      { country: "Other", percentage: 8 },
    ]
  },
  behavior: {
    peakHours: ["6 PM - 9 PM", "12 PM - 2 PM", "8 AM - 10 AM"],
    peakDays: ["Saturday", "Sunday", "Wednesday"],
    avgSessionDuration: "4m 32s",
    bounceRate: "23.5%"
  }
};

export default function EnhancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const totalMetrics = {
    views: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.views, 0),
    likes: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.likes, 0),
    comments: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.comments, 0),
    shares: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.shares, 0),
    revenue: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.revenue, 0),
    avgGrowth: MOCK_PLATFORM_DATA.reduce((sum, p) => sum + p.growth, 0) / MOCK_PLATFORM_DATA.length,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gold-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-500" />
            Enhanced Analytics Dashboard
          </h3>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights across all your social media platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("7d")}
            className={selectedPeriod === "7d" ? "btn-gold" : "btn-gold-ghost"}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("30d")}
            className={selectedPeriod === "30d" ? "btn-gold" : "btn-gold-ghost"}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("90d")}
            className={selectedPeriod === "90d" ? "btn-gold" : "btn-gold-ghost"}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-gold-500" />
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
            <p className="text-2xl font-bold text-gold-100">{formatNumber(totalMetrics.views)}</p>
          </CardContent>
        </Card>
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
            <p className="text-2xl font-bold text-gold-100">{formatNumber(totalMetrics.likes)}</p>
          </CardContent>
        </Card>
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
            <p className="text-2xl font-bold text-gold-100">{formatNumber(totalMetrics.comments)}</p>
          </CardContent>
        </Card>
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Shares</p>
            </div>
            <p className="text-2xl font-bold text-gold-100">{formatNumber(totalMetrics.shares)}</p>
          </CardContent>
        </Card>
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gold-500" />
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <p className="text-2xl font-bold text-gold-100">£{formatNumber(totalMetrics.revenue)}</p>
          </CardContent>
        </Card>
        <Card className="panel-dark border-gold">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Avg Growth</p>
            </div>
            <p className="text-2xl font-bold text-green-400">+{totalMetrics.avgGrowth.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="panel-dark border-gold">
        <CardHeader>
          <CardTitle className="text-gold-100">Platform Performance</CardTitle>
          <CardDescription>Compare metrics across all connected platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_PLATFORM_DATA.map((platform) => (
              <div key={platform.platform} className="p-4 bg-black-900 rounded-lg border border-gold-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gold-100">{platform.platform}</h4>
                  <Badge className={platform.growth > 15 ? "bg-green-900 text-green-300" : "bg-gold-700 text-gold-300"}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{platform.growth}%
                  </Badge>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold text-gold-300">{formatNumber(platform.views)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Likes</p>
                    <p className="font-semibold text-gold-300">{formatNumber(platform.likes)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comments</p>
                    <p className="font-semibold text-gold-300">{formatNumber(platform.comments)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shares</p>
                    <p className="font-semibold text-gold-300">{formatNumber(platform.shares)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-gold-500">£{formatNumber(platform.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card className="panel-dark border-gold">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gold-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" />
                Top Performing Content
              </CardTitle>
              <CardDescription>Your most engaging posts this period</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="btn-gold-ghost">
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TOP_CONTENT.map((content, index) => (
              <div key={content.id} className="flex items-center gap-4 p-3 bg-black-900 rounded-lg border border-gold-800">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-gradient text-black-900 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gold-100">{content.title}</h5>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(content.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {content.engagement}% engagement
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-gold-300">
                  {content.platform}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Insights */}
      <Card className="panel-dark border-gold">
        <CardHeader>
          <CardTitle className="text-gold-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-500" />
            Audience Insights
          </CardTitle>
          <CardDescription>Understand who's engaging with your content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demographics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black-900">
              <TabsTrigger value="demographics" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900">
                Demographics
              </TabsTrigger>
              <TabsTrigger value="behavior" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900">
                Behavior
              </TabsTrigger>
            </TabsList>
            <TabsContent value="demographics" className="space-y-6 mt-4">
              <div>
                <h4 className="font-semibold text-gold-100 mb-3">Age Distribution</h4>
                <div className="space-y-2">
                  {MOCK_AUDIENCE_INSIGHTS.demographics.age.map((age) => (
                    <div key={age.range} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">{age.range}</span>
                      <div className="flex-1 bg-black-900 rounded-full h-2">
                        <div
                          className="bg-gold-gradient h-2 rounded-full"
                          style={{ width: `${age.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gold-300 w-12">{age.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gold-100 mb-3">Top Locations</h4>
                <div className="space-y-2">
                  {MOCK_AUDIENCE_INSIGHTS.demographics.topLocations.map((location) => (
                    <div key={location.country} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-32">{location.country}</span>
                      <div className="flex-1 bg-black-900 rounded-full h-2">
                        <div
                          className="bg-gold-gradient h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gold-300 w-12">{location.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="behavior" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black-900 rounded-lg border border-gold-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <h4 className="font-semibold text-gold-100">Peak Hours</h4>
                  </div>
                  <ul className="space-y-1">
                    {MOCK_AUDIENCE_INSIGHTS.behavior.peakHours.map((hour, i) => (
                      <li key={i} className="text-sm text-gold-300">• {hour}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-black-900 rounded-lg border border-gold-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    <h4 className="font-semibold text-gold-100">Peak Days</h4>
                  </div>
                  <ul className="space-y-1">
                    {MOCK_AUDIENCE_INSIGHTS.behavior.peakDays.map((day, i) => (
                      <li key={i} className="text-sm text-gold-300">• {day}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black-900 rounded-lg border border-gold-800">
                  <p className="text-sm text-muted-foreground mb-1">Avg Session Duration</p>
                  <p className="text-xl font-semibold text-gold-500">{MOCK_AUDIENCE_INSIGHTS.behavior.avgSessionDuration}</p>
                </div>
                <div className="p-4 bg-black-900 rounded-lg border border-gold-800">
                  <p className="text-sm text-muted-foreground mb-1">Bounce Rate</p>
                  <p className="text-xl font-semibold text-gold-500">{MOCK_AUDIENCE_INSIGHTS.behavior.bounceRate}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
