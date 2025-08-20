# Power BI Date Range Slicer

[![Power BI API](https://img.shields.io/badge/Power%20BI%20API-5.3.0-blue.svg)](https://www.npmjs.com/package/powerbi-visuals-api)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.9.0-orange.svg)](https://d3js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.11.1-4B32C3.svg)](https://eslint.org/)
[![Power BI Visuals Tools](https://img.shields.io/badge/pbiviz-6.1.3-yellow.svg)](https://www.npmjs.com/package/powerbi-visuals-tools)

![Power BI](https://img.shields.io/badge/Power%20BI-Compatible-FFD700.svg)
![Responsive](https://img.shields.io/badge/Design-Responsive-brightgreen.svg)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1-blue.svg)
![SOLID](https://img.shields.io/badge/Architecture-SOLID-purple.svg)

A comprehensive and customizable date range slicer for Power BI that provides intuitive date filtering capabilities with predefined ranges and custom date selection options.

## Overview

### Problem Statement

Power BI's built-in date slicers often lack the flexibility and user-friendliness needed for common business scenarios. Users frequently need to filter data by common time periods like "Last 7 Days", "Last 30 Days", or "Last 90 Days", but the standard date slicer requires manual date selection each time. Additionally, there's no easy way to:

- Quickly switch between common date ranges
- See the currently selected date range at a glance
- Debug filtering issues
- Customize the appearance to match corporate branding
- Have a responsive design that works across different screen sizes

### Solution

This custom Power BI visual provides:

- **Predefined Quick Ranges**: One-click selection for Last 7, 30, and 90 days
- **Custom Date Range**: Manual date selection for specific periods
- **Visual Date Range Display**: Clear indication of the currently active date filter
- **Debug Mode**: Troubleshooting capabilities for filter operations
- **Customizable Styling**: Colors, fonts, and appearance options
- **Responsive Design**: Adapts to different visual sizes and orientations
- **Accessibility Support**: Keyboard navigation and high contrast mode

## Features

### Core Functionality
- ✅ Predefined date ranges (Last 7/30/90 days)
- ✅ Custom date range selection
- ✅ Dynamic date range display
- ✅ Apply/Clear filter actions
- ✅ Automatic date column detection
- ✅ Real-time filter application

### Customization Options
- ✅ Default range configuration
- ✅ Debug mode toggle
- ✅ Primary and secondary color customization
- ✅ Font size adjustment
- ✅ Responsive layout

### Technical Features
- ✅ SOLID architecture principles
- ✅ TypeScript implementation
- ✅ Comprehensive error handling
- ✅ Debug logging system
- ✅ Security-compliant DOM manipulation

## Installation

1. Download the `.pbiviz` file from the releases
2. In Power BI Desktop, go to **Visualizations** pane
3. Click the **"..."** (More options) button
4. Select **"Import a visual from file"**
5. Choose the downloaded `.pbiviz` file
6. The visual will appear in your visualizations panel

## Usage

### Basic Setup
1. Add the visual to your report canvas
2. Drag a date column to the visual's data field
3. The visual will automatically detect and configure the date column
4. Select your desired date range and click "Apply Filter"

### Configuration
Access visual settings through the **Format** pane:
- **Default Range**: Set which range loads by default
- **Debug Mode**: Enable to see activity logs
- **Primary Color**: Main visual color
- **Secondary Color**: Accent color for buttons
- **Font Size**: Text size (8-24px)

## Architecture

The project follows SOLID principles with a clean separation of concerns:

```
src/
├── visual.ts                    # Main visual orchestrator
├── settings.ts                  # Visual settings and configuration
├── interfaces/                  # Interface definitions
│   ├── IDateRangeCalculator.ts  # Date calculation contract
│   ├── IUIManager.ts            # UI management contract
│   └── IFilterManager.ts        # Filter management contract
└── services/                    # Service implementations
    ├── DateRangeCalculator.ts   # Date range calculations
    ├── FilterManager.ts         # Power BI filter operations
    ├── UIManager.ts             # UI rendering and interactions
    └── DebugLogger.ts           # Debug logging functionality
```

## Technical Documentation

### Core Classes

#### `Visual` (Main Visual Class)
**Location**: `src/visual.ts`

The main orchestrator class that implements the Power BI `IVisual` interface.

**Responsibilities**:
- Coordinating all services and components
- Handling Power BI lifecycle events (constructor, update, getFormattingModel)
- Managing visual state and configuration

**Key Members**:
```typescript
class Visual implements IVisual {
    private target: HTMLElement;                          // Visual container element
    private host: powerbi.extensibility.visual.IVisualHost; // Power BI host services
    private formattingSettings: VisualFormattingSettingsModel; // Current settings
    private formattingSettingsService: FormattingSettingsService; // Settings service
    
    // Injected services
    private dateRangeCalculator: DateRangeCalculator;     // Date calculations
    private filterManager: FilterManager;                 // Filter operations
    private uiManager: UIManager;                         // UI management
    private debugLogger: DebugLogger;                     // Debug logging
    
    // State
    private currentDateRange: IDateRange | null;          // Active date range
    private isInitialized: boolean;                       // Initialization flag
}
```

**Key Methods**:
- `constructor(options: VisualConstructorOptions)`: Initialize services and setup
- `update(options: VisualUpdateOptions)`: Handle data and settings updates
- `getFormattingModel()`: Return configuration model for settings pane
- `handleApplyFilter(dateRange: IDateRange)`: Apply date filter to report
- `handleClearFilter()`: Clear all applied filters

#### `DateRangeCalculator` (Date Calculation Service)
**Location**: `src/services/DateRangeCalculator.ts`

**Responsibilities**:
- Calculate predefined date ranges
- Create custom date ranges
- Validate date ranges
- Format dates for display

**Key Members**:
```typescript
class DateRangeCalculator implements IDateRangeCalculator {
    // Calculate predefined ranges
    public calculateDateRange(rangeType: DateRangeType): IDateRange;
    
    // Create custom ranges
    public createCustomRange(startDate: Date, endDate: Date): IDateRange;
    
    // Validation
    public isValidDateRange(dateRange: IDateRange): boolean;
    
    // Formatting
    public formatDate(date: Date): string;
    public getRangeTypeDisplayText(rangeType: DateRangeType): string;
    
    // Utility methods
    private subtractDays(date: Date, days: number): Date;
}
```

**Date Range Types**:
```typescript
enum DateRangeType {
    Last7Days = "last7days",
    Last30Days = "last30days", 
    Last90Days = "last90days",
    Custom = "custom"
}
```

#### `FilterManager` (Power BI Filter Service)
**Location**: `src/services/FilterManager.ts`

**Responsibilities**:
- Apply date filters to Power BI reports
- Clear existing filters
- Detect and configure date columns
- Manage filter state

**Key Members**:
```typescript
class FilterManager implements IFilterManager {
    private dateColumnTarget: powerbi.data.ISQExpr | null;    // Date column reference
    private dateColumnName: string | null;                    // Column display name
    private tableQualifiedName: string | null;                // Table name
    
    // Filter operations
    public applyDateFilter(dateRange: IDateRange, host: IVisualHost): void;
    public clearFilters(host: IVisualHost): void;
    
    // Column detection
    public hasDateColumn(dataView: powerbi.DataView): boolean;
    
    // Configuration
    public setDateColumnTarget(target: ISQExpr, columnName: string, tableName: string): void;
    public getDateColumnTarget(): powerbi.data.ISQExpr | null;
}
```

**Filter Implementation**:
- Uses Power BI Advanced Filters with JSON schema
- Applies "GreaterThanOrEqual" and "LessThanOrEqual" conditions
- Handles filter merging and removal
- Supports multiple date column types

#### `UIManager` (User Interface Service)
**Location**: `src/services/UIManager.ts`

**Responsibilities**:
- Create and manage UI components
- Handle user interactions
- Apply visual styling
- Manage debug information display

**Key Members**:
```typescript
class UIManager implements IUIManager {
    private container: HTMLElement;                        // Main container
    private dateRangeCalculator: DateRangeCalculator;     // Date calculation service
    private debugLogger: DebugLogger;                     // Debug logging service
    
    // UI Elements
    private dateRangeDisplay: HTMLElement | null;         // Date range info display
    private debugPanel: HTMLElement | null;               // Debug information panel
    private rangeSelector: HTMLSelectElement | null;      // Range selection dropdown
    private customStartDate: HTMLInputElement | null;     // Custom start date input
    private customEndDate: HTMLInputElement | null;       // Custom end date input
    private customDateContainer: HTMLElement | null;      // Custom date container
    private applyButton: HTMLButtonElement | null;        // Apply filter button
    private clearButton: HTMLButtonElement | null;        // Clear filter button
    
    // Event handlers
    private onApplyFilter: ((dateRange: IDateRange) => void) | null;
    private onClearFilter: (() => void) | null;
}
```

**UI Creation Methods**:
```typescript
// Main UI structure
public createUI(): void;
public setupEventHandlers(): void;
public applyStyles(primaryColor: string, secondaryColor: string, fontSize: number): void;

// Component creation
private createDateRangeDisplay(): void;
private createRangeSelector(): void;
private createCustomDateInputs(): void;
private createActionButtons(): void;
private createDebugPanel(): void;

// Event handling
private handleRangeSelectionChange(): void;
private handleApplyFilter(): void;
private handleClearFilter(): void;
private validateCustomDates(): void;
```

**Styling Architecture**:
- CSS-in-JS approach for dynamic styling
- Responsive design with CSS Grid and Flexbox
- Theme color integration
- Accessibility compliance (focus indicators, high contrast support)

#### `DebugLogger` (Debug Logging Service)
**Location**: `src/services/DebugLogger.ts`

**Responsibilities**:
- Centralized logging for debugging
- Log level management (Info, Warning, Error)
- Log storage and retrieval
- Console output for development

**Key Members**:
```typescript
class DebugLogger {
    private debugLogs: string[];                           // Log storage
    private maxLogs: number;                               // Maximum log entries
    
    // Logging methods
    public logInfo(message: string): void;
    public logWarning(message: string): void;
    public logError(message: string): void;
    
    // Log management
    public getLogs(): string[];
    public clearLogs(): void;
    public getFormattedLogs(): string;
    
    // Internal
    private addLog(log: string): void;
}
```

### Settings and Configuration

#### `VisualFormattingSettingsModel` (Settings Model)
**Location**: `src/settings.ts`

Defines all configurable properties for the visual.

**Settings Categories**:

```typescript
class DateSlicerSettings extends FormattingSettingsCard {
    // Default range selection
    defaultRange = new formattingSettings.ItemDropdown({
        name: "defaultRange",
        displayName: "Default Range",
        items: [
            { displayName: "Last 7 Days", value: "last7days" },
            { displayName: "Last 30 Days", value: "last30days" },
            { displayName: "Last 90 Days", value: "last90days" },
            { displayName: "Custom", value: "custom" }
        ],
        value: { displayName: "Last 7 Days", value: "last7days" }
    });
    
    // Debug mode toggle
    debugMode = new formattingSettings.ToggleSwitch({
        name: "debugMode",
        displayName: "Enable Debug Mode",
        value: false
    });
    
    // Visual styling
    primaryColor = new formattingSettings.ColorPicker({
        name: "primaryColor",
        displayName: "Primary Color",
        value: { value: "#0078d4" }
    });
    
    secondaryColor = new formattingSettings.ColorPicker({
        name: "secondaryColor", 
        displayName: "Secondary Color",
        value: { value: "#106ebe" }
    });
    
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 14,
        options: {
            minValue: { type: powerbi.visuals.ValidatorType.Min, value: 8 },
            maxValue: { type: powerbi.visuals.ValidatorType.Max, value: 24 }
        }
    });
}
```

#### Data Structures

**IDateRange Interface**:
```typescript
interface IDateRange {
    startDate: Date;        // Range start date
    endDate: Date;          // Range end date  
    type: DateRangeType;    // Range type identifier
}
```

### Interfaces

#### `IDateRangeCalculator`
**Location**: `src/interfaces/IDateRangeCalculator.ts`

Contract for date range calculation services.

```typescript
interface IDateRangeCalculator {
    calculateDateRange(rangeType: DateRangeType): IDateRange;
    createCustomRange(startDate: Date, endDate: Date): IDateRange;
    isValidDateRange(dateRange: IDateRange): boolean;
}
```

#### `IUIManager`
**Location**: `src/interfaces/IUIManager.ts`

Contract for UI management services.

```typescript
interface IUIManager {
    createUI(): void;
    updateDateRangeDisplay(dateRange: IDateRange): void;
    toggleDebugInfo(show: boolean, debugInfo?: string[]): void;
    setupEventHandlers(): void;
    applyStyles(primaryColor: string, secondaryColor: string, fontSize: number): void;
}
```

#### `IFilterManager`
**Location**: `src/interfaces/IFilterManager.ts`

Contract for filter management services.

```typescript
interface IFilterManager {
    applyDateFilter(dateRange: IDateRange, host: IVisualHost): void;
    clearFilters(host: IVisualHost): void;
    hasDateColumn(dataView: powerbi.DataView): boolean;
}
```

## Styling System

### CSS Architecture

The visual uses a modular CSS approach with LESS preprocessing:

**Main Stylesheet**: `style/visual.less`

**Key Style Classes**:
- `.date-slicer-container`: Main container with responsive layout
- `.date-range-display`: Header showing current date range
- `.controls-section`: Form controls area
- `.action-buttons`: Apply/Clear button container
- `.debug-panel`: Debug information display

**Responsive Breakpoints**:
```less
// Small screens (< 250px width)
@media (max-width: 250px) {
    // Compact layout adjustments
}

// Custom date inputs (< 300px width)  
@media (max-width: 300px) {
    .custom-date-row {
        flex-direction: column; // Stack inputs vertically
    }
}
```

**Accessibility Features**:
- Focus indicators for keyboard navigation
- High contrast mode support
- Reduced motion support
- ARIA-compliant markup

## Development Setup

### Prerequisites
- Node.js 14.x or higher
- PowerBI Visuals Tools (`npm install -g powerbi-visuals-tools`)
- TypeScript 4.x or higher

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run linting
npm run lint

# Build for production
npm run package
```

### Project Structure
```
PBIDateTimePicker/
├── src/                         # Source code
│   ├── visual.ts               # Main visual entry point
│   ├── settings.ts             # Settings and configuration
│   ├── interfaces/             # TypeScript interfaces
│   └── services/               # Service implementations
├── style/                      # Styling
│   └── visual.less            # Main stylesheet
├── assets/                     # Visual assets
│   └── icon.png              # Visual icon
├── capabilities.json          # Visual capabilities definition
├── pbiviz.json               # Visual metadata
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
└── eslint.config.mjs         # ESLint configuration
```

## Testing

### Manual Testing Checklist

**Basic Functionality**:
- [ ] Visual loads without errors
- [ ] Date column detection works
- [ ] Predefined ranges calculate correctly
- [ ] Custom date range accepts valid dates
- [ ] Apply filter affects report data
- [ ] Clear filter restores all data

**UI/UX Testing**:
- [ ] Responsive layout at different sizes
- [ ] Color customization applies correctly
- [ ] Font size changes take effect
- [ ] Debug mode shows/hides properly
- [ ] Keyboard navigation works
- [ ] Error states display appropriately

**Edge Cases**:
- [ ] Invalid date ranges are rejected
- [ ] Missing date column handled gracefully
- [ ] Large date ranges perform adequately
- [ ] Visual works with different date formats

## Error Handling

### Common Issues and Solutions

**1. Date Column Not Found**
```typescript
// Error: "No date column available for filtering"
// Solution: Ensure a date field is added to the visual
// Check: FilterManager.hasDateColumn() returns true
```

**2. Invalid Date Range**
```typescript
// Error: "Invalid date range provided"
// Solution: Verify start date ≤ end date
// Check: DateRangeCalculator.isValidDateRange()
```

**3. Filter Application Fails**
```typescript
// Error: "Error applying date filter"
// Solution: Check Power BI host permissions
// Check: Visual has proper capabilities in capabilities.json
```

### Debug Mode

Enable debug mode in visual settings to see:
- Date range calculations
- Filter application attempts
- UI interaction events
- Error messages and warnings

## Performance Considerations

### Optimization Strategies

**1. DOM Manipulation**:
- Batch DOM updates to minimize reflows
- Use document fragments for complex UI creation
- Remove event listeners properly to prevent memory leaks

**2. Date Calculations**:
- Cache calculated ranges when possible
- Use efficient date arithmetic
- Validate inputs early to prevent expensive operations

**3. Filter Operations**:
- Debounce rapid filter changes
- Use appropriate filter granularity
- Monitor filter performance in large datasets

## Maintenance Guide

### Code Quality Standards

**1. SOLID Principles**:
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extend functionality without modifying existing code
- **Liskov Substitution**: Implementations honor interface contracts
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

**2. TypeScript Best Practices**:
- Use strict type checking
- Implement interfaces consistently
- Document public APIs with JSDoc
- Use enums for constant values
- Leverage union types for flexibility

**3. Error Handling**:
- Use try-catch blocks for risky operations
- Log errors with context information
- Provide fallback behavior when possible
- Validate inputs at service boundaries

### Adding New Features

**1. New Date Range Type**:
```typescript
// 1. Add to DateRangeType enum
enum DateRangeType {
    // ... existing types
    LastYear = "lastyear"
}

// 2. Update DateRangeCalculator.calculateDateRange()
// 3. Add option to settings dropdown
// 4. Update UI labels and display text
```

**2. New UI Component**:
```typescript
// 1. Add private property to UIManager
private newComponent: HTMLElement | null = null;

// 2. Create component in createUI()
private createNewComponent(): void { /* implementation */ }

// 3. Add event handlers if needed
// 4. Update applyStyles() for theming
```

**3. New Setting**:
```typescript
// 1. Add to DateSlicerSettings class
newSetting = new formattingSettings.ToggleSwitch({
    name: "newSetting",
    displayName: "New Setting",
    value: false
});

// 2. Add to slices array
// 3. Use in Visual.applySettings()
```

### Version Management

**Version Updates**:
1. Update version in `pbiviz.json`
2. Update version in `package.json`
3. Document changes in release notes
4. Test thoroughly before packaging
5. Update GUID if breaking changes

**Migration Guide**:
- Maintain backward compatibility when possible
- Provide migration scripts for breaking changes
- Document deprecated features clearly
- Support previous versions during transition

## Security Considerations

### Input Validation
- Sanitize all user inputs
- Validate date ranges before processing
- Escape content for DOM insertion
- Use TypeScript for compile-time type safety

### DOM Security
- Avoid innerHTML with user content
- Use textContent for plain text
- Create elements programmatically
- Validate URL inputs for external resources

### Power BI Integration
- Follow Power BI security guidelines
- Use approved APIs only
- Handle permissions gracefully
- Respect user access controls

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Write meaningful commit messages
- Include JSDoc for public APIs
- Add unit tests for new features

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Submit pull request with description

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Enable debug mode for diagnostics
3. Create GitHub issue with reproduction steps
4. Include visual version and Power BI version

## Changelog

### Version 1.0.0.0
- Initial release
- Predefined date ranges (7, 30, 90 days)
- Custom date range selection
- Configurable styling and settings
- Debug mode functionality
- Responsive UI design
- SOLID architecture implementation
