import { Power, RotateCcw, Gauge } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function QuickActionsPanel() {
  const { toast } = useToast();

  const handleDisconnect = () => {
    toast({
      title: "VPN Disconnected",
      description: "You have been disconnected from the VPN server.",
    });
  };

  const handleChangeServer = () => {
    toast({
      title: "Server Selection",
      description: "Please select a server from the list below.",
    });
  };

  const handleSpeedTest = () => {
    toast({
      title: "Speed Test",
      description: "Speed test will begin shortly.",
    });
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
