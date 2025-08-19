import { IDateRange, DateRangeType } from "../settings";
import { IUIManager } from "../interfaces/IUIManager";
import { DateRangeCalculator } from "../services/DateRangeCalculator";
import { DebugLogger } from "../services/DebugLogger";
/**
 * Implementation of UI management service
 * Single Responsibility: Manage UI components and interactions
 * Open/Closed Principle: Open for extension (new UI components), closed for modification
 */
export declare class UIManager implements IUIManager {
    private container;
    private dateRangeCalculator;
    private debugLogger;
    private dateRangeDisplay;
    private debugPanel;
    private rangeSelector;
    private customStartDate;
    private customEndDate;
    private customDateContainer;
    private applyButton;
    private clearButton;
    private onApplyFilter;
    private onClearFilter;
    constructor(container: HTMLElement, dateRangeCalculator: DateRangeCalculator, debugLogger: DebugLogger);
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
     * @param debugInfo Debug information to display (optional)
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
    /**
     * Set event handler for apply filter action
     * @param handler The event handler function
     */
    setOnApplyFilter(handler: (dateRange: IDateRange) => void): void;
    /**
     * Set event handler for clear filter action
     * @param handler The event handler function
     */
    setOnClearFilter(handler: () => void): void;
    /**
     * Set the selected range type
     * @param rangeType The range type to select
     */
    setSelectedRangeType(rangeType: DateRangeType): void;
    private createDateRangeDisplay;
    private createRangeSelector;
    private createCustomDateInputs;
    private createActionButtons;
    private createDebugPanel;
    private handleRangeSelectionChange;
    private handleApplyFilter;
    private handleClearFilter;
    private validateCustomDates;
}
