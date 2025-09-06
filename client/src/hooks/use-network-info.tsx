import { useQuery } from "@tanstack/react-query";
import { type NetworkInfo } from "@shared/schema";

export function useNetworkInfo() {
  return useQuery<NetworkInfo>({
    queryKey: ["/api/network-info"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  });
}
