import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IntegrationStatus {
  [key: string]: 'connected' | 'disconnected' | 'pending';
}

export default function SocialIntegrationWizard() {
  const [activeStep, setActiveStep] = useState(1);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    tiktok: 'disconnected',
    instagram: 'disconnected',
    facebook: 'disconnected',
    twitter: 'disconnected',
    youtube: 'disconnected'
  });
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok Business',
      icon: '📱',
      description: 'Connect your TikTok Business account for automated content posting',
      fields: ['App ID', 'App Secret', 'Access Token'],
      setupUrl: 'https://developers.tiktok.com/apps/'
    },
    {
      id: 'instagram',
      name: 'Instagram Business',
      icon: '📸',
      description: 'Integrate Instagram Business API for post automation',
      fields: ['Client ID', 'Client Secret', 'Access Token'],
      setupUrl: 'https://developers.facebook.com/apps/'
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      icon: '👤',
      description: 'Connect Facebook Pages API for business automation',
      fields: ['App ID', 'App Secret', 'Page Access Token'],
      setupUrl: 'https://developers.facebook.com/apps/'
    },
    {
      id: 'twitter',
      name: 'Twitter/X API',
      icon: '🐦',
      description: 'Connect Twitter API v2 for automated tweeting',
      fields: ['API Key', 'API Secret', 'Bearer Token'],
      setupUrl: 'https://developer.twitter.com/en/portal/projects-and-apps'
    },
    {
      id: 'youtube',
      name: 'YouTube Data API',
      icon: '📺',
      description: 'Connect YouTube for video metadata and analytics',
      fields: ['Client ID', 'Client Secret', 'Refresh Token'],
      setupUrl: 'https://console.cloud.google.com/apis/credentials'
    }
  ];

  const handleConnect = (platformId: string) => {
    setIntegrationStatus(prev => ({ ...prev, [platformId]: 'pending' }));
    
    // Simulate API connection
    setTimeout(() => {
      setIntegrationStatus(prev => ({ ...prev, [platformId]: 'connected' }));
      toast({
        title: "Integration Successful! ✅",
        description: `${platforms.find(p => p.id === platformId)?.name} has been connected.`,
        className: "bg-accent-gold text-primary-black",
      });
    }, 2000);
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-accent-gold" />;
      case 'pending':
        return <div className="w-5 h-5 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray" />;
    }
  };

  const connectedCount = Object.values(integrationStatus).filter(status => status === 'connected').length;
  const progressPercentage = (connectedCount / platforms.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-secondary-brown border-accent-gold">
        <CardHeader>
          <CardTitle className="text-accent-gold flex items-center justify-between">
            Social Media Integration Setup
            <Badge className="bg-accent-gold text-primary-black">
              {connectedCount}/{platforms.length} Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">Integration Progress</span>
              <span className="text-accent-gold font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Integration Steps */}
      <Tabs value={activeStep.toString()} onValueChange={(value) => setActiveStep(parseInt(value))}>
        <TabsList className="bg-secondary-brown border-accent-gold grid grid-cols-3 w-full">
          <TabsTrigger value="1" className="text-white data-[state=active]:bg-accent-gold data-[state=active]:text-primary-black">
            1. Choose Platforms
          </TabsTrigger>
          <TabsTrigger value="2" className="text-white data-[state=active]:bg-accent-gold data-[state=active]:text-primary-black">
            2. Configure APIs
          </TabsTrigger>
          <TabsTrigger value="3" className="text-white data-[state=active]:bg-accent-gold data-[state=active]:text-primary-black">
            3. Test Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="space-y-4">
          <h3 className="text-xl font-bold text-accent-gold mb-4">Select Social Media Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <Card 
                key={platform.id} 
                className={`bg-secondary-brown border-2 transition-all cursor-pointer ${
                  integrationStatus[platform.id] === 'connected' 
                    ? 'border-accent-gold gold-glow' 
                    : 'border-gray hover:border-accent-gold'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <h4 className="font-bold text-white">{platform.name}</h4>
                        <p className="text-sm text-gray">{platform.description}</p>
                      </div>
                    </div>
                    {getStatusIcon(integrationStatus[platform.id])}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${
                      integrationStatus[platform.id] === 'connected' 
                        ? 'bg-accent-gold text-primary-black' 
                        : 'bg-secondary-brown text-gray border border-gray'
                    }`}>
                      {integrationStatus[platform.id] === 'connected' ? 'Connected' : 'Not Connected'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(platform.setupUrl, '_blank')}
                      className="text-accent-gold border-accent-gold hover:bg-accent-gold hover:text-primary-black"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Setup Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setActiveStep(2)}
              className="bg-accent-gold text-primary-black hover:opacity-90 font-bold"
            >
              Continue to Configuration
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="2" className="space-y-6">
          <h3 className="text-xl font-bold text-accent-gold mb-4">Configure API Credentials</h3>
          {platforms.map((platform) => (
            <Card key={platform.id} className="bg-secondary-brown border-accent-gold">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <span className="text-xl">{platform.icon}</span>
                  {platform.name}
                  {getStatusIcon(integrationStatus[platform.id])}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platform.fields.map((field) => {
                  const fieldKey = `${platform.id}-${field.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <div key={field} className="space-y-2">
                      <Label className="text-white font-medium">{field}</Label>
                      <div className="relative">
                        <Input
                          type={showApiKeys[fieldKey] ? "text" : "password"}
                          placeholder={`Enter your ${field}`}
                          className="bg-primary-black border-accent-gold text-white pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray hover:text-accent-gold"
                          onClick={() => toggleApiKeyVisibility(fieldKey)}
                        >
                          {showApiKeys[fieldKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button
                  onClick={() => handleConnect(platform.id)}
                  disabled={integrationStatus[platform.id] === 'pending'}
                  className="w-full bg-accent-gold text-primary-black hover:opacity-90 font-bold"
                >
                  {integrationStatus[platform.id] === 'pending' ? 'Connecting...' : 'Connect Platform'}
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between">
            <Button 
              onClick={() => setActiveStep(1)}
              variant="outline"
              className="text-accent-gold border-accent-gold hover:bg-accent-gold hover:text-primary-black"
            >
              Back to Platform Selection
            </Button>
            <Button 
              onClick={() => setActiveStep(3)}
              className="bg-accent-gold text-primary-black hover:opacity-90 font-bold"
            >
              Test Connections
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="3" className="space-y-6">
          <h3 className="text-xl font-bold text-accent-gold mb-4">Test Your Integrations</h3>
          <Card className="bg-secondary-brown border-accent-gold">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary-black" />
                </div>
                <h4 className="text-xl font-bold text-accent-gold">Integration Complete!</h4>
                <p className="text-white">
                  {connectedCount} platform{connectedCount !== 1 ? 's' : ''} successfully connected. 
                  Your bots can now post to these social media accounts automatically.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        integrationStatus[platform.id] === 'connected' 
                          ? 'bg-accent-gold' 
                          : 'bg-gray'
                      }`}>
                        <span className="text-lg">{platform.icon}</span>
                      </div>
                      <p className={`text-xs ${
                        integrationStatus[platform.id] === 'connected' 
                          ? 'text-accent-gold' 
                          : 'text-gray'
                      }`}>
                        {platform.name.split(' ')[0]}
                      </p>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => window.location.href = '/dashboard?tab=bots'}
                  className="bg-accent-gold text-primary-black hover:opacity-90 font-bold mt-6"
                >
                  Create Your First Bot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}