/**
 * Debug Logger Service
 * Single Responsibility: Manage debug logging and display
 */
export declare class DebugLogger {
    private debugLogs;
    private maxLogs;
    /**
     * Log an information message
     * @param message The message to log
     */
    logInfo(message: string): void;
    /**
     * Log a warning message
     * @param message The message to log
     */
    logWarning(message: string): void;
    /**
     * Log an error message
     * @param message The message to log
     */
    logError(message: string): void;
    /**
     * Get all debug logs
     * @returns Array of debug log messages
     */
    getLogs(): string[];
    /**
     * Clear all debug logs
     */
    clearLogs(): void;
    /**
     * Add a log entry
     * @param log The log message to add
     */
    private addLog;
    /**
     * Get formatted logs for display
     * @returns Formatted string of all logs
     */
    getFormattedLogs(): string;
}
