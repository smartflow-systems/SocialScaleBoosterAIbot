import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Instagram, Edit, BarChart3 } from "lucide-react";
import { Bot } from "@shared/schema";

interface BotCardProps {
  bot: Bot;
}

export default function BotCard({ bot }: BotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok': return <ShoppingBag className="text-primary-black w-6 h-6" />;
      case 'instagram': return <Instagram className="text-primary-black w-6 h-6" />;
      default: return <ShoppingBag className="text-primary-black w-6 h-6" />;
    }
  };

  const metrics = bot.metrics as any || { posts: 0, engagement: 0 };

  return (
    <Card className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center">
            {getPlatformIcon(bot.platform)}
          </div>
          <Badge className={`${getStatusColor(bot.status)} text-white text-xs font-semibold`}>
            {bot.status?.charAt(0).toUpperCase() + bot.status?.slice(1) || 'Active'}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{bot.name}</h3>
        <p className="text-neutral-gray mb-4">{bot.description}</p>
        
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="text-accent-gold font-semibold">{metrics.posts} posts</span>
          <span className="text-green-400 font-semibold">+{metrics.engagement}% engagement</span>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1 bg-secondary-brown text-accent-gold hover:bg-accent-gold hover:text-primary-black transition-colors">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button className="flex-1 bg-accent-gold text-primary-black hover:opacity-90 transition-opacity">
            <BarChart3 className="w-4 h-4 mr-1" />
            Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
