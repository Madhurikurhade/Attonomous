import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { Server } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distPath = path.join(__dirname, 'dist');

// Health check endpoints for Cloud Run, GCP load balancers, and internal probes
app.get(['/healthz', '/health', '/_ah/health'], (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Serve static assets from dist
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SPA fallback for all client-side routes
app.get('*', (_req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<!doctype html><html><head><title>Loading...</title></head><body>App is loading, please refresh.</body></html>');
  }
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Internal error:', err);
  res.status(500).send('Internal Server Error');
});

// In AI Studio / Cloud Run container:
// NGINX fronts external traffic on NGINX_PORT (typically 8080) and proxies requests
// to DEFAULT_APP_PORT (typically 3000).
// In standalone Cloud Run (without NGINX), traffic routes directly to PORT (typically 8080).
// We intelligently try the appropriate port first and safely fallback without crashing.
const hasNginxFront = Boolean(process.env.NGINX_PORT || process.env.DEFAULT_APP_PORT);
const primaryPort = hasNginxFront
  ? parseInt(process.env.DEFAULT_APP_PORT || '3000', 10)
  : parseInt(process.env.PORT || '3000', 10);
const fallbackPort = hasNginxFront
  ? parseInt(process.env.PORT || '8080', 10)
  : 3000;

function registerGracefulShutdown(server: Server) {
  const shutdown = (signal: string) => {
    console.log(`[Server] ${signal} received, shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] Server closed successfully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

function startServer(targetPort: number, altPort?: number) {
  const server = app.listen(targetPort, '0.0.0.0', () => {
    console.log(`[Server] Running successfully on http://0.0.0.0:${targetPort}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${targetPort} is already in use.`);
      if (altPort && altPort !== targetPort) {
        console.log(`[Server] Attempting fallback to port ${altPort}...`);
        startServer(altPort);
      } else {
        console.warn(`[Server] Could not bind to port ${targetPort}; keeping process active for health checks.`);
      }
    } else {
      console.error('[Server] Fatal listen error:', err);
    }
  });

  registerGracefulShutdown(server);
}

startServer(primaryPort, fallbackPort);
