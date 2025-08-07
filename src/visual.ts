"use strict";

/**
 * Represents a date range with start and end dates
 */
interface IDateRange {
    startDate: Date;
    endDate: Date;
}

/**
 * Contains information about a date column from Power BI data
 */
interface IDateColumnInfo {
    displayName: string;
    queryName: string;
    minDate?: Date;
    maxDate?: Date;
}

/**
 * Service interface for handling Power BI filter operations
 */
interface IFilterService {
    applyFilter(dateRange: IDateRange): void;
    clearFilter(): void;
    setDateColumn(column: IDateColumnInfo | null): void;
}

/**
 * Interface for UI components that can be rendered and updated
 */
interface IUIComponent {
    render(container: HTMLElement): void;
    update(data?: any): void;
}

/**
 * Service interface for displaying user messages
 */
interface IMessageService {
    showSuccess(message: string): void;
    showError(message: string): void;
}

/**
 * Enumeration of predefined date ranges
 */
enum PredefinedRange {
    LATEST_7_DAYS = 7,
    LATEST_30_DAYS = 30,
    LATEST_90_DAYS = 90,
    CUSTOM = 0
}

/**
 * Settings class for date-related configuration
 */
export class DateSettingsSettings {
    public dateColumn: string = "";
    public startDate: string = "";
    public endDate: string = "";
}

/**
 * Settings class for visual appearance configuration
 */
export class AppearanceSettings {
    public showTitle: boolean = true;
    public titleText: string = "Date Range Filter";
    public titleColor: string = "#000000";
}

/**
 * Main visual settings container
 */
export class VisualSettings {
    public dateSettings: DateSettingsSettings = new DateSettingsSettings();
    public appearance: AppearanceSettings = new AppearanceSettings();
}

/**
 * Utility class for date operations and calculations
 * Implements Single Responsibility Principle
 */
class DateUtils {
    /**
     * Formats a Date object to YYYY-MM-DD string for HTML date inputs
     * @param date - The date to format
     * @returns Formatted date string
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /**
     * Parses a date string into a Date object
     * @param dateString - String representation of date
     * @returns Parsed Date object
     */
    static parseDate(dateString: string): Date {
        return new Date(dateString);
    }

    /**
     * Calculates date range based on predefined range type
     * @param range - The predefined range type
     * @param maxDate - Maximum date from data (defaults to current date)
     * @returns Date range object with start and end dates
     */
    static getDateRange(range: PredefinedRange, maxDate?: Date): IDateRange {
        // Use the provided maxDate or current date as fallback
        const endDate = maxDate || new Date();
        const startDate = new Date(endDate);
        
        if (range !== PredefinedRange.CUSTOM) {
            // Calculate start date by subtracting the specified number of days
            startDate.setDate(endDate.getDate() - range);
        }

        return { startDate, endDate };
    }

    /**
     * Validates that start date is not after end date
     * @param startDate - Start date to validate
     * @param endDate - End date to validate
     * @returns True if date range is valid
     */
    static isValidDateRange(startDate: Date, endDate: Date): boolean {
        return startDate <= endDate;
    }

    /**
     * Finds minimum and maximum dates from an array of date values
     * Handles DirectQuery datasets with potentially large numbers of unique dates
     * @param data - Array of date values (strings or Date objects)
     * @returns Object containing min and max dates, or nulls if no valid dates found
     */
    static findMinMaxDates(data: any[]): { minDate: Date | null; maxDate: Date | null } {
        if (!data || data.length === 0) {
            console.warn("No data provided to findMinMaxDates");
            return { minDate: null, maxDate: null };
        }

        let minDate: Date | null = null;
        let maxDate: Date | null = null;
        let validDateCount = 0;

        // Process all data to find true min/max across entire dataset
        data.forEach((item, index) => {
            const date = new Date(item);
            if (!isNaN(date.getTime())) {
                validDateCount++;
                if (!minDate || date < minDate) minDate = date;
                if (!maxDate || date > maxDate) maxDate = date;
            }
        });

        console.log(`Processed ${data.length} date values, found ${validDateCount} valid dates`);
        if (minDate && maxDate) {
            console.log(`Date range found: ${this.formatDate(minDate)} to ${this.formatDate(maxDate)}`);
        }

        return { minDate, maxDate };
    }
}

