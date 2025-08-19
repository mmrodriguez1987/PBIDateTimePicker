/*
 *  Power BI Date Slicer Visual
 *  
 *  Debug Logger Implementation
 *  Single Responsibility: Handle all debug logging operations
 *  
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

/**
 * Debug Logger Service
 * Single Responsibility: Manage debug logging and display
 */
export class DebugLogger {
    private debugLogs: string[] = [];
    private maxLogs: number = 50;

    /**
     * Log an information message
     * @param message The message to log
     */
    public logInfo(message: string): void {
        this.addLog(`[INFO] ${new Date().toLocaleTimeString()}: ${message}`);
    }

    /**
     * Log a warning message
     * @param message The message to log
     */
    public logWarning(message: string): void {
        this.addLog(`[WARNING] ${new Date().toLocaleTimeString()}: ${message}`);
    }

    /**
     * Log an error message
     * @param message The message to log
     */
    public logError(message: string): void {
        this.addLog(`[ERROR] ${new Date().toLocaleTimeString()}: ${message}`);
    }

    /**
     * Get all debug logs
     * @returns Array of debug log messages
     */
    public getLogs(): string[] {
        return [...this.debugLogs];
    }

    /**
     * Clear all debug logs
     */
    public clearLogs(): void {
        this.debugLogs = [];
    }

    /**
     * Add a log entry
     * @param log The log message to add
     */
    private addLog(log: string): void {
        this.debugLogs.push(log);
        
        // Keep only the most recent logs
        if (this.debugLogs.length > this.maxLogs) {
            this.debugLogs = this.debugLogs.slice(-this.maxLogs);
        }

        // Also log to console for development
        console.log(log);
    }

    /**
     * Get formatted logs for display
     * @returns Formatted string of all logs
     */
    public getFormattedLogs(): string {
        return this.debugLogs.join('\n');
    }
}
