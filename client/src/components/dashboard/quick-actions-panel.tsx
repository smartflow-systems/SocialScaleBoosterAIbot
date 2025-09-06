import { Power, RotateCcw, Gauge } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useConnectionState } from "@/hooks/use-connection-state";

interface QuickActionsPanelProps {
  onSpeedTestClick?: () => void;
}

export function QuickActionsPanel({ onSpeedTestClick }: QuickActionsPanelProps) {
  const { toast } = useToast();
  const { connectedServer, disconnect } = useConnectionState();

  const handleDisconnect = () => {
    if (connectedServer) {
      disconnect();
      toast({
        title: "VPN Disconnected",
        description: `Disconnected from ${connectedServer.name}`,
      });
    } else {
      toast({
        title: "Not Connected",
        description: "You are not currently connected to any VPN server.",
        variant: "destructive",
      });
    }
  };

  const handleChangeServer = () => {
    // Scroll to server list section
    const serverSection = document.querySelector('[data-testid="server-list-panel"]');
    if (serverSection) {
      serverSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast({
        title: "Server Selection",
        description: "Choose a server from the list below.",
      });
    } else {
      toast({
        title: "Server Selection",
        description: "Please select a server from the list below.",
      });
    }
  };

  const handleSpeedTest = () => {
    if (onSpeedTestClick) {
      onSpeedTestClick();
      toast({
        title: "Speed Test Started",
        description: "Running connection speed test...",
      });
    } else {
      // Scroll to speed test section as fallback
      const speedTestSection = document.querySelector('[data-testid="speed-test-panel"]');
      if (speedTestSection) {
        speedTestSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast({
          title: "Speed Test",
          description: "Use the speed test panel below to test your connection.",
        });
      }
    }
  };

  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <Power className="mr-3" />
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Button 
          variant="ghost" 
          className="w-full glass-panel rounded-lg py-3 px-4 text-left justify-start hover:bg-primary/10 transition-colors"
          onClick={handleDisconnect}
          data-testid="button-disconnect"
        >
          <Power className="text-red-400 mr-3" />
          Disconnect VPN
        </Button>
        <Button 
          variant="ghost"
          className="w-full glass-panel rounded-lg py-3 px-4 text-left justify-start hover:bg-primary/10 transition-colors"
          onClick={handleChangeServer}
          data-testid="button-change-server"
        >
          <RotateCcw className="text-primary mr-3" />
          Change Server
        </Button>
        <Button 
          variant="ghost"
          className="w-full glass-panel rounded-lg py-3 px-4 text-left justify-start hover:bg-primary/10 transition-colors"
          onClick={handleSpeedTest}
          data-testid="button-speed-test"
        >
          <Gauge className="text-primary mr-3" />
          Run Speed Test
        </Button>
      </div>
    </GlassPanel>
  );
}