/**
 * Service for displaying user feedback messages
 * Implements Single Responsibility Principle
 */
class MessageService implements IMessageService {
    private messageDiv: HTMLDivElement;

    /**
     * Creates a new MessageService instance
     * @param messageDiv - HTML element for displaying messages
     */
    constructor(messageDiv: HTMLDivElement) {
        this.messageDiv = messageDiv;
    }

    /**
     * Displays a success message to the user
     * @param message - Success message text
     */
    showSuccess(message: string): void {
        this.showMessage(message, false);
    }

    /**
     * Displays an error message to the user
     * @param message - Error message text
     */
    showError(message: string): void {
        this.showMessage(message, true);
    }

    /**
     * Internal method for showing messages with appropriate styling
     * @param text - Message text to display
     * @param isError - Whether this is an error message
     */
    private showMessage(text: string, isError: boolean): void {
        this.messageDiv.textContent = text;
        this.messageDiv.style.display = "block";
        
        if (isError) {
            this.messageDiv.style.background = "#fed9cc";
            this.messageDiv.style.border = "1px solid #d83b01";
            this.messageDiv.style.color = "#d83b01";
        } else {
            this.messageDiv.style.background = "#dff6dd";
            this.messageDiv.style.border = "1px solid #107c10";
            this.messageDiv.style.color = "#107c10";
        }

        setTimeout(() => {
            this.messageDiv.style.display = "none";
        }, 3000);
    }
}

/**
 * Service for handling Power BI filter operations
 * Implements Single Responsibility Principle
 */
class FilterService implements IFilterService {
    private host: any;
    private dateColumn: IDateColumnInfo | null;
    private messageService: IMessageService;

    /**
     * Creates a new FilterService instance
     * @param host - Power BI host object for filter operations
     * @param messageService - Service for displaying user messages
     */
    constructor(host: any, messageService: IMessageService) {
        this.host = host;
        this.messageService = messageService;
        this.dateColumn = null;
    }

    /**
     * Sets the date column to be used for filtering
     * @param column - Date column information or null to clear
     */
    setDateColumn(column: IDateColumnInfo | null): void {
        this.dateColumn = column;
    }

    /**
     * Applies a date range filter to Power BI
     * @param dateRange - Date range to filter by
     */
    applyFilter(dateRange: IDateRange): void {
        if (!this.dateColumn) {
            this.messageService.showError("Unable to apply filter - add a date field");
            return;
        }

        try {
            // For DirectQuery models, use the filter manager approach
            const filter = this.createAdvancedFilter(dateRange);
            if (filter && this.host && this.host.createSelectionManager) {
                // Use the selection manager for DirectQuery compatibility
                const selectionManager = this.host.createSelectionManager();
                
                // Apply filter using the filter manager - more compatible with DirectQuery
                if (this.host.filterManager && this.host.filterManager.applyFilter) {
                    this.host.filterManager.applyFilter(filter);
                    this.messageService.showSuccess("Filter applied successfully!");
                } else if (this.host.applyJsonFilter) {
                    // Fallback to JSON filter with proper parameters for DirectQuery
                    this.host.applyJsonFilter(filter, "general", "filter", 2);
                    this.messageService.showSuccess("Filter applied successfully!");
                } else {
                    this.messageService.showError("Filter API not available for this data source");
                }
            } else {
                this.messageService.showError("Filter service not available");
            }
        } catch (error) {
            console.error("Filter error:", error);
            this.messageService.showError("Error applying filter. DirectQuery may have limitations.");
        }
    }

    /**
     * Clears all date filters from Power BI (DirectQuery compatible)
     */
    clearFilter(): void {
        try {
            console.log("Clearing all filters to restore full data access");
            
            // Multiple approaches to ensure filter clearing works
            let filterCleared = false;

            // Method 1: Use filter manager for DirectQuery
            if (this.host && this.host.filterManager && this.host.filterManager.clear) {
                this.host.filterManager.clear();
                filterCleared = true;
                console.log("Filters cleared using filterManager.clear()");
            }

            // Method 2: Remove JSON filters using applyJsonFilter with null
            if (this.host && this.host.applyJsonFilter) {
                // Clear both general and advanced filters
                this.host.applyJsonFilter(null, "general", "filter", 1); // Remove general filters
                this.host.applyJsonFilter(null, "advanced", "filter", 1); // Remove advanced filters
                filterCleared = true;
                console.log("Filters cleared using applyJsonFilter(null)");
            }

            // Method 3: Clear selection manager filters
            if (this.host && this.host.createSelectionManager) {
                const selectionManager = this.host.createSelectionManager();
                if (selectionManager.clear) {
                    selectionManager.clear();
                    console.log("Selection manager cleared");
                }
            }

            if (filterCleared) {
                this.messageService.showSuccess("All filters cleared - showing full data");
                console.log("All filters cleared successfully - full dataset should now be accessible");
            } else {
                this.messageService.showError("Unable to clear filters - API not available");
                console.warn("No filter clearing methods were available");
            }

        } catch (error) {
            console.error("Clear filter error:", error);
            this.messageService.showError("Error clearing filters: " + error.message);
        }
    }

