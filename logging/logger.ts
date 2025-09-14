// lib/logging/logger.ts
import { NextRequest } from "next/server";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error"
}

export enum LogContext {
  AUTH = "auth",
  WAITLIST = "waitlist",
  SYSTEM = "system",
  API = "api"
}

interface LogEntry {
  context: LogContext;
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

class SimpleLogger {
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private static getClientIp(request?: NextRequest): string {
    if (!request) return "unknown";
    
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    
    return cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown";
  }

  static async log({
    context,
    level,
    message,
    request,
    metadata = {},
    requestId
  }: {
    context: LogContext;
    level: LogLevel;
    message: string;
    request?: NextRequest;
    metadata?: Record<string, any>;
    requestId?: string;
  }): Promise<string> {
    if (!requestId) {
      requestId = this.generateRequestId();
    }

    const logEntry: LogEntry = {
      context,
      level,
      message,
      timestamp: new Date(),
      metadata,
      requestId,
      ipAddress: request ? this.getClientIp(request) : undefined,
      userAgent: request?.headers.get("user-agent") || undefined
    };

    // Always log to console for now (we can add database logging later)
    this.logToConsole(logEntry);

    // In production, you'd also log to your database here
    // await this.logToDatabase(logEntry);

    return requestId;
  }

  private static logToConsole(logEntry: LogEntry): void {
    const timestamp = logEntry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${logEntry.level.toUpperCase()}] [${logEntry.context}]`;
    
    const logData = {
      message: logEntry.message,
      requestId: logEntry.requestId,
      ...(logEntry.metadata || {}),
      ...(logEntry.ipAddress && { ipAddress: logEntry.ipAddress }),
      ...(logEntry.userAgent && { userAgent: logEntry.userAgent })
    };

    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(`${prefix} ${logEntry.message}`, logData);
        break;
      case LogLevel.WARNING:
        console.warn(`${prefix} ${logEntry.message}`, logData);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${logEntry.message}`, logData);
        break;
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${logEntry.message}`, logData);
        break;
    }
  }

  // Convenience methods
  static async info(context: LogContext, message: string, options: { request?: NextRequest; metadata?: Record<string, any>; requestId?: string } = {}): Promise<string> {
    return this.log({ context, level: LogLevel.INFO, message, ...options });
  }

  static async error(context: LogContext, message: string, options: { request?: NextRequest; metadata?: Record<string, any>; requestId?: string } = {}): Promise<string> {
    return this.log({ context, level: LogLevel.ERROR, message, ...options });
  }

  static async warning(context: LogContext, message: string, options: { request?: NextRequest; metadata?: Record<string, any>; requestId?: string } = {}): Promise<string> {
    return this.log({ context, level: LogLevel.WARNING, message, ...options });
  }

  static async debug(context: LogContext, message: string, options: { request?: NextRequest; metadata?: Record<string, any>; requestId?: string } = {}): Promise<string> {
    return this.log({ context, level: LogLevel.DEBUG, message, ...options });
  }
}

export default SimpleLogger;