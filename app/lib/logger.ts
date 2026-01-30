/**
 * Structured Logger
 * 
 * Why: console.log is insufficient for production debugging. This provides:
 * - Structured JSON output for machine parsing in production
 * - Pretty console output in development
 * - Log levels for filtering
 * - Child loggers for component-specific context
 * - NO WORKER THREADS to avoid Next.js issues
 * 
 * What: Centralized logging utility used throughout the application
 */

/**
 * Environment-based log level
 * 
 * Why: Different verbosity for development vs production
 * - Development: 'debug' shows all logs including verbose details
 * - Production: 'info' reduces noise, focuses on important events
 */
const _logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const isDev = process.env.NODE_ENV !== 'production';

interface LogData {
  [key: string]: unknown;
}

interface Logger {
  trace(msg: string): void;
  trace(data: LogData, msg: string): void;
  trace(msg: string, data: LogData): void;
  debug(msg: string): void;
  debug(data: LogData, msg: string): void;
  debug(msg: string, data: LogData): void;
  info(msg: string): void;
  info(data: LogData, msg: string): void;
  info(msg: string, data: LogData): void;
  warn(msg: string): void;
  warn(data: LogData, msg: string): void;
  warn(msg: string, data: LogData): void;
  error(msg: string | unknown): void;
  error(data: LogData, msg: string): void;
  error(msg: string, data: LogData): void;
  fatal(msg: string): void;
  fatal(data: LogData, msg: string): void;
  fatal(msg: string, data: LogData): void;
  child(context: Record<string, unknown>): Logger;
}

function createSimpleLogger(context: Record<string, unknown> = {}): Logger {
  const formatMessage = (level: string, msg: string, data?: LogData) => {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return isDev
      ? `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${msg}${dataStr}`
      : JSON.stringify({ time: timestamp, level, ...context, ...data, msg });
  };

  const log = (level: string, ...args: unknown[]) => {
    const [first, second] = args;
    const msg: string = typeof first === 'string' ? first : (typeof second === 'string' ? second : '');
    const data = typeof first === 'object' && first !== null ? (first as LogData) : undefined;
    
    const formatted = formatMessage(level, msg, data);
    
    switch (level) {
      case 'trace':
      case 'debug':
        if (isDev) console.log(formatted);
        break;
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
      case 'fatal':
        console.error(formatted);
        break;
    }
  };

  return {
    trace: (...args: unknown[]) => log('trace', ...args),
    debug: (...args: unknown[]) => log('debug', ...args),
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
    fatal: (...args: unknown[]) => log('fatal', ...args),
    child: (childContext: Record<string, unknown>) => 
      createSimpleLogger({ ...context, ...childContext }),
  } as Logger;
}

/**
 * Main logger instance
 * 
 * What: Configured logger with appropriate formatting and level
 * Why: Single logger instance shared across application
 * Note: Uses simple console-based logging to avoid worker thread issues
 */
export const logger = createSimpleLogger();

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
export function createLogger(context: Record<string, unknown>): Logger {
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