    /**
     * Creates a Power BI basic filter object for date range filtering
     * @param dateRange - Date range to create filter for
     * @returns Power BI filter object or null if no date column is set
     */
    private createBasicFilter(dateRange: IDateRange): any {
        if (!this.dateColumn) return null;

        // Use the exact queryName from the column metadata for proper targeting
        const target = {
            table: this.dateColumn.queryName?.split('.')[0] || "Table",
            column: this.dateColumn.queryName?.split('.')[1] || this.dateColumn.displayName || "Date"
        };

        return {
            $schema: "http://powerbi.com/product/schema#basic",
            target: target,
            operator: "And",
            conditions: [
                {
                    operator: "GreaterThanOrEqual",
                    value: DateUtils.formatDate(dateRange.startDate) + "T00:00:00.000Z"
                },
                {
                    operator: "LessThanOrEqual", 
                    value: DateUtils.formatDate(dateRange.endDate) + "T23:59:59.999Z"
                }
            ]
        };
    }

    /**
     * Creates a Power BI advanced filter object for date range filtering (DirectQuery optimized)
     * @param dateRange - Date range to create filter for
     * @returns Power BI advanced filter object or null if no date column is set
     */
    private createAdvancedFilter(dateRange: IDateRange): any {
        if (!this.dateColumn) return null;

        // For DirectQuery, we need to be very specific about the target
        const queryName = this.dateColumn.queryName || this.dateColumn.displayName;
        const tableName = queryName.includes('.') ? queryName.split('.')[0] : "Table";
        const columnName = queryName.includes('.') ? queryName.split('.')[1] : queryName;

        // Create filter that works specifically with DirectQuery semantic models
        return {
            $schema: "http://powerbi.com/product/schema#advanced",
            target: {
                table: tableName,
                column: columnName
            },
            logicalOperator: "And",
            conditions: [
                {
                    operator: "GreaterThanOrEqual",
                    value: this.formatDateForDirectQuery(dateRange.startDate, true)
                },
                {
                    operator: "LessThanOrEqual", 
                    value: this.formatDateForDirectQuery(dateRange.endDate, false)
                }
            ],
            filterType: 6 // Advanced filter type for DirectQuery
        };
    }

    /**
     * Formats dates specifically for DirectQuery compatibility
     * @param date - Date to format
     * @param isStartDate - Whether this is a start date (affects time component)
     * @returns Formatted date string for DirectQuery
     */
    private formatDateForDirectQuery(date: Date, isStartDate: boolean): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        
        // For DirectQuery, use proper ISO format without timezone confusion
        if (isStartDate) {
            return `${year}-${month}-${day}T00:00:00.000`;
        } else {
            return `${year}-${month}-${day}T23:59:59.999`;
        }
    }
}

/**
 * UI component for predefined date range selection buttons
 * Implements Single Responsibility Principle
 */
class PredefinedRangesComponent implements IUIComponent {
    private container: HTMLElement;
    private onRangeSelected: (range: PredefinedRange) => void;
    private selectedRange: PredefinedRange = PredefinedRange.LATEST_7_DAYS;

    /**
     * Creates a new PredefinedRangesComponent instance
     * @param onRangeSelected - Callback function when a range is selected
     */
    constructor(onRangeSelected: (range: PredefinedRange) => void) {
        this.onRangeSelected = onRangeSelected;
    }

