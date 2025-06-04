import type { Request, Response } from "express";
import { storage } from "./storage";

interface HealthCheck {
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTime: number;
  details?: string;
}

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: HealthCheck[];
  version: string;
  uptime: number;
}

export async function healthCheckHandler(req: Request, res: Response) {
  const startTime = Date.now();
  const checks: HealthCheck[] = [];

  // Database connectivity check
  try {
    const dbStart = Date.now();
    await storage.getStoreSettings();
    checks.push({
      service: "database",
      status: "healthy",
      responseTime: Date.now() - dbStart
    });
  } catch (error) {
    checks.push({
      service: "database",
      status: "unhealthy",
      responseTime: Date.now() - startTime,
      details: error instanceof Error ? error.message : "Database connection failed"
    });
  }

  // API endpoints check
  const apiStart = Date.now();
  try {
    await storage.getProductCategories();
    checks.push({
      service: "api",
      status: "healthy",
      responseTime: Date.now() - apiStart
    });
  } catch (error) {
    checks.push({
      service: "api",
      status: "unhealthy",
      responseTime: Date.now() - apiStart,
      details: "API endpoints failing"
    });
  }

  // Memory usage check
  const memUsage = process.memoryUsage();
  const memoryStatus = memUsage.heapUsed / memUsage.heapTotal > 0.9 ? "degraded" : "healthy";
  checks.push({
    service: "memory",
    status: memoryStatus,
    responseTime: 0,
    details: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB used`
  });

  // Determine overall status
  const hasUnhealthy = checks.some(check => check.status === "unhealthy");
  const hasDegraded = checks.some(check => check.status === "degraded");
  
  let overallStatus: "healthy" | "degraded" | "unhealthy";
  if (hasUnhealthy) {
    overallStatus = "unhealthy";
  } else if (hasDegraded) {
    overallStatus = "degraded";
  } else {
    overallStatus = "healthy";
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.TEMPLATE_VERSION || "development",
    uptime: process.uptime()
  };

  const statusCode = overallStatus === "healthy" ? 200 : 
                    overallStatus === "degraded" ? 200 : 503;

  res.status(statusCode).json(response);
}

export function quickHealthCheck(req: Request, res: Response) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}