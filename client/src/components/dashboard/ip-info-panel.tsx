import { Globe } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { type NetworkInfo } from "@shared/schema";

interface IpInfoPanelProps {
  networkInfo?: NetworkInfo;
  isLoading: boolean;
}

export function IpInfoPanel({ networkInfo, isLoading }: IpInfoPanelProps) {
  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <Globe className="mr-3" />
        Current IP Address
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Public IP</p>
          {isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <p className="text-xl font-mono text-white" data-testid="text-current-ip">
              {networkInfo?.ip || "Unable to detect"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Location</p>
          {isLoading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <p className="text-white" data-testid="text-location">
              {networkInfo ? `${networkInfo.city}, ${networkInfo.region}, ${networkInfo.country}` : "Unknown"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ISP</p>
          {isLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            <p className="text-white" data-testid="text-isp">
              {networkInfo?.isp || "Unknown"}
            </p>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}