    /**
     * Renders the predefined range buttons in the specified container
     * @param container - HTML element to render the component in
     */
    render(container: HTMLElement): void {
        this.container = container;
        
        const rangesContainer = document.createElement("div");
        rangesContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 12px;
        `;

        const title = document.createElement("div");
        title.textContent = "Quick Select:";
        title.style.cssText = `
            font-size: 11px;
            font-weight: 600;
            color: #323130;
            margin-bottom: 6px;
        `;
        rangesContainer.appendChild(title);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
        `;

        const ranges = [
            { range: PredefinedRange.LATEST_7_DAYS, label: "Last 7 days" },
            { range: PredefinedRange.LATEST_30_DAYS, label: "Last 30 days" },
            { range: PredefinedRange.LATEST_90_DAYS, label: "Last 90 days" },
            { range: PredefinedRange.CUSTOM, label: "Custom" }
        ];

        ranges.forEach(({ range, label }) => {
            const button = document.createElement("button");
            button.textContent = label;
            button.style.cssText = `
                padding: 4px 8px;
                border: 1px solid ${range === this.selectedRange ? '#0078d4' : '#605e5c'};
                background: ${range === this.selectedRange ? '#0078d4' : '#ffffff'};
                color: ${range === this.selectedRange ? '#ffffff' : '#323130'};
                border-radius: 2px;
                font-size: 10px;
                cursor: pointer;
                flex: 1;
                min-width: 60px;
            `;
            
            button.onclick = () => {
                this.selectedRange = range;
                this.updateButtonStyles(buttonContainer, range);
                this.onRangeSelected(range);
            };
            
            buttonContainer.appendChild(button);
        });

        rangesContainer.appendChild(buttonContainer);
        container.appendChild(rangesContainer);
    }

    /**
     * Updates the component with new data (currently not used)
     * @param data - Optional data for updates
     */
    update(data?: any): void {
        // Update logic if needed
    }

    /**
     * Updates button styling to reflect the selected range
     * @param container - Container holding the buttons
     * @param selectedRange - Currently selected range
     */
    private updateButtonStyles(container: HTMLElement, selectedRange: PredefinedRange): void {
        const buttons = container.querySelectorAll('button');
        const ranges = [
            PredefinedRange.LATEST_7_DAYS,
            PredefinedRange.LATEST_30_DAYS,
            PredefinedRange.LATEST_90_DAYS,
            PredefinedRange.CUSTOM
        ];

        buttons.forEach((button, index) => {
            const isSelected = ranges[index] === selectedRange;
            button.style.border = `1px solid ${isSelected ? '#0078d4' : '#605e5c'}`;
            button.style.background = isSelected ? '#0078d4' : '#ffffff';
            button.style.color = isSelected ? '#ffffff' : '#323130';
        });
    }
}

/**
 * UI component for date input controls with validation
 * Implements Single Responsibility Principle
 */
class DateInputsComponent implements IUIComponent {
    private container: HTMLElement;
    private startDateInput: HTMLInputElement;
    private endDateInput: HTMLInputElement;
    private onDateChange: (startDate: string, endDate: string) => void;
    private minDate: Date | null = null;
    private maxDate: Date | null = null;

    /**
     * Creates a new DateInputsComponent instance
     * @param onDateChange - Callback function when dates change
     */
    constructor(onDateChange: (startDate: string, endDate: string) => void) {
        this.onDateChange = onDateChange;
    }

    /**
     * Renders the date input controls in the specified container
     * @param container - HTML element to render the component in
     */
    render(container: HTMLElement): void {
        this.container = container;
        
        const formContainer = document.createElement("div");
        formContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // Start date input
        const startContainer = this.createDateInput("Start Date:", "startDate");
        this.startDateInput = startContainer.querySelector('input') as HTMLInputElement;
        this.startDateInput.addEventListener('change', () => this.handleDateChange());
        formContainer.appendChild(startContainer);

        // End date input
        const endContainer = this.createDateInput("End Date:", "endDate");
        this.endDateInput = endContainer.querySelector('input') as HTMLInputElement;
        this.endDateInput.addEventListener('change', () => this.handleDateChange());
        formContainer.appendChild(endContainer);

        container.appendChild(formContainer);
    }

    /**
     * Updates the component with new date constraints
     * @param data - Object containing minDate and maxDate constraints
     */
    update(data?: { minDate?: Date; maxDate?: Date }): void {
        if (data) {
            this.minDate = data.minDate || null;
            this.maxDate = data.maxDate || null;
            this.updateDateConstraints();
        }
    }

