import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  TrendingUp,
  Award,
  Star,
  Flame,
  Trophy,
  Crown,
  UserPlus,
  Eye
} from "lucide-react";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: "template" | "strategy" | "success" | "question";
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timestamp: string;
  featured: boolean;
  verified: boolean;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  bots: number;
  engagement: number;
  badge: "gold" | "silver" | "bronze" | null;
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    author: "MarketingPro",
    avatar: "MP",
    title: "How I Generated $10K in 30 Days with Social Bots",
    content: "I've been using SocialScaleBooster for the past month and the results have been incredible. Here's my complete strategy...",
    category: "success",
    likes: 324,
    comments: 45,
    shares: 89,
    views: 2400,
    timestamp: "2 hours ago",
    featured: true,
    verified: true
  },
  {
    id: "2",
    author: "EcomGuru",
    avatar: "EG",
    title: "Best Times to Post on TikTok (Updated 2024)",
    content: "After analyzing 1000+ posts, I've found the optimal posting schedule for maximum engagement...",
    category: "strategy",
    likes: 256,
    comments: 32,
    shares: 67,
    views: 1800,
    timestamp: "5 hours ago",
    featured: true,
    verified: false
  },
  {
    id: "3",
    author: "ContentKing",
    avatar: "CK",
    title: "Free Bot Template: Product Showcase",
    content: "I'm sharing my highest-performing bot template that generated 50K views last week. Feel free to use it!",
    category: "template",
    likes: 512,
    comments: 78,
    shares: 156,
    views: 3200,
    timestamp: "1 day ago",
    featured: true,
    verified: true
  },
  {
    id: "4",
    author: "NewbieMarketer",
    avatar: "NM",
    title: "Need Help: Bot Not Getting Engagement",
    content: "I've created 3 bots but they're not getting the engagement I expected. Any tips?",
    category: "question",
    likes: 12,
    comments: 18,
    shares: 3,
    views: 450,
    timestamp: "3 hours ago",
    featured: false,
    verified: false
  }
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "ContentKing", avatar: "CK", points: 8450, bots: 24, engagement: 95.2, badge: "gold" },
  { rank: 2, username: "MarketingPro", avatar: "MP", points: 7230, bots: 19, engagement: 92.8, badge: "silver" },
  { rank: 3, username: "EcomGuru", avatar: "EG", points: 6890, bots: 21, engagement: 89.5, badge: "bronze" },
  { rank: 4, username: "SocialWizard", avatar: "SW", points: 5420, bots: 15, engagement: 87.3, badge: null },
  { rank: 5, username: "ViralMaster", avatar: "VM", points: 4980, bots: 18, engagement: 85.1, badge: null },
];

const getCategoryColor = (category: CommunityPost["category"]) => {
  switch (category) {
    case "template": return "bg-blue-900 text-blue-300";
    case "strategy": return "bg-purple-900 text-purple-300";
    case "success": return "bg-green-900 text-green-300";
    case "question": return "bg-gold-700 text-gold-300";
  }
};

const getCategoryLabel = (category: CommunityPost["category"]) => {
  switch (category) {
    case "template": return "Template";
    case "strategy": return "Strategy";
    case "success": return "Success Story";
    case "question": return "Question";
  }
};

const getBadgeIcon = (badge: LeaderboardEntry["badge"]) => {
  switch (badge) {
    case "gold": return <Crown className="w-5 h-5 text-gold-500" />;
    case "silver": return <Award className="w-5 h-5 text-gray-400" />;
    case "bronze": return <Trophy className="w-5 h-5 text-orange-500" />;
    default: return null;
  }
};

