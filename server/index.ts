// server/index.ts
import express from "express";
import cors from "cors";
import router from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";

const app = express();
app.set("env", process.env.NODE_ENV || "development");
app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// tiny API logger
app.use((req, res, next) => {
  const t = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const ms = Date.now() - t;
      console.log(`${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
    }
  });
  next();
});

// routes
app.use("/api", router);

// error handler (keep last)
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: err.message || "Server error" });
});

const PORT = Number(process.env.PORT || 5000);
const server = createServer(app);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    // Serve static files in production
    serveStatic(app);
  }

  server.listen(PORT, "0.0.0.0", () =>
    console.log(`SmartFlow API listening on ${PORT}`)
  );
}

startServer().catch(console.error);
export default app;