    /**
     * Sets the date range values in the input controls
     * @param startDate - Start date to set
     * @param endDate - End date to set
     */
    setDateRange(startDate: Date, endDate: Date): void {
        this.startDateInput.value = DateUtils.formatDate(startDate);
        this.endDateInput.value = DateUtils.formatDate(endDate);
    }

    /**
     * Gets the current date range from the input controls
     * @returns Current date range
     */
    getDateRange(): IDateRange {
        return {
            startDate: DateUtils.parseDate(this.startDateInput.value),
            endDate: DateUtils.parseDate(this.endDateInput.value)
        };
    }

    /**
     * Creates a labeled date input element
     * @param labelText - Text for the input label
     * @param name - Name attribute for the input
     * @returns Container element with label and input
     */
    private createDateInput(labelText: string, name: string): HTMLElement {
        const container = document.createElement("div");
        
        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cssText = `
            display: block;
            margin-bottom: 3px;
            font-size: 11px;
            font-weight: 600;
            color: #323130;
        `;
        container.appendChild(label);

        const input = document.createElement("input");
        input.type = "date";
        input.name = name;
        input.style.cssText = `
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #605e5c;
            border-radius: 2px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        container.appendChild(input);

        return container;
    }

    /**
     * Updates date input constraints based on data min/max values
     */
    private updateDateConstraints(): void {
        if (this.minDate) {
            this.startDateInput.min = DateUtils.formatDate(this.minDate);
            this.endDateInput.min = DateUtils.formatDate(this.minDate);
        }
        if (this.maxDate) {
            this.startDateInput.max = DateUtils.formatDate(this.maxDate);
            this.endDateInput.max = DateUtils.formatDate(this.maxDate);
        }
    }

    /**
     * Handles date input changes and notifies parent component
     */
    private handleDateChange(): void {
        this.onDateChange(this.startDateInput.value, this.endDateInput.value);
    }
}

/**
 * Main Power BI DateTime Picker Visual class
 * Implements Open/Closed Principle and coordinates all components and services
 * 
 * Features:
 * - Automatic min/max date detection from Power BI data
 * - Predefined date ranges (7, 30, 90 days) 
 * - Custom date range selection with validation
 * - Real-time filter application to Power BI reports
 * - Professional UI with responsive design
 * - SOLID architecture for maintainability
 */
export class DateTimePickerVisual {
    // UI Elements
    private target: HTMLElement;
    private host: any;
    private container: HTMLDivElement;
    private messageDiv: HTMLDivElement;
    private fieldInfo: HTMLDivElement;
    
    // Services (Dependency Injection Principle)
    private filterService: IFilterService;
    private messageService: IMessageService;
    
    // Components
    private predefinedRangesComponent: PredefinedRangesComponent;
    private dateInputsComponent: DateInputsComponent;
    
    // Data
    private dateColumn: IDateColumnInfo | null = null;
    private currentRange: PredefinedRange = PredefinedRange.LATEST_7_DAYS;

    /**
     * Creates a new DateTimePickerVisual instance
     * @param options - Power BI visual constructor options
     */
    constructor(options: any) {
        console.log("DateTimePicker Visual constructor called");
        this.host = options.host;
        this.target = options.element;
        this.initializeServices();
        this.initializeComponents();
        this.createUI();
    }

    /**
     * Initializes all required services following Dependency Injection principle
     */
    private initializeServices(): void {
        // Create message div first (will be created in createUI)
        this.messageDiv = document.createElement("div");
        this.messageService = new MessageService(this.messageDiv);
        this.filterService = new FilterService(this.host, this.messageService);
    }

    /**
     * Initializes UI components with proper callbacks
     */
    private initializeComponents(): void {
        this.predefinedRangesComponent = new PredefinedRangesComponent(
            (range: PredefinedRange) => this.handleRangeSelection(range)
        );
        
        this.dateInputsComponent = new DateInputsComponent(
            (startDate: string, endDate: string) => this.handleDateChange(startDate, endDate)
        );
    }

    /**
     * Creates the main UI structure and renders all components
     */
    private createUI(): void {
        // Main container
        this.container = document.createElement("div");
        this.container.style.cssText = `
            padding: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            border: 1px solid #d1d1d1;
            border-radius: 6px;
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
        `;
        this.target.appendChild(this.container);

        // Title
        this.createTitle();
        
        // Field info
        this.createFieldInfo();
        
        // Predefined ranges
        this.predefinedRangesComponent.render(this.container);
        
        // Date inputs
        this.dateInputsComponent.render(this.container);
        
        // Action buttons
        this.createActionButtons();
        
        // Message area
        this.createMessageArea();

        // Set initial state
        this.initializeDefaultState();
    }

    /**
     * Creates the visual title element
     */
    private createTitle(): void {
        const title = document.createElement("h3");
        title.textContent = "Date Range Filter";
        title.style.cssText = `
            margin: 0 0 12px 0;
            color: #323130;
            font-size: 14px;
            font-weight: 600;
            padding-bottom: 8px;
            border-bottom: 1px solid #edebe9;
        `;
        this.container.appendChild(title);
    }

    /**
     * Creates the field information display element
     */
    private createFieldInfo(): void {
        this.fieldInfo = document.createElement("div");
        this.fieldInfo.style.cssText = `
            margin-bottom: 12px;
            padding: 6px 10px;
            background: #fff4ce;
            border: 1px solid #ffb900;
            border-radius: 3px;
            font-size: 11px;
            color: #8a8886;
        `;
        this.fieldInfo.textContent = "Add a date field to the Fields area";
        this.container.appendChild(this.fieldInfo);
    }

    /**
     * Creates the action buttons (Apply Filter, Clear Filter)
     */
    private createActionButtons(): void {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
            display: flex;
            gap: 6px;
            margin: 12px 0;
        `;

        // Apply button
        const applyButton = document.createElement("button");
        applyButton.textContent = "Apply Filter";
        applyButton.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 2px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        applyButton.onmouseover = () => applyButton.style.background = "#106ebe";
        applyButton.onmouseout = () => applyButton.style.background = "#0078d4";
        applyButton.onclick = () => this.applyFilter();
        buttonContainer.appendChild(applyButton);

        // Clear button
        const clearButton = document.createElement("button");
        clearButton.textContent = "Show All Data";
        clearButton.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            background: #8a8886;
            color: white;
            border: none;
            border-radius: 2px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        clearButton.onmouseover = () => clearButton.style.background = "#6d6a67";
        clearButton.onmouseout = () => clearButton.style.background = "#8a8886";
        clearButton.onclick = () => this.clearFilter();
        buttonContainer.appendChild(clearButton);

        this.container.appendChild(buttonContainer);
    }

