/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// Simple client-side logger for the study functionality
export enum ClientLogContext {
  AUTH = "auth",
  USER_FORM_SUBMISSION = "user_form_submission",
  USER_LOGIN = "user_login",
  USER_SIGNUP = "user_signup",
  SYSTEM = "system"
}

export const Logger = {
  /**
   * Log a general message.
   * @param context The log context (e.g., 'flashcard', 'study').
   * @param message The log message.
   * @param metadata Additional data to log.
   */
  log(context: ClientLogContext, message: string, metadata: any = {}) {
    console.log(`[${context.toUpperCase()}] ${message}`, metadata);
    // Future: add sending logs to server via a fetch call
  },

  /**
   * Log a debug message.
   * @param context The log context.
   * @param message The log message.
   * @param metadata Additional data to log.
   */
  debug(context: ClientLogContext, message: string, metadata: any = {}) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${context.toUpperCase()}] DEBUG: ${message}`, metadata);
    }
  },

  /**
   * Log an informational message.
   * @param context The log context.
   * @param message The log message.
   * @param metadata Additional data to log.
   */
  info(context: ClientLogContext, message: string, metadata: any = {}) {
    console.info(`[${context.toUpperCase()}] INFO: ${message}`, metadata);
  },

  /**
   * Log a warning message.
   * @param context The log context.
   * @param message The log message.
   * @param metadata Additional data to log.
   */
  warn(context: ClientLogContext, message: string, metadata: any = {}) {
    console.warn(`[${context.toUpperCase()}] WARNING: ${message}`, metadata);
  },
  
  /**
   * Log an error message.
   * @param context The log context.
   * @param message The log message.
   * @param metadata Additional data to log.
   */
  error(context: ClientLogContext, message: string, metadata: any = {}) {
    console.error(`[${context.toUpperCase()}] ERROR: ${message}`, metadata);
    // Future: add sending error logs to server when API route exists
  }
};

// Export as default for compatibility
export default Logger;