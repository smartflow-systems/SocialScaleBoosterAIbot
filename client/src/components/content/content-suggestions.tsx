import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Calendar, Target, Lightbulb, Zap } from "lucide-react";

interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  category: "trending" | "seasonal" | "engagement" | "viral";
  platform: string[];
  estimatedReach: string;
  difficulty: "easy" | "medium" | "hard";
}

const MOCK_SUGGESTIONS: ContentSuggestion[] = [
  {
    id: "1",
    title: "Behind-the-Scenes Product Creation",
    description: "Show your audience the process of creating your products. This builds authenticity and trust.",
    category: "engagement",
    platform: ["Instagram", "TikTok"],
    estimatedReach: "5K-15K",
    difficulty: "easy"
  },
  {
    id: "2",
    title: "Trending Audio Challenge",
    description: "Create content using the latest trending audio on TikTok to maximize visibility.",
    category: "trending",
    platform: ["TikTok", "Instagram Reels"],
    estimatedReach: "20K-50K",
    difficulty: "medium"
  },
  {
    id: "3",
    title: "User-Generated Content Showcase",
    description: "Feature customer testimonials and reviews in an engaging video format.",
    category: "engagement",
    platform: ["Instagram", "Facebook", "TikTok"],
    estimatedReach: "10K-25K",
    difficulty: "easy"
  },
  {
    id: "4",
    title: "Holiday Sale Countdown",
    description: "Create urgency with a countdown timer for your upcoming seasonal sale.",
    category: "seasonal",
    platform: ["Instagram Stories", "Facebook"],
    estimatedReach: "8K-20K",
    difficulty: "medium"
  }
];

const getCategoryIcon = (category: ContentSuggestion["category"]) => {
  switch (category) {
    case "trending": return <TrendingUp className="w-4 h-4" />;
    case "seasonal": return <Calendar className="w-4 h-4" />;
    case "engagement": return <Target className="w-4 h-4" />;
    case "viral": return <Zap className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: ContentSuggestion["category"]) => {
  switch (category) {
    case "trending": return "bg-blue-900 text-blue-300";
    case "seasonal": return "bg-purple-900 text-purple-300";
    case "engagement": return "bg-green-900 text-green-300";
    case "viral": return "bg-gold-700 text-gold-300";
  }
};

const getDifficultyColor = (difficulty: ContentSuggestion["difficulty"]) => {
  switch (difficulty) {
    case "easy": return "bg-green-900 text-green-300";
    case "medium": return "bg-gold-700 text-gold-300";
    case "hard": return "bg-red-900 text-red-300";
  }
};

export default function ContentSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredSuggestions = selectedCategory === "all"
    ? MOCK_SUGGESTIONS
    : MOCK_SUGGESTIONS.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold-500" />
            AI-Powered Content Suggestions
          </h3>
          <p className="text-muted-foreground mt-1">
            Get personalized content ideas based on trending topics and your audience engagement
          </p>
        </div>
        <Badge className="badge-gold">
          <Lightbulb className="w-3 h-3 mr-1" />
          Beta Feature
        </Badge>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedCategory("all")}
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          className={selectedCategory === "all" ? "btn-gold" : "btn-gold-ghost"}
        >
          All Suggestions
        </Button>
        <Button
          onClick={() => setSelectedCategory("trending")}
          variant={selectedCategory === "trending" ? "default" : "outline"}
          size="sm"
          className={selectedCategory === "trending" ? "btn-gold" : "btn-gold-ghost"}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Trending
        </Button>
        <Button
          onClick={() => setSelectedCategory("seasonal")}
          variant={selectedCategory === "seasonal" ? "default" : "outline"}
          size="sm"
          className={selectedCategory === "seasonal" ? "btn-gold" : "btn-gold-ghost"}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Seasonal
        </Button>
        <Button
          onClick={() => setSelectedCategory("engagement")}
          variant={selectedCategory === "engagement" ? "default" : "outline"}
          size="sm"
          className={selectedCategory === "engagement" ? "btn-gold" : "btn-gold-ghost"}
        >
          <Target className="w-4 h-4 mr-1" />
          High Engagement
        </Button>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="panel-dark border-gold hover:shadow-gold transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-gold-100 flex items-center gap-2">
                    {getCategoryIcon(suggestion.category)}
                    {suggestion.title}
                  </CardTitle>
                  <CardDescription className="text-gold-300 mt-2">
                    {suggestion.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platforms */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Platforms:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestion.platform.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Reach</p>
                  <p className="text-sm font-semibold text-gold-300">{suggestion.estimatedReach}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <Badge className={getDifficultyColor(suggestion.difficulty)}>
                    {suggestion.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 btn-gold" size="sm">
                  <Zap className="w-4 h-4 mr-1" />
                  Generate Content
                </Button>
                <Button variant="outline" size="sm" className="btn-gold-ghost">
                  Save for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSuggestions.length === 0 && (
        <Card className="panel-dark border-gold">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No suggestions available for this category</p>
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-gold-800 to-gold-700 border-gold-500">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-gold-100" />
            <p className="text-sm text-gold-100">
              <strong>Pro Tip:</strong> Content suggestions are updated daily based on trending topics,
              seasonal events, and your audience engagement patterns. Check back often for fresh ideas!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