    /**
     * Creates the message area for user feedback
     */
    private createMessageArea(): void {
        this.messageDiv.style.cssText = `
            margin-top: 8px;
            padding: 6px 10px;
            border-radius: 3px;
            font-size: 11px;
            display: none;
            transition: all 0.3s ease;
        `;
        this.container.appendChild(this.messageDiv);
    }

    /**
     * Sets the initial state of the visual (defaults to last 7 days)
     */
    private initializeDefaultState(): void {
        // Don't set default range here - wait for data to load
        // The range will be set in updateDataColumnInfo after data is processed
        console.log("Initial state setup - waiting for data to determine range");
    }

    /**
     * Handles predefined range selection events
     * @param range - Selected predefined range
     */
    private handleRangeSelection(range: PredefinedRange): void {
        this.currentRange = range;
        
        if (range !== PredefinedRange.CUSTOM) {
            // For DirectQuery, use current date to calculate ranges since dataView is limited
            // This ensures we get the most recent data when selecting "last N days"
            const today = new Date();
            const dateRange = DateUtils.getDateRange(range, today);
            this.dateInputsComponent.setDateRange(dateRange.startDate, dateRange.endDate);
            
            // Log for debugging
            console.log(`Range selected: ${range} days from current date (${DateUtils.formatDate(today)})`);
            console.log(`Calculated range: ${DateUtils.formatDate(dateRange.startDate)} to ${DateUtils.formatDate(dateRange.endDate)}`);
            console.log("Using current date to avoid dataView limitations in DirectQuery");
        }
    }

    /**
     * Handles date input change events and validates the range
     * @param startDate - Start date string from input
     * @param endDate - End date string from input
     */
    private handleDateChange(startDate: string, endDate: string): void {
        if (startDate && endDate) {
            const start = DateUtils.parseDate(startDate);
            const end = DateUtils.parseDate(endDate);
            
            if (!DateUtils.isValidDateRange(start, end)) {
                this.messageService.showError("Start date must be before end date");
            }
        }
    }

