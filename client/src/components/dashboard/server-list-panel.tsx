import { Server, CheckCircle, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { type VpnServer } from "@shared/schema";
import { usePingTest } from "@/hooks/use-ping-test";
import { useConnectionState } from "@/hooks/use-connection-state";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ServerListPanelProps {
  servers: VpnServer[];
}

export function ServerListPanel({ servers }: ServerListPanelProps) {
  const { pingServer, pings } = usePingTest();
  const { connectedServer, isConnecting, connectToServer } = useConnectionState();
  const { toast } = useToast();

  const getSignalBars = (ping: number | null | undefined) => {
    if (!ping) return 1;
    if (ping < 50) return 4;
    if (ping < 100) return 3;
    if (ping < 150) return 2;
    return 1;
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      US: "🇺🇸",
      UK: "🇬🇧", 
      JP: "🇯🇵",
      DE: "🇩🇪",
    };
    return flags[countryCode] || "🌍";
  };

  const handleServerClick = (server: VpnServer) => {
    if (connectedServer?.id === server.id) {
      // Already connected to this server
      return;
    }
    
    connectToServer(server);
    toast({
      title: `Connecting to ${server.name}`,
      description: "Establishing secure connection...",
    });
  };

  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <Server className="mr-3" />
        Available Servers
      </h3>
      <div className="space-y-3">
        {servers.map((server) => {
          const currentPing = pings[server.id] || server.ping;
          const isConnected = connectedServer?.id === server.id;
          const isThisServerConnecting = isConnecting && connectedServer?.id === server.id;
          
          return (
            <div 
              key={server.id}
              className={`glass-panel rounded-lg p-4 hover:bg-primary/5 transition-colors cursor-pointer ${
                isConnected ? 'border-primary/50 bg-primary/5' : ''
              } ${isThisServerConnecting ? 'border-primary/30 bg-primary/3' : ''}`}
              onClick={() => handleServerClick(server)}
              data-testid={`server-item-${server.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getCountryFlag(server.countryCode)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium" data-testid={`text-server-name-${server.id}`}>
                        {server.name}
                      </p>
                      {isConnected && (
                        <CheckCircle className="text-primary text-sm" data-testid={`icon-connected-${server.id}`} />
                      )}
                      {isThisServerConnecting && (
                        <Loader2 className="text-primary text-sm animate-spin" data-testid={`icon-connecting-${server.id}`} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid={`text-server-load-${server.id}`}>
                      Load: {server.load}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <p className="text-primary font-medium" data-testid={`text-server-ping-${server.id}`}>
                      {currentPing ? `${Math.round(currentPing)}ms` : '--'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => pingServer(server.id)}
                      className="p-1 h-6 w-6"
                      data-testid={`button-ping-${server.id}`}
                    >
                      🔄
                    </Button>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i < getSignalBars(currentPing) ? 'bg-green-400' : 'bg-gray-400'
                        }`}
                        data-testid={`signal-bar-${i}-${server.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
