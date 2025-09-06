import { Network } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useEffect, useState } from "react";
import { useConnectionState } from "@/hooks/use-connection-state";

export function ConnectionDetailsPanel() {
  const { connectedServer } = useConnectionState();
  const [connectionTime, setConnectionTime] = useState("0m");
  const [connectionStartTime] = useState(Date.now());
  
  useEffect(() => {
    // Update connection time every minute
    const interval = setInterval(() => {
      if (connectedServer) {
        const elapsed = Date.now() - connectionStartTime;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
          setConnectionTime(`${hours}h ${minutes}m`);
        } else {
          setConnectionTime(`${minutes}m`);
        }
      } else {
        setConnectionTime("0m");
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <Network className="mr-3" />
        Connection Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Server</span>
          <span className="text-white" data-testid="text-server">
            {connectedServer ? connectedServer.name : "Not connected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Protocol</span>
          <span className="text-white" data-testid="text-protocol">
            {connectedServer ? connectedServer.protocol : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Encryption</span>
          <span className="text-white" data-testid="text-encryption">AES-256</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Port</span>
          <span className="text-white" data-testid="text-port">
            {connectedServer ? connectedServer.port : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Connected Time</span>
          <span className="text-white" data-testid="text-connected-time">{connectionTime}</span>
        </div>
      </div>
    </GlassPanel>
  );
}
