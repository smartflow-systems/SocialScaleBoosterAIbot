import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vpnServers = pgTable("vpn_servers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  city: text("city").notNull(),
  hostname: text("hostname").notNull(),
  port: integer("port").notNull().default(1194),
  protocol: text("protocol").notNull().default("OpenVPN"),
  load: real("load").notNull().default(0),
  ping: real("ping"),
  isActive: boolean("is_active").notNull().default(true),
  lastChecked: timestamp("last_checked").defaultNow()
});

export const connectionHistory = pgTable("connection_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serverId: varchar("server_id").references(() => vpnServers.id),
  serverName: text("server_name").notNull(),
  connectedAt: timestamp("connected_at").notNull(),
  disconnectedAt: timestamp("disconnected_at"),
  duration: integer("duration"), // in minutes
  status: text("status").notNull() // 'connected', 'disconnected', 'error'
});

export const speedTestResults = pgTable("speed_test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serverId: varchar("server_id").references(() => vpnServers.id),
  downloadSpeed: real("download_speed").notNull(), // Mbps
  uploadSpeed: real("upload_speed").notNull(), // Mbps
  ping: real("ping").notNull(), // ms
  jitter: real("jitter"),
  testDate: timestamp("test_date").defaultNow()
});

export const securityChecks = pgTable("security_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dnsLeakStatus: text("dns_leak_status").notNull().default("protected"),
  ipLeakStatus: text("ip_leak_status").notNull().default("protected"),
  webrtcStatus: text("webrtc_status").notNull().default("blocked"),
  realIp: text("real_ip"),
  vpnIp: text("vpn_ip"),
  dnsServers: jsonb("dns_servers"),
  checkedAt: timestamp("checked_at").defaultNow()
});

export const insertVpnServerSchema = createInsertSchema(vpnServers).omit({
  id: true,
  lastChecked: true
});

export const insertConnectionHistorySchema = createInsertSchema(connectionHistory).omit({
  id: true
});

export const insertSpeedTestResultSchema = createInsertSchema(speedTestResults).omit({
  id: true,
  testDate: true
});

export const insertSecurityCheckSchema = createInsertSchema(securityChecks).omit({
  id: true,
  checkedAt: true
});

export type VpnServer = typeof vpnServers.$inferSelect;
export type InsertVpnServer = z.infer<typeof insertVpnServerSchema>;
export type ConnectionHistory = typeof connectionHistory.$inferSelect;
export type InsertConnectionHistory = z.infer<typeof insertConnectionHistorySchema>;
export type SpeedTestResult = typeof speedTestResults.$inferSelect;
export type InsertSpeedTestResult = z.infer<typeof insertSpeedTestResultSchema>;
export type SecurityCheck = typeof securityChecks.$inferSelect;
export type InsertSecurityCheck = z.infer<typeof insertSecurityCheckSchema>;

// Network info types for real-time data
export interface NetworkInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  org: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface SpeedTestProgress {
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  progress: number;
  downloadSpeed?: number;
  uploadSpeed?: number;
  ping?: number;
}
