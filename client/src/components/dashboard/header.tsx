import { Shield, Settings } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useConnectionState } from "@/hooks/use-connection-state";
import { SettingsDialog } from "@/components/ui/settings-dialog";
import { useState } from "react";

export function Header() {
  const { connectedServer } = useConnectionState();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <header>
      <GlassPanel className="rounded-none border-x-0 border-t-0 p-6 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary" data-testid="header-title">Smart Flow Systems</h1>
              <p className="text-muted-foreground text-sm" data-testid="header-subtitle">VPN Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Connection Status</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full pulse-dot ${connectedServer ? 'bg-status-online' : 'bg-status-offline'}`} data-testid="status-indicator"></div>
                <span className={`font-medium ${connectedServer ? 'status-online' : 'status-offline'}`} data-testid="status-text">
                  {connectedServer ? `Connected to ${connectedServer.name}` : "Disconnected"}
                </span>
              </div>
            </div>
            <button 
              className="glass-panel px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors" 
              onClick={() => setSettingsOpen(true)}
              data-testid="button-settings"
            >
              <Settings className="text-primary" />
            </button>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
        </div>
      </GlassPanel>
    </header>
  );
}
