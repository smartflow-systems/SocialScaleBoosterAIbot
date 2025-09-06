import { History } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { type ConnectionHistory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ConnectionHistoryPanelProps {
  connectionHistory: ConnectionHistory[];
}

export function ConnectionHistoryPanel({ connectionHistory }: ConnectionHistoryPanelProps) {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        <History className="mr-3" />
        Connection History
      </h3>
      <div className="space-y-3">
        {connectionHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No connection history available</p>
        ) : (
          connectionHistory.map((connection) => (
            <div 
              key={connection.id}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0"
              data-testid={`connection-history-${connection.id}`}
            >
              <div>
                <p className="text-white font-medium" data-testid={`text-server-name-${connection.id}`}>
                  {connection.serverName}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-connected-time-${connection.id}`}>
                  {formatDistanceToNow(new Date(connection.connectedAt), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p 
                  className={`text-sm ${
                    connection.status === 'connected' ? 'text-green-400' : 'text-gray-400'
                  }`}
                  data-testid={`text-status-${connection.id}`}
                >
                  {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                </p>
                <p className="text-muted-foreground text-xs" data-testid={`text-duration-${connection.id}`}>
                  {formatDuration(connection.duration)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
}
