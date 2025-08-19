/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel, DateRangeType, IDateRange } from "./settings";

// Service imports
import { DateRangeCalculator } from "./services/DateRangeCalculator";
import { FilterManager } from "./services/FilterManager";
import { UIManager } from "./services/UIManager";
import { DebugLogger } from "./services/DebugLogger";

/**
 * Power BI Date Slicer Visual
 * Single Responsibility: Orchestrate the date slicer functionality
 * Dependency Inversion: Depends on abstractions (interfaces) for services
 * Open/Closed Principle: Open for extension (new services), closed for modification
 */
export class Visual implements IVisual {
    private target: HTMLElement;
    private host: powerbi.extensibility.visual.IVisualHost;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    // Services (Dependency Injection)
    private dateRangeCalculator: DateRangeCalculator;
    private filterManager: FilterManager;
    private uiManager: UIManager;
    private debugLogger: DebugLogger;

    // Current state
    private currentDateRange: IDateRange | null = null;
    private isInitialized: boolean = false;

    constructor(options: VisualConstructorOptions) {
        try {
            console.log('Date Slicer Visual constructor', options);
            
            // Initialize core properties
            this.target = options.element;
            this.host = options.host;
            this.formattingSettingsService = new FormattingSettingsService();

            // Initialize services (Dependency Injection)
            this.debugLogger = new DebugLogger();
            this.dateRangeCalculator = new DateRangeCalculator();
            this.filterManager = new FilterManager();
            this.uiManager = new UIManager(this.target, this.dateRangeCalculator, this.debugLogger);

            // Set up UI event handlers
            this.setupUIEventHandlers();

            this.debugLogger.logInfo("Date Slicer Visual initialized successfully");
        } catch (error) {
            console.error("Error initializing Date Slicer Visual:", error);
        }
    }

