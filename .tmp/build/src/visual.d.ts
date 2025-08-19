import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { IDateRange } from "./settings";
/**
 * Power BI Date Slicer Visual
 * Single Responsibility: Orchestrate the date slicer functionality
 * Dependency Inversion: Depends on abstractions (interfaces) for services
 * Open/Closed Principle: Open for extension (new services), closed for modification
 */
export declare class Visual implements IVisual {
    private target;
    private host;
    private formattingSettings;
    private formattingSettingsService;
    private dateRangeCalculator;
    private filterManager;
    private uiManager;
    private debugLogger;
    private currentDateRange;
    private isInitialized;
    constructor(options: VisualConstructorOptions);
    /**
     * Update the visual with new data and settings
     * @param options Update options containing data views and settings
     */
    update(options: VisualUpdateOptions): void;
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values
     * This method is called once every time we open properties pane or when the user edit any format property
     */
    getFormattingModel(): powerbi.visuals.FormattingModel;
    /**
     * Update formatting settings from options
     * @param options Visual update options
     */
    private updateFormattingSettings;
    /**
     * Check if date column is available for filtering
     * @param options Visual update options
     */
    private checkDateColumnAvailability;
    /**
     * Initialize the UI components
     */
    private initializeUI;
    /**
     * Apply current settings to the UI
     */
    private applySettings;
    /**
     * Set the default date range based on settings
     */
    private setDefaultDateRange;
    /**
     * Set up UI event handlers
     */
    private setupUIEventHandlers;
    /**
     * Handle apply filter action from UI
     * @param dateRange The date range to apply as filter
     */
    private handleApplyFilter;
    /**
     * Handle clear filter action from UI
     */
    private handleClearFilter;
    /**
     * Get current date range (for external access if needed)
     * @returns Current date range or null if not set
     */
    getCurrentDateRange(): IDateRange | null;
    /**
     * Programmatically set date range (for external control if needed)
     * @param dateRange The date range to set
     */
    setDateRange(dateRange: IDateRange): void;
}
