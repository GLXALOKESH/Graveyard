import { Request, Response, NextFunction } from "express";

/**
 * Request Logger Middleware
 * Logs all incoming HTTP requests with method, URL, timestamp, and IP
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const userAgent = req.get("user-agent") || "unknown";

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  next();
};