export default function CommunityFeatures() {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts = selectedCategory === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gold-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-gold-500" />
            Community Hub
          </h3>
          <p className="text-muted-foreground mt-1">
            Connect with other marketers, share strategies, and learn from success stories
          </p>
        </div>
        <Badge className="badge-gold">
          <Flame className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black-900">
          <TabsTrigger
            value="feed"
            className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Community Feed
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900"
          >
            <Trophy className="w-4 h-4 mr-1" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900"
          >
            <Star className="w-4 h-4 mr-1" />
            Shared Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4 mt-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory("all")}
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={selectedCategory === "all" ? "btn-gold" : "btn-gold-ghost"}
            >
              All Posts
            </Button>
            <Button
              onClick={() => setSelectedCategory("success")}
              variant={selectedCategory === "success" ? "default" : "outline"}
              size="sm"
              className={selectedCategory === "success" ? "btn-gold" : "btn-gold-ghost"}
            >
              Success Stories
            </Button>
            <Button
              onClick={() => setSelectedCategory("strategy")}
              variant={selectedCategory === "strategy" ? "default" : "outline"}
              size="sm"
              className={selectedCategory === "strategy" ? "btn-gold" : "btn-gold-ghost"}
            >
              Strategies
            </Button>
            <Button
              onClick={() => setSelectedCategory("template")}
              variant={selectedCategory === "template" ? "default" : "outline"}
              size="sm"
              className={selectedCategory === "template" ? "btn-gold" : "btn-gold-ghost"}
            >
              Templates
            </Button>
            <Button
              onClick={() => setSelectedCategory("question")}
              variant={selectedCategory === "question" ? "default" : "outline"}
              size="sm"
              className={selectedCategory === "question" ? "btn-gold" : "btn-gold-ghost"}
            >
              Questions
            </Button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className={`panel-dark ${post.featured ? "border-gold shadow-gold" : "border-gold-800"}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-black-900 font-bold">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gold-100">{post.author}</span>
                          {post.verified && (
                            <Badge className="bg-blue-900 text-blue-300 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </div>
                  <CardTitle className="text-gold-100 mt-4">{post.title}</CardTitle>
                  <CardDescription className="text-gold-300">{post.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-gold-300 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-gold-300 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-gold-300 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="btn-gold-ghost">
                      View Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4 mt-6">
          <Card className="panel-dark border-gold">
            <CardHeader>
              <CardTitle className="text-gold-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                Top Contributors This Month
              </CardTitle>
              <CardDescription>
                Earn points by sharing templates, helping others, and creating successful bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_LEADERBOARD.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      entry.rank <= 3
                        ? "bg-gradient-to-r from-gold-800/20 to-transparent border-gold-500"
                        : "bg-black-900 border-gold-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl font-bold text-gold-300 w-8">
                        #{entry.rank}
                      </div>
                      {getBadgeIcon(entry.badge)}
                      <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-black-900 font-bold">
                        {entry.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gold-100">{entry.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.bots} bots · {entry.engagement}% avg engagement
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gold-500">
                        {entry.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Earn Points */}
          <Card className="panel-dark border-gold">
            <CardHeader>
              <CardTitle className="text-gold-100">How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-black-900 rounded-lg border border-gold-800">
                  <Share2 className="w-5 h-5 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gold-100">Share Templates</p>
                    <p className="text-sm text-muted-foreground">+50 points per template</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black-900 rounded-lg border border-gold-800">
                  <MessageSquare className="w-5 h-5 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gold-100">Help Others</p>
                    <p className="text-sm text-muted-foreground">+10 points per helpful comment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black-900 rounded-lg border border-gold-800">
                  <TrendingUp className="w-5 h-5 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gold-100">Create Successful Bots</p>
                    <p className="text-sm text-muted-foreground">+100 points per viral bot</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black-900 rounded-lg border border-gold-800">
                  <Star className="w-5 h-5 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gold-100">Get Featured</p>
                    <p className="text-sm text-muted-foreground">+200 points when featured</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-6">
          <Card className="panel-dark border-gold">
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 text-gold-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gold-100 mb-2">Community Templates Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Soon you'll be able to browse and download bot templates shared by the community
              </p>
              <Button className="btn-gold">
                <UserPlus className="w-4 h-4 mr-2" />
                Join Waitlist
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
