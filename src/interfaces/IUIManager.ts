/*
 *  Power BI Date Slicer Visual
 *  
 *  Interface for UI component management
 *  
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

import { IDateRange } from "../settings";

/**
 * Interface for UI component management
 * Single Responsibility: Define contract for UI operations
 */
export interface IUIManager {
    /**
     * Create the main UI structure
     */
    createUI(): void;

    /**
     * Update the date range display
     * @param dateRange Current date range to display
     */
    updateDateRangeDisplay(dateRange: IDateRange): void;

    /**
     * Show/hide debug information
     * @param show Whether to show debug info
     * @param debugInfo Debug information to display
     */
    toggleDebugInfo(show: boolean, debugInfo?: string[]): void;

    /**
     * Set up event handlers for UI components
     */
    setupEventHandlers(): void;

    /**
     * Apply visual styling based on settings
     * @param primaryColor Primary color for styling
     * @param secondaryColor Secondary color for styling
     * @param fontSize Font size for text
     */
    applyStyles(primaryColor: string, secondaryColor: string, fontSize: number): void;
}
