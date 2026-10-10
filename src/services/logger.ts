/**
 * Application Logging Service
 * Core Rule: Do not silently skip errors.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: unknown;
}

const memoryLogs: LogEntry[] = [];
const MAX_LOGS = 100;

export const logger = {
  debug(source: string, message: string, details?: unknown) {
    recordLog('debug', source, message, details);
  },

  info(source: string, message: string, details?: unknown) {
    recordLog('info', source, message, details);
    console.info(`[RussiaAI][${source}] ${message}`, details ?? '');
  },

  warn(source: string, message: string, details?: unknown) {
    recordLog('warn', source, message, details);
    console.warn(`[RussiaAI][${source}] ⚠️ ${message}`, details ?? '');
  },

  error(source: string, message: string, error?: unknown) {
    recordLog('error', source, message, error);
    console.error(`[RussiaAI][${source}] ❌ ${message}`, error ?? '');
  },

  getRecentLogs(): readonly LogEntry[] {
    return memoryLogs;
  },

  clearLogs() {
    memoryLogs.length = 0;
  },
};

function recordLog(level: LogLevel, source: string, message: string, details?: unknown) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
    details,
  };
  memoryLogs.push(entry);
  if (memoryLogs.length > MAX_LOGS) {
    memoryLogs.shift();
  }
}
