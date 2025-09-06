import { useState } from "react";
import { Settings, X } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [autoConnect, setAutoConnect] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={handleBackdropClick}
      data-testid="settings-dialog"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <GlassPanel className="p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary flex items-center">
              <Settings className="mr-3" />
              Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-primary"
              data-testid="button-close-settings"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Connection</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-connect" className="text-sm text-foreground">
                  Auto Connect
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically connect to VPN on startup
                </p>
              </div>
              <Switch
                id="auto-connect"
                checked={autoConnect}
                onCheckedChange={setAutoConnect}
                data-testid="switch-auto-connect"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="kill-switch" className="text-sm text-foreground">
                  Kill Switch
                </Label>
                <p className="text-xs text-muted-foreground">
                  Block internet if VPN disconnects
                </p>
              </div>
              <Switch
                id="kill-switch"
                checked={killSwitch}
                onCheckedChange={setKillSwitch}
                data-testid="switch-kill-switch"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Interface</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-sm text-foreground">
                  Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show connection status notifications
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-sm text-foreground">
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use dark interface theme
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary">Advanced</h3>
            
            <div className="space-y-2">
              <Label className="text-sm text-foreground">DNS Settings</Label>
              <p className="text-xs text-muted-foreground mb-2">Current: 1.1.1.1, 1.0.0.1</p>
              <Button variant="outline" size="sm" className="w-full" data-testid="button-change-dns">
                Change DNS Servers
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Protocol</Label>
              <p className="text-xs text-muted-foreground mb-2">Current: OpenVPN</p>
              <Button variant="outline" size="sm" className="w-full" data-testid="button-change-protocol">
                Change Protocol
              </Button>
            </div>
          </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={onClose} data-testid="button-save-settings">
              Save Changes
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}