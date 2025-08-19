/*
 *  Power BI Date Slicer Visual
 *  
 *  UI Manager Implementation
 *  Single Responsibility: Handle all UI operations and rendering
 *  
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

import { IDateRange, DateRangeType } from "../settings";
import { IUIManager } from "../interfaces/IUIManager";
import { DateRangeCalculator } from "../services/DateRangeCalculator";
import { DebugLogger } from "../services/DebugLogger";

/**
 * Implementation of UI management service
 * Single Responsibility: Manage UI components and interactions
 * Open/Closed Principle: Open for extension (new UI components), closed for modification
 */
export class UIManager implements IUIManager {
    private container: HTMLElement;
    private dateRangeCalculator: DateRangeCalculator;
    private debugLogger: DebugLogger;
    
    // UI Elements
    private dateRangeDisplay: HTMLElement | null = null;
    private debugPanel: HTMLElement | null = null;
    private rangeSelector: HTMLSelectElement | null = null;
    private customStartDate: HTMLInputElement | null = null;
    private customEndDate: HTMLInputElement | null = null;
    private customDateContainer: HTMLElement | null = null;
    private applyButton: HTMLButtonElement | null = null;
    private clearButton: HTMLButtonElement | null = null;

    // Event handlers
    private onApplyFilter: ((dateRange: IDateRange) => void) | null = null;
    private onClearFilter: (() => void) | null = null;

    constructor(
        container: HTMLElement,
        dateRangeCalculator: DateRangeCalculator,
        debugLogger: DebugLogger
    ) {
        this.container = container;
        this.dateRangeCalculator = dateRangeCalculator;
        this.debugLogger = debugLogger;
    }

    /**
     * Create the main UI structure
     */
    public createUI(): void {
        try {
            // Clear existing content
            this.container.innerHTML = '';
            this.container.className = 'date-slicer-container';

            // Create main layout
            this.createDateRangeDisplay();
            this.createRangeSelector();
            this.createCustomDateInputs();
            this.createActionButtons();
            this.createDebugPanel();

            this.debugLogger.logInfo("UI created successfully");
        } catch (error) {
            this.debugLogger.logError(`Failed to create UI: ${error}`);
        }
    }

    /**
     * Update the date range display
     * @param dateRange Current date range to display
     */
    public updateDateRangeDisplay(dateRange: IDateRange): void {
        try {
            if (!this.dateRangeDisplay) return;

            const startDateStr = this.dateRangeCalculator.formatDate(dateRange.startDate);
            const endDateStr = this.dateRangeCalculator.formatDate(dateRange.endDate);
            const rangeTypeStr = this.dateRangeCalculator.getRangeTypeDisplayText(dateRange.type);

            this.dateRangeDisplay.innerHTML = `
                <div class="range-info">
                    <span class="range-type">${rangeTypeStr}</span>
                    <span class="date-range">${startDateStr} - ${endDateStr}</span>
                </div>
            `;

            this.debugLogger.logInfo(`Updated date range display: ${startDateStr} to ${endDateStr}`);
        } catch (error) {
            this.debugLogger.logError(`Failed to update date range display: ${error}`);
        }
    }

    /**
     * Show/hide debug information
     * @param show Whether to show debug info
     * @param debugInfo Debug information to display (optional)
     */
    public toggleDebugInfo(show: boolean, debugInfo?: string[]): void {
        try {
            if (!this.debugPanel) return;

            if (show) {
                this.debugPanel.style.display = 'block';
                const logs = debugInfo || this.debugLogger.getLogs();
                this.debugPanel.innerHTML = `
                    <div class="debug-header">Debug Information</div>
                    <div class="debug-content">
                        ${logs.map(log => `<div class="debug-line">${log}</div>`).join('')}
                    </div>
                `;
            } else {
                this.debugPanel.style.display = 'none';
            }
        } catch (error) {
            this.debugLogger.logError(`Failed to toggle debug info: ${error}`);
        }
    }

    /**
     * Set up event handlers for UI components
     */
    public setupEventHandlers(): void {
        try {
            // Range selector change handler
            if (this.rangeSelector) {
                this.rangeSelector.addEventListener('change', () => {
                    this.handleRangeSelectionChange();
                });
            }

            // Apply button handler
            if (this.applyButton) {
                this.applyButton.addEventListener('click', () => {
                    this.handleApplyFilter();
                });
            }

            // Clear button handler
            if (this.clearButton) {
                this.clearButton.addEventListener('click', () => {
                    this.handleClearFilter();
                });
            }

            // Custom date change handlers
            if (this.customStartDate) {
                this.customStartDate.addEventListener('change', () => {
                    this.validateCustomDates();
                });
            }

            if (this.customEndDate) {
                this.customEndDate.addEventListener('change', () => {
                    this.validateCustomDates();
                });
            }

            this.debugLogger.logInfo("Event handlers set up successfully");
        } catch (error) {
            this.debugLogger.logError(`Failed to setup event handlers: ${error}`);
        }
    }

