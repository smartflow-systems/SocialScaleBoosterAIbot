import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/dashboard/header";
import { IpInfoPanel } from "@/components/dashboard/ip-info-panel";
import { ConnectionDetailsPanel } from "@/components/dashboard/connection-details-panel";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { SpeedTestPanel } from "@/components/dashboard/speed-test-panel";
import { ServerListPanel } from "@/components/dashboard/server-list-panel";
import { ConnectionHistoryPanel } from "@/components/dashboard/connection-history-panel";
import { SecurityPanel } from "@/components/dashboard/security-panel";
import { useNetworkInfo } from "@/hooks/use-network-info";

export default function Dashboard() {
  const { data: networkInfo, isLoading: networkLoading } = useNetworkInfo();
  
  const { data: servers } = useQuery({
    queryKey: ["/api/servers"],
  });

  const { data: connectionHistory } = useQuery({
    queryKey: ["/api/connection-history"],
  });

  const { data: securityCheck } = useQuery({
    queryKey: ["/api/security-check"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Current Connection Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <IpInfoPanel networkInfo={networkInfo} isLoading={networkLoading} />
          <ConnectionDetailsPanel />
          <QuickActionsPanel />
        </div>

        {/* Speed Test Section */}
        <SpeedTestPanel />

        {/* Server Selection and Connection History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServerListPanel servers={servers || []} />
          <ConnectionHistoryPanel connectionHistory={connectionHistory || []} />
        </div>

        {/* Security and Leak Tests */}
        <SecurityPanel securityCheck={securityCheck} />
      </div>

      {/* Footer */}
      <footer className="mt-12 p-6 text-center text-muted-foreground text-sm">
        <p>&copy; 2024 Smart Flow Systems. All rights reserved. | Secure VPN Solutions</p>
      </footer>
    </div>
  );
}
