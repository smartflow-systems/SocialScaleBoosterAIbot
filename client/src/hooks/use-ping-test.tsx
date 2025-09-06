import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePingTest() {
  const [pings, setPings] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const pingMutation = useMutation({
    mutationFn: (serverId: string) => apiRequest("POST", `/api/servers/${serverId}/ping`, {}),
    onSuccess: async (response, serverId) => {
      const data = await response.json();
      setPings(prev => ({ ...prev, [serverId]: data.ping }));
    },
    onError: () => {
      toast({
        title: "Ping Test Failed",
        description: "Unable to ping server. Please try again.",
        variant: "destructive",
      });
    },
  });

  const pingServer = (serverId: string) => {
    pingMutation.mutate(serverId);
  };

  return {
    pings,
    isPinging: pingMutation.isPending,
    pingServer,
  };
}
