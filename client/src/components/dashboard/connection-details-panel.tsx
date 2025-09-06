import { Network } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useEffect, useState } from "react";

export function ConnectionDetailsPanel() {
  const [connectionTime, setConnectionTime] = useState("2h 34m");
  
  useEffect(() => {
    // Update connection time every minute
    const interval = setInterval(() => {
      const startTime = Date.now() - (2 * 60 + 34) * 60 * 1000; // 2h 34m ago
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      setConnectionTime(`${hours}h ${minutes}m`);
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
          <span className="text-muted-foreground">Protocol</span>
          <span className="text-white" data-testid="text-protocol">OpenVPN</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Encryption</span>
          <span className="text-white" data-testid="text-encryption">AES-256</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Port</span>
          <span className="text-white" data-testid="text-port">1194</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Connected Time</span>
          <span className="text-white" data-testid="text-connected-time">{connectionTime}</span>
        </div>
      </div>
    </GlassPanel>
  );
}