    /**
     * Update the visual with new data and settings
     * @param options Update options containing data views and settings
     */
    public update(options: VisualUpdateOptions) {
        try {
            this.debugLogger.logInfo("Visual update started");

            // Update formatting settings
            this.updateFormattingSettings(options);

            // Check for date column availability
            this.checkDateColumnAvailability(options);

            // Initialize UI if not already done
            if (!this.isInitialized) {
                this.initializeUI();
                this.isInitialized = true;
            }

            // Apply current settings to UI
            this.applySettings();

            // Set default date range if none is set
            if (!this.currentDateRange) {
                this.setDefaultDateRange();
            }

            this.debugLogger.logInfo("Visual update completed successfully");
        } catch (error) {
            this.debugLogger.logError(`Error during visual update: ${error}`);
            console.error('Visual update error:', error);
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values
     * This method is called once every time we open properties pane or when the user edit any format property
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    /**
     * Update formatting settings from options
     * @param options Visual update options
     */
    private updateFormattingSettings(options: VisualUpdateOptions): void {
        try {
            if (options.dataViews && options.dataViews[0]) {
                this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                    VisualFormattingSettingsModel, 
                    options.dataViews[0]
                );
            } else {
                // Use default settings if no data view
                this.formattingSettings = new VisualFormattingSettingsModel();
            }

            this.debugLogger.logInfo("Formatting settings updated");
        } catch (error) {
            this.debugLogger.logError(`Error updating formatting settings: ${error}`);
        }
    }

    /**
     * Check if date column is available for filtering
     * @param options Visual update options
     */
    private checkDateColumnAvailability(options: VisualUpdateOptions): void {
        try {
            if (options.dataViews && options.dataViews[0]) {
                const hasDateColumn = this.filterManager.hasDateColumn(options.dataViews[0]);
                
                if (hasDateColumn) {
                    this.debugLogger.logInfo("Date column found and configured for filtering");
                } else {
                    this.debugLogger.logWarning("No date column found in data view - filtering may not work");
                }
            }
        } catch (error) {
            this.debugLogger.logError(`Error checking date column availability: ${error}`);
        }
    }

    /**
     * Initialize the UI components
     */
    private initializeUI(): void {
        try {
            this.uiManager.createUI();
            this.uiManager.setupEventHandlers();
            
            this.debugLogger.logInfo("UI initialized successfully");
        } catch (error) {
            this.debugLogger.logError(`Error initializing UI: ${error}`);
        }
    }

    /**
     * Apply current settings to the UI
     */
    private applySettings(): void {
        try {
            if (!this.formattingSettings) return;

            const settings = this.formattingSettings.dateSlicerSettings;
            
            // Apply visual styles
            this.uiManager.applyStyles(
                settings.primaryColor.value.value,
                settings.secondaryColor.value.value,
                settings.fontSize.value
            );

            // Toggle debug information
            this.uiManager.toggleDebugInfo(settings.debugMode.value);

            this.debugLogger.logInfo("Settings applied to UI");
        } catch (error) {
            this.debugLogger.logError(`Error applying settings: ${error}`);
        }
    }

    /**
     * Set the default date range based on settings
     */
    private setDefaultDateRange(): void {
        try {
            if (!this.formattingSettings) return;

            const defaultRangeType = this.formattingSettings.dateSlicerSettings.defaultRange.value.value as DateRangeType;
            const dateRange = this.dateRangeCalculator.calculateDateRange(defaultRangeType);
            
            this.currentDateRange = dateRange;
            this.uiManager.updateDateRangeDisplay(dateRange);
            this.uiManager.setSelectedRangeType(defaultRangeType);

            this.debugLogger.logInfo(`Default date range set: ${defaultRangeType}`);
        } catch (error) {
            this.debugLogger.logError(`Error setting default date range: ${error}`);
        }
    }

    /**
     * Set up UI event handlers
     */
    private setupUIEventHandlers(): void {
        try {
            // Handle apply filter action
            this.uiManager.setOnApplyFilter((dateRange: IDateRange) => {
                this.handleApplyFilter(dateRange);
            });

            // Handle clear filter action
            this.uiManager.setOnClearFilter(() => {
                this.handleClearFilter();
            });

            this.debugLogger.logInfo("UI event handlers configured");
        } catch (error) {
            this.debugLogger.logError(`Error setting up UI event handlers: ${error}`);
        }
    }

    /**
     * Handle apply filter action from UI
     * @param dateRange The date range to apply as filter
     */
    private handleApplyFilter(dateRange: IDateRange): void {
        try {
            if (!this.dateRangeCalculator.isValidDateRange(dateRange)) {
                this.debugLogger.logError("Invalid date range provided for filter application");
                return;
            }

            // Update current date range
            this.currentDateRange = dateRange;

            // Update UI display
            this.uiManager.updateDateRangeDisplay(dateRange);

            // Apply filter to Power BI
            this.filterManager.applyDateFilter(dateRange, this.host);

            this.debugLogger.logInfo(
                `Filter applied: ${this.dateRangeCalculator.formatDate(dateRange.startDate)} to ${this.dateRangeCalculator.formatDate(dateRange.endDate)}`
            );
        } catch (error) {
            this.debugLogger.logError(`Error applying filter: ${error}`);
        }
    }

    /**
     * Handle clear filter action from UI
     */
    private handleClearFilter(): void {
        try {
            // Clear filters in Power BI
            this.filterManager.clearFilters(this.host);

            // Reset to default date range
            this.setDefaultDateRange();

            this.debugLogger.logInfo("Filters cleared and reset to default");
        } catch (error) {
            this.debugLogger.logError(`Error clearing filters: ${error}`);
        }
    }

    /**
     * Get current date range (for external access if needed)
     * @returns Current date range or null if not set
     */
    public getCurrentDateRange(): IDateRange | null {
        return this.currentDateRange;
    }

    /**
     * Programmatically set date range (for external control if needed)
     * @param dateRange The date range to set
     */
    public setDateRange(dateRange: IDateRange): void {
        try {
            if (this.dateRangeCalculator.isValidDateRange(dateRange)) {
                this.handleApplyFilter(dateRange);
            } else {
                this.debugLogger.logError("Invalid date range provided for programmatic setting");
            }
        } catch (error) {
            this.debugLogger.logError(`Error setting date range programmatically: ${error}`);
        }
    }
}