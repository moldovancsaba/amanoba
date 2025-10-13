/**
 * Structured Logger using Pino
 * 
 * Why: console.log is insufficient for production debugging. Pino provides:
 * - Structured JSON output for machine parsing
 * - High performance (async logging)
 * - Log levels for filtering
 * - Child loggers for component-specific context
 * 
 * What: Centralized logging utility used throughout the application
 */

import pino from 'pino';

/**
 * Environment-based log level
 * 
 * Why: Different verbosity for development vs production
 * - Development: 'debug' shows all logs including verbose details
 * - Production: 'info' reduces noise, focuses on important events
 */
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

/**
 * Pino logger instance
 * 
 * What: Configured logger with appropriate formatting and level
 * Why: Single logger instance shared across application
 */
export const logger = pino({
  level: logLevel,
  
  // Transport configuration for pretty printing in development
  // Why: JSON logs are hard to read during development
  // Note: Using sync mode to avoid worker thread issues in Next.js dev
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z', // Human-readable timestamps
            ignore: 'pid,hostname', // Hide unnecessary fields in dev
            singleLine: false,
            sync: true, // Prevent worker thread issues
          },
        }
      : undefined,

  // Base fields added to every log
  // Why: Consistent metadata for correlation and filtering
  base: {
    env: process.env.NODE_ENV || 'development',
  },

  // Timestamp format
  // Why: ISO 8601 with milliseconds per project standards
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Serializers for common objects
  // Why: Format standard objects consistently
  serializers: {
    err: pino.stdSerializers.err, // Format errors with stack traces
    req: pino.stdSerializers.req, // Format HTTP requests
    res: pino.stdSerializers.res, // Format HTTP responses
  },
});

/**
 * Create child logger with additional context
 * 
 * What: Returns new logger instance with bound context fields
 * Why: Helps trace logs back to specific components or operations
 * 
 * @param context - Object with fields to add to all child logs
 * @returns Child logger instance
 * 
 * @example
 * const gameLogger = createLogger({ component: 'GameSession', gameId: 'quizzz' });
 * gameLogger.info('Game started'); // Includes component and gameId in log
 */
export function createLogger(context: Record<string, any>): pino.Logger {
  return logger.child(context);
}

/**
 * Log levels available
 * 
 * Why: Document available levels for team reference
 * 
 * - trace: Very detailed debugging (rarely used)
 * - debug: Debugging information for development
 * - info: Important informational messages
 * - warn: Warning messages for unexpected but handled situations
 * - error: Error messages for failures
 * - fatal: Fatal errors that cause application to crash
 */

/**
 * Usage examples:
 * 
 * // Basic logging
 * logger.info('Server started on port 3000');
 * logger.error({ error: err }, 'Failed to fetch player data');
 * 
 * // With structured data
 * logger.info({ playerId: '123', score: 850 }, 'Game session completed');
 * 
 * // Child logger for component
 * const dbLogger = createLogger({ component: 'Database' });
 * dbLogger.debug('Query executed');
 * 
 * // HTTP request logging (use in API routes)
 * logger.info({ req }, 'Incoming request');
 * logger.info({ res }, 'Response sent');
 */

export default logger;
