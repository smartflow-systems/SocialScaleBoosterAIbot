import { Shield, Check, RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { type SecurityCheck } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SecurityPanelProps {
  securityCheck?: SecurityCheck;
}

export function SecurityPanel({ securityCheck }: SecurityPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const runSecurityCheck = useMutation({
    mutationFn: () => apiRequest("POST", "/api/security-check", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security-check"] });
      toast({
        title: "Security Check Complete",
        description: "All security checks passed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Security Check Failed",
        description: "Unable to complete security check. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    return status === "protected" || status === "blocked" ? (
      <Check className="text-green-400 text-xl" />
    ) : (
      <RotateCcw className="text-primary text-xl animate-spin" />
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "protected":
        return "Protected";
      case "blocked":
        return "Blocked";
      default:
        return "Checking...";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "protected" || status === "blocked" ? "text-green-400" : "text-primary";
  };

  return (
    <GlassPanel className="rounded-lg p-6">
      <h3 className="text-xl font-semibold text-primary mb-6 flex items-center">
        <Shield className="mr-3" />
        Security & Leak Detection
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-400/20 rounded-full flex items-center justify-center">
            {getStatusIcon(securityCheck?.dnsLeakStatus || "checking")}
          </div>
          <h4 className="text-white font-medium mb-1" data-testid="text-dns-leak-title">DNS Leak</h4>
          <p 
            className={`text-sm ${getStatusColor(securityCheck?.dnsLeakStatus || "checking")}`}
            data-testid="text-dns-leak-status"
          >
            {getStatusText(securityCheck?.dnsLeakStatus || "checking")}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-400/20 rounded-full flex items-center justify-center">
            {getStatusIcon(securityCheck?.ipLeakStatus || "checking")}
          </div>
          <h4 className="text-white font-medium mb-1" data-testid="text-ip-leak-title">IP Leak</h4>
          <p 
            className={`text-sm ${getStatusColor(securityCheck?.ipLeakStatus || "checking")}`}
            data-testid="text-ip-leak-status"
          >
            {getStatusText(securityCheck?.ipLeakStatus || "checking")}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-green-400/20 rounded-full flex items-center justify-center">
            {getStatusIcon(securityCheck?.webrtcStatus || "checking")}
          </div>
          <h4 className="text-white font-medium mb-1" data-testid="text-webrtc-title">WebRTC</h4>
          <p 
            className={`text-sm ${getStatusColor(securityCheck?.webrtcStatus || "checking")}`}
            data-testid="text-webrtc-status"
          >
            {getStatusText(securityCheck?.webrtcStatus || "checking")}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
            <RotateCcw className="text-primary text-xl" />
          </div>
          <h4 className="text-white font-medium mb-1" data-testid="text-full-test-title">Full Test</h4>
          <Button 
            variant="ghost"
            className="text-primary text-sm hover:underline p-0 h-auto"
            onClick={() => runSecurityCheck.mutate()}
            disabled={runSecurityCheck.isPending}
            data-testid="button-run-full-security-test"
          >
            {runSecurityCheck.isPending ? "Running..." : "Run Now"}
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}