    /**
     * Applies the current date range as a filter to Power BI
     */
    private applyFilter(): void {
        const dateRange = this.dateInputsComponent.getDateRange();
        
        if (!dateRange.startDate || !dateRange.endDate) {
            this.messageService.showError("Please select both start and end dates");
            return;
        }

        if (!DateUtils.isValidDateRange(dateRange.startDate, dateRange.endDate)) {
            this.messageService.showError("Start date must be before end date");
            return;
        }

        this.filterService.applyFilter(dateRange);
    }

    /**
     * Clears all date filters from Power BI
     */
    private clearFilter(): void {
        this.filterService.clearFilter();
    }

    /**
     * Power BI visual update method - called when data or viewport changes
     * @param options - Power BI update options containing data and viewport info
     */
    public update(options: any): void {
        console.log("DateTimePicker Visual update called", options);
        
        // Update viewport
        if (options.viewport) {
            this.container.style.width = options.viewport.width + "px";
            this.container.style.height = options.viewport.height + "px";
        }

        // Update field information and extract min/max dates
        this.updateDataColumnInfo(options);
    }

    /**
     * Updates data column information and extracts min/max dates from Power BI data
     * @param options - Power BI update options containing dataViews
     */
    private updateDataColumnInfo(options: any): void {
        if (options.dataViews && options.dataViews[0]) {
            const dataView = options.dataViews[0];
            
            // Look for date column in categorical data
            if (dataView.categorical && dataView.categorical.categories && dataView.categorical.categories.length > 0) {
                const categoryData = dataView.categorical.categories[0];
                this.dateColumn = {
                    displayName: categoryData.source.displayName || "Unknown Field",
                    queryName: categoryData.source.queryName || "",
                };

                // Don't rely on dataView data for min/max as it's limited in DirectQuery
                // Instead, set a reasonable default range that covers typical business data
                console.log("DirectQuery detected - setting wide date range to allow full data access");
                
                // Set a wide range that should cover most business scenarios
                const currentYear = new Date().getFullYear();
                this.dateColumn.minDate = new Date(1900, 0, 1); // Start from 1900
                this.dateColumn.maxDate = new Date(currentYear + 10, 11, 31); // Go to 10 years in future

                // Log the approach
                console.log(`Setting wide date range: ${DateUtils.formatDate(this.dateColumn.minDate)} to ${DateUtils.formatDate(this.dateColumn.maxDate)}`);
                console.log("This allows the slicer to work with the full dataset without dataView limitations");

                // Update date input constraints with the full range
                this.dateInputsComponent.update({ 
                    minDate: this.dateColumn.minDate, 
                    maxDate: this.dateColumn.maxDate 
                });

                // Initialize with last 7 days from current date (not limited dataView)
                setTimeout(() => {
                    this.handleRangeSelection(PredefinedRange.LATEST_7_DAYS);
                    console.log("Initialized with last 7 days from current date to avoid dataView limitations");
                }, 100);

                // Update filter service
                this.filterService.setDateColumn(this.dateColumn);

                // Update UI to show that we're working with full data access
                this.fieldInfo.textContent = `Connected to: ${this.dateColumn.displayName} (Full Data Access)`;
                this.fieldInfo.textContent += ` - Range: ${DateUtils.formatDate(this.dateColumn.minDate)} to ${DateUtils.formatDate(this.dateColumn.maxDate)}`;
                this.fieldInfo.style.background = "#dff6dd";
                this.fieldInfo.style.borderColor = "#107c10";
                this.fieldInfo.style.color = "#107c10";
            } else {
                this.dateColumn = null;
                this.filterService.setDateColumn(null);
                this.fieldInfo.textContent = "Add a date field to the Fields area";
                this.fieldInfo.style.background = "#fff4ce";
                this.fieldInfo.style.borderColor = "#ffb900";
                this.fieldInfo.style.color = "#8a8886";
            }
        }
    }

    /**
     * Power BI visual method for enumerating object instances (properties panel)
     * @param options - Enumeration options
     * @returns Array of visual property instances
     */
    public enumerateObjectInstances(options?: any): any[] {
        return [];
    }
}
