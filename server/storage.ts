import { 
  type VpnServer, 
  type InsertVpnServer,
  type ConnectionHistory,
  type InsertConnectionHistory,
  type SpeedTestResult,
  type InsertSpeedTestResult,
  type SecurityCheck,
  type InsertSecurityCheck
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // VPN Servers
  getVpnServers(): Promise<VpnServer[]>;
  getVpnServer(id: string): Promise<VpnServer | undefined>;
  createVpnServer(server: InsertVpnServer): Promise<VpnServer>;
  updateVpnServer(id: string, server: Partial<InsertVpnServer>): Promise<VpnServer | undefined>;
  
  // Connection History
  getConnectionHistory(limit?: number): Promise<ConnectionHistory[]>;
  createConnectionHistory(connection: InsertConnectionHistory): Promise<ConnectionHistory>;
  updateConnectionHistory(id: string, connection: Partial<InsertConnectionHistory>): Promise<ConnectionHistory | undefined>;
  
  // Speed Test Results
  getSpeedTestResults(serverId?: string, limit?: number): Promise<SpeedTestResult[]>;
  createSpeedTestResult(result: InsertSpeedTestResult): Promise<SpeedTestResult>;
  
  // Security Checks
  getLatestSecurityCheck(): Promise<SecurityCheck | undefined>;
  createSecurityCheck(check: InsertSecurityCheck): Promise<SecurityCheck>;
}

export class MemStorage implements IStorage {
  private vpnServers: Map<string, VpnServer> = new Map();
  private connectionHistory: Map<string, ConnectionHistory> = new Map();
  private speedTestResults: Map<string, SpeedTestResult> = new Map();
  private securityChecks: Map<string, SecurityCheck> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed VPN servers
    const servers: InsertVpnServer[] = [
      {
        name: "New York, USA",
        country: "United States",
        countryCode: "US",
        city: "New York",
        hostname: "us-ny-01.smartflow.com",
        port: 1194,
        protocol: "OpenVPN",
        load: 67,
        ping: 23,
        isActive: true
      },
      {
        name: "London, UK",
        country: "United Kingdom", 
        countryCode: "UK",
        city: "London",
        hostname: "uk-lon-01.smartflow.com",
        port: 1194,
        protocol: "OpenVPN",
        load: 45,
        ping: 12,
        isActive: true
      },
      {
        name: "Tokyo, Japan",
        country: "Japan",
        countryCode: "JP",
        city: "Tokyo",
        hostname: "jp-tok-01.smartflow.com",
        port: 1194,
        protocol: "OpenVPN",
        load: 23,
        ping: 156,
        isActive: true
      },
      {
        name: "Frankfurt, Germany",
        country: "Germany",
        countryCode: "DE",
        city: "Frankfurt",
        hostname: "de-fra-01.smartflow.com",
        port: 1194,
        protocol: "OpenVPN",
        load: 34,
        ping: 28,
        isActive: true
      }
    ];

    servers.forEach(server => this.createVpnServer(server));

    // Seed connection history
    const histories: InsertConnectionHistory[] = [
      {
        serverId: Array.from(this.vpnServers.keys())[1], // London
        serverName: "London, UK",
        connectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        disconnectedAt: null,
        duration: null,
        status: "connected"
      },
      {
        serverId: Array.from(this.vpnServers.keys())[0], // New York
        serverName: "New York, USA",
        connectedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
        disconnectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        duration: 82,
        status: "disconnected"
      }
    ];

    histories.forEach(history => this.createConnectionHistory(history));

    // Seed security check
    this.createSecurityCheck({
      dnsLeakStatus: "protected",
      ipLeakStatus: "protected", 
      webrtcStatus: "blocked",
      realIp: null,
      vpnIp: "198.51.100.42",
      dnsServers: ["1.1.1.1", "1.0.0.1"]
    });
  }

  // VPN Servers
  async getVpnServers(): Promise<VpnServer[]> {
    return Array.from(this.vpnServers.values());
  }

  async getVpnServer(id: string): Promise<VpnServer | undefined> {
    return this.vpnServers.get(id);
  }

  async createVpnServer(insertServer: InsertVpnServer): Promise<VpnServer> {
    const id = randomUUID();
    const server: VpnServer = {
      ...insertServer,
      id,
      ping: insertServer.ping ?? null,
      lastChecked: new Date()
    };
    this.vpnServers.set(id, server);
    return server;
  }

  async updateVpnServer(id: string, updates: Partial<InsertVpnServer>): Promise<VpnServer | undefined> {
    const server = this.vpnServers.get(id);
    if (!server) return undefined;
    
    const updated = { ...server, ...updates, lastChecked: new Date() };
    this.vpnServers.set(id, updated);
    return updated;
  }

  // Connection History
  async getConnectionHistory(limit = 10): Promise<ConnectionHistory[]> {
    return Array.from(this.connectionHistory.values())
      .sort((a, b) => b.connectedAt.getTime() - a.connectedAt.getTime())
      .slice(0, limit);
  }

  async createConnectionHistory(insertHistory: InsertConnectionHistory): Promise<ConnectionHistory> {
    const id = randomUUID();
    const history: ConnectionHistory = {
      ...insertHistory,
      id,
      duration: insertHistory.duration ?? null,
      serverId: insertHistory.serverId ?? null,
      disconnectedAt: insertHistory.disconnectedAt ?? null
    };
    this.connectionHistory.set(id, history);
    return history;
  }

  async updateConnectionHistory(id: string, updates: Partial<InsertConnectionHistory>): Promise<ConnectionHistory | undefined> {
    const history = this.connectionHistory.get(id);
    if (!history) return undefined;
    
    const updated = { ...history, ...updates };
    this.connectionHistory.set(id, updated);
    return updated;
  }

  // Speed Test Results
  async getSpeedTestResults(serverId?: string, limit = 10): Promise<SpeedTestResult[]> {
    let results = Array.from(this.speedTestResults.values());
    
    if (serverId) {
      results = results.filter(r => r.serverId === serverId);
    }
    
    return results
      .sort((a, b) => b.testDate!.getTime() - a.testDate!.getTime())
      .slice(0, limit);
  }

  async createSpeedTestResult(insertResult: InsertSpeedTestResult): Promise<SpeedTestResult> {
    const id = randomUUID();
    const result: SpeedTestResult = {
      ...insertResult,
      id,
      serverId: insertResult.serverId ?? null,
      jitter: insertResult.jitter ?? null,
      testDate: new Date()
    };
    this.speedTestResults.set(id, result);
    return result;
  }

  // Security Checks
  async getLatestSecurityCheck(): Promise<SecurityCheck | undefined> {
    const checks = Array.from(this.securityChecks.values());
    return checks.sort((a, b) => b.checkedAt!.getTime() - a.checkedAt!.getTime())[0];
  }

  async createSecurityCheck(insertCheck: InsertSecurityCheck): Promise<SecurityCheck> {
    const id = randomUUID();
    const check: SecurityCheck = {
      id,
      dnsLeakStatus: insertCheck.dnsLeakStatus || "protected",
      ipLeakStatus: insertCheck.ipLeakStatus || "protected",
      webrtcStatus: insertCheck.webrtcStatus || "blocked",
      realIp: insertCheck.realIp ?? null,
      vpnIp: insertCheck.vpnIp ?? null,
      dnsServers: insertCheck.dnsServers || null,
      checkedAt: new Date()
    };
    this.securityChecks.set(id, check);
    return check;
  }
}

export const storage = new MemStorage();
