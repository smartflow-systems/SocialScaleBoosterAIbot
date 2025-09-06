import { Shield, Settings } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

export function Header() {
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
                <div className="w-3 h-3 bg-status-online rounded-full pulse-dot" data-testid="status-indicator"></div>
                <span className="status-online font-medium" data-testid="status-text">Secure</span>
              </div>
            </div>
            <button className="glass-panel px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors" data-testid="button-settings">
              <Settings className="text-primary" />
            </button>
          </div>
        </div>
      </GlassPanel>
    </header>
  );
}