    /**
     * Apply visual styling based on settings
     * @param primaryColor Primary color for styling
     * @param secondaryColor Secondary color for styling
     * @param fontSize Font size for text
     */
    public applyStyles(primaryColor: string, secondaryColor: string, fontSize: number): void {
        try {
            const style = document.createElement('style');
            style.textContent = `
                .date-slicer-container {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: ${fontSize}px;
                    padding: 10px;
                    background: #ffffff;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .date-range-display {
                    background: ${primaryColor};
                    color: white;
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    text-align: center;
                }

                .range-type {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .date-range {
                    display: block;
                    font-size: 0.9em;
                    opacity: 0.9;
                }

                .controls-section {
                    margin-bottom: 15px;
                }

                .control-group {
                    margin-bottom: 10px;
                }

                .control-label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #333;
                }

                .range-selector, .custom-date-input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: ${fontSize}px;
                }

                .custom-dates-container {
                    display: none;
                    margin-top: 10px;
                }

                .custom-dates-container.show {
                    display: block;
                }

                .custom-date-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .custom-date-group {
                    flex: 1;
                }

                .action-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    font-size: ${fontSize}px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .btn-primary {
                    background: ${primaryColor};
                    color: white;
                }

                .btn-primary:hover {
                    background: ${secondaryColor};
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .debug-panel {
                    margin-top: 15px;
                    padding: 10px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                }

                .debug-header {
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #495057;
                }

                .debug-content {
                    font-family: 'Courier New', monospace;
                    font-size: 11px;
                }

                .debug-line {
                    margin-bottom: 2px;
                    padding: 2px;
                }

                .debug-line:nth-child(even) {
                    background: rgba(0,0,0,0.05);
                }
            `;

            // Remove existing style if any
            const existingStyle = document.getElementById('date-slicer-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            style.id = 'date-slicer-styles';
            document.head.appendChild(style);

            this.debugLogger.logInfo("Styles applied successfully");
        } catch (error) {
            this.debugLogger.logError(`Failed to apply styles: ${error}`);
        }
    }

    /**
     * Set event handler for apply filter action
     * @param handler The event handler function
     */
    public setOnApplyFilter(handler: (dateRange: IDateRange) => void): void {
        this.onApplyFilter = handler;
    }

    /**
     * Set event handler for clear filter action
     * @param handler The event handler function
     */
    public setOnClearFilter(handler: () => void): void {
        this.onClearFilter = handler;
    }

    /**
     * Set the selected range type
     * @param rangeType The range type to select
     */
    public setSelectedRangeType(rangeType: DateRangeType): void {
        if (this.rangeSelector) {
            this.rangeSelector.value = rangeType;
            this.handleRangeSelectionChange();
        }
    }

    // Private UI creation methods
    private createDateRangeDisplay(): void {
        this.dateRangeDisplay = document.createElement('div');
        this.dateRangeDisplay.className = 'date-range-display';
        this.container.appendChild(this.dateRangeDisplay);
    }

    private createRangeSelector(): void {
        const controlsSection = document.createElement('div');
        controlsSection.className = 'controls-section';

        const controlGroup = document.createElement('div');
        controlGroup.className = 'control-group';

        const label = document.createElement('label');
        label.className = 'control-label';
        label.textContent = 'Select Date Range:';

        this.rangeSelector = document.createElement('select');
        this.rangeSelector.className = 'range-selector';
        
        // Add options
        this.rangeSelector.innerHTML = `
            <option value="${DateRangeType.Last7Days}">Last 7 Days</option>
            <option value="${DateRangeType.Last30Days}">Last 30 Days</option>
            <option value="${DateRangeType.Last90Days}">Last 90 Days</option>
            <option value="${DateRangeType.Custom}">Custom Range</option>
        `;

        controlGroup.appendChild(label);
        controlGroup.appendChild(this.rangeSelector);
        controlsSection.appendChild(controlGroup);
        this.container.appendChild(controlsSection);
    }

    private createCustomDateInputs(): void {
        this.customDateContainer = document.createElement('div');
        this.customDateContainer.className = 'custom-dates-container';

        const customDateRow = document.createElement('div');
        customDateRow.className = 'custom-date-row';

        // Start date
        const startDateGroup = document.createElement('div');
        startDateGroup.className = 'custom-date-group';
        
        const startLabel = document.createElement('label');
        startLabel.className = 'control-label';
        startLabel.textContent = 'Start Date:';
        
        this.customStartDate = document.createElement('input');
        this.customStartDate.type = 'date';
        this.customStartDate.className = 'custom-date-input';
        
        startDateGroup.appendChild(startLabel);
        startDateGroup.appendChild(this.customStartDate);

        // End date
        const endDateGroup = document.createElement('div');
        endDateGroup.className = 'custom-date-group';
        
        const endLabel = document.createElement('label');
        endLabel.className = 'control-label';
        endLabel.textContent = 'End Date:';
        
        this.customEndDate = document.createElement('input');
        this.customEndDate.type = 'date';
        this.customEndDate.className = 'custom-date-input';
        
        endDateGroup.appendChild(endLabel);
        endDateGroup.appendChild(this.customEndDate);

        customDateRow.appendChild(startDateGroup);
        customDateRow.appendChild(endDateGroup);
        this.customDateContainer.appendChild(customDateRow);
        this.container.appendChild(this.customDateContainer);
    }

    private createActionButtons(): void {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';

        this.applyButton = document.createElement('button');
        this.applyButton.className = 'btn btn-primary';
        this.applyButton.textContent = 'Apply Filter';

        this.clearButton = document.createElement('button');
        this.clearButton.className = 'btn btn-secondary';
        this.clearButton.textContent = 'Clear Filter';

        buttonContainer.appendChild(this.applyButton);
        buttonContainer.appendChild(this.clearButton);
        this.container.appendChild(buttonContainer);
    }

    private createDebugPanel(): void {
        this.debugPanel = document.createElement('div');
        this.debugPanel.className = 'debug-panel';
        this.debugPanel.style.display = 'none';
        this.container.appendChild(this.debugPanel);
    }

    // Event handlers
    private handleRangeSelectionChange(): void {
        if (!this.rangeSelector || !this.customDateContainer) return;

        const selectedRange = this.rangeSelector.value as DateRangeType;
        
        if (selectedRange === DateRangeType.Custom) {
            this.customDateContainer.classList.add('show');
            this.debugLogger.logInfo("Switched to custom date range mode");
        } else {
            this.customDateContainer.classList.remove('show');
            this.debugLogger.logInfo(`Switched to predefined range: ${selectedRange}`);
        }
    }

    private handleApplyFilter(): void {
        try {
            if (!this.rangeSelector) return;

            const selectedRange = this.rangeSelector.value as DateRangeType;
            let dateRange: IDateRange;

            if (selectedRange === DateRangeType.Custom) {
                if (!this.customStartDate?.value || !this.customEndDate?.value) {
                    this.debugLogger.logWarning("Custom dates not provided");
                    return;
                }

                const startDate = new Date(this.customStartDate.value);
                const endDate = new Date(this.customEndDate.value);
                dateRange = this.dateRangeCalculator.createCustomRange(startDate, endDate);
            } else {
                dateRange = this.dateRangeCalculator.calculateDateRange(selectedRange);
            }

            if (!this.dateRangeCalculator.isValidDateRange(dateRange)) {
                this.debugLogger.logError("Invalid date range selected");
                return;
            }

            if (this.onApplyFilter) {
                this.onApplyFilter(dateRange);
            }

            this.debugLogger.logInfo("Apply filter action triggered");
        } catch (error) {
            this.debugLogger.logError(`Failed to apply filter: ${error}`);
        }
    }

    private handleClearFilter(): void {
        try {
            if (this.onClearFilter) {
                this.onClearFilter();
            }
            this.debugLogger.logInfo("Clear filter action triggered");
        } catch (error) {
            this.debugLogger.logError(`Failed to clear filter: ${error}`);
        }
    }

    private validateCustomDates(): void {
        if (!this.customStartDate?.value || !this.customEndDate?.value || !this.applyButton) return;

        const startDate = new Date(this.customStartDate.value);
        const endDate = new Date(this.customEndDate.value);

        if (startDate > endDate) {
            this.applyButton.disabled = true;
            this.debugLogger.logWarning("Invalid custom date range: start date is after end date");
        } else {
            this.applyButton.disabled = false;
            this.debugLogger.logInfo("Custom date range validated successfully");
        }
    }
}
