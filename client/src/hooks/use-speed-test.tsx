import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useConnectionState } from "./use-connection-state";

interface SpeedTestResults {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
}

export function useSpeedTest() {
  const [results, setResults] = useState<SpeedTestResults>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
  });
  
  const { toast } = useToast();
  const { connectedServer } = useConnectionState();

  const speedTestMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/speed-test", {
      serverId: connectedServer?.id || null,
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0
    }),
    onSuccess: async (response) => {
      const data = await response.json();
      
      // Animate the results gradually
      const targetResults = {
        downloadSpeed: data.downloadSpeed,
        uploadSpeed: data.uploadSpeed,
        ping: data.ping,
      };
      
      // Simulate progressive updates during testing
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        setTimeout(() => {
          setResults({
            downloadSpeed: (targetResults.downloadSpeed * i) / steps,
            uploadSpeed: (targetResults.uploadSpeed * i) / steps,
            ping: targetResults.ping + ((50 - targetResults.ping) * (steps - i)) / steps,
          });
        }, (i * 100));
      }

      toast({
        title: "Speed Test Complete",
        description: `Download: ${data.downloadSpeed.toFixed(1)} Mbps, Upload: ${data.uploadSpeed.toFixed(1)} Mbps`,
      });
    },
    onError: () => {
      toast({
        title: "Speed Test Failed",
        description: "Unable to complete speed test. Please try again.",
        variant: "destructive",
      });
    },
  });

  const runSpeedTest = () => {
    // Reset results and show animation
    setResults({ downloadSpeed: 0, uploadSpeed: 0, ping: 999 });
    speedTestMutation.mutate();
  };

  return {
    isRunning: speedTestMutation.isPending,
    results,
    runSpeedTest,
  };
}
