import { useState, createContext, useContext, ReactNode } from 'react';
import { VpnServer } from '@shared/schema';

interface ConnectionState {
  connectedServer: VpnServer | null;
  isConnecting: boolean;
  connectToServer: (server: VpnServer) => void;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connectedServer, setConnectedServer] = useState<VpnServer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToServer = (server: VpnServer) => {
    setIsConnecting(true);
    // Simulate connection time
    setTimeout(() => {
      setConnectedServer(server);
      setIsConnecting(false);
    }, 1500);
  };

  const disconnect = () => {
    setConnectedServer(null);
  };

  return (
    <ConnectionContext.Provider value={{ 
      connectedServer, 
      isConnecting, 
      connectToServer, 
      disconnect 
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionState() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnectionState must be used within a ConnectionProvider');
  }
  return context;
}