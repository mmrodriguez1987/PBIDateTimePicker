# Power BI DateTime Picker Visual

A custom Power BI visual that provides an advanced date range picker with predefined ranges, optimized for DirectQuery scenarios and built following SOLID principles.

## Table of Contents

- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Installation and Setup](#installation-and-setup)
- [Visual Configuration](#visual-configuration)
- [Using the Visual](#using-the-visual)
- [Advanced Customization](#advanced-customization)
- [Technical Documentation](#technical-documentation)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Predefined Date Ranges
- **Last 7 Days**: Recent week period
- **Last 30 Days**: Recent month period  
- **Last 90 Days**: Recent quarter period
- **Custom**: User-defined date range

### Key Capabilities
- ✅ Automatic min/max date detection from data
- ✅ Smart predefined date range selection
- ✅ Custom date input with validation
- ✅ DirectQuery optimization
- ✅ Real-time filter application
- ✅ Responsive design
- ✅ Theme support (light/dark/high contrast)
- ✅ SOLID architecture principles
- ✅ Professional Power BI integration

## Technical Architecture

### SOLID Principles Implementation

The DateTime Picker Visual is built following SOLID principles for maintainability and extensibility:

#### Single Responsibility Principle (SRP)
Each class has a single, well-defined responsibility:

- **`DateUtils`**: Date calculations and formatting operations
- **`MessageService`**: User feedback message management
- **`FilterService`**: Power BI filter operations and communication
- **`PredefinedRangesComponent`**: UI component for date range buttons
- **`DateInputsComponent`**: UI component for date input controls
- **`DateTimePickerVisual`**: Main orchestration and coordination

#### Open/Closed Principle (OCP)
- Extensible component architecture
- Easy addition of new date ranges or UI components

#### Liskov Substitution Principle (LSP)
- Interface-based design allows component substitution

#### Interface Segregation Principle (ISP)
- Focused interfaces: `IFilterService`, `IUIComponent`, `IMessageService`

#### Dependency Inversion Principle (DIP)
- Dependency injection for services
- Abstract interfaces over concrete implementations

### Code Structure
```
src/
├── visual.ts          # Main visual class and components
├── interfaces/        # TypeScript interfaces
├── services/          # Business logic services  
├── components/        # UI components
└── utils/            # Utility functions

style/
└── visual.less       # LESS styles with theming

capabilities.json     # Power BI visual capabilities
pbiviz.json          # Visual metadata
tsconfig.json        # TypeScript configuration
```

## Installation and Setup

### Prerequisites
1. **Node.js** (version 14 or higher)
2. **Power BI Custom Visuals Tools**:
   ```powershell
   npm install -g powerbi-visuals-tools
   ```

### Installation Steps

1. **Clone or download the project**:
   ```powershell
   git clone <repository-url>
   cd datetimepicker
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Install development certificate** (first time only):
   ```powershell
   pbiviz --install-cert
   ```

4. **Compile the visual**:
   ```powershell
   npx tsc
   ```

### Development

1. **Start development server**:
   ```powershell
   npx pbiviz start
   ```

2. **Open Power BI Desktop** and add the development visual from the visual marketplace

3. **Make changes** to the code and the visual will update automatically

### Production Packaging

1. **Create .pbiviz package**:
   ```powershell
   npx pbiviz package
   ```

2. The `DateTimePickerVisual.pbiviz` file will be created in the `dist/` folder

3. **Import into Power BI**:
   - Power BI Desktop: File → Import → Import visual from file
   - Power BI Service: Settings → Custom visual → Add custom visual

## Visual Configuration

### Data Requirements

1. **Date Field**: Add a date/datetime field to the "Fields" section of the visual
2. **Automatic Detection**: The visual will automatically detect min/max dates from the data
3. **Filter Integration**: Filters are applied to the entire report page

### Available Properties

#### Date Settings
- **Default Range**: Predefined range when visual loads
- **Date Constraints**: Automatically set based on data min/max values
- **Filter Behavior**: Real-time filter application

#### Appearance
- **Theme Support**: Automatic light/dark/high contrast mode detection
- **Responsive Design**: Adapts to different visual sizes
- **Modern UI**: Professional Power BI styling

### DirectQuery Optimization

For effective use with DirectQuery:

1. **Configure data fields**:
   - Add the primary date field in the visual's "Fields" section

2. **Filter context configuration**:
   - The visual automatically applies filters to the page
   - Filters synchronize with other visuals

3. **Performance optimization**:
   - Use indexes on date columns
   - Consider table partitioning by date
   - Configure appropriate refresh intervals

## Using the Visual

### User Interface

1. **Quick Range Selection**:
   - Click predefined range buttons (7, 30, 90 days)
   - Dates update automatically based on data max date

2. **Custom Range**:
   - Click "Custom" button
   - Set start and end dates manually
   - Date inputs respect data constraints

3. **Action Buttons**:
   - **Apply Filter**: Applies the selected date range
   - **Clear Filter**: Removes all date filters

4. **Smart Features**:
   - Real-time validation (start ≤ end date)
   - Automatic date constraints from data
   - Visual feedback for filter status

### Data Integration

The visual automatically:
- Detects min/max dates from connected data
- Sets appropriate date input constraints
- Updates predefined ranges based on data
- Displays current data range in field info

## Advanced Customization

### Adding Custom Date Ranges

To add new predefined ranges, modify the `PredefinedRange` enum in `src/visual.ts`:

```typescript
enum PredefinedRange {
    LATEST_7_DAYS = 7,
    LATEST_30_DAYS = 30,
    LATEST_90_DAYS = 90,
    LATEST_180_DAYS = 180,  // New range
    CUSTOM = 0
}
```

Then update the ranges array in `PredefinedRangesComponent`:

```typescript
const ranges = [
    { range: PredefinedRange.LATEST_7_DAYS, label: "Last 7 days" },
    { range: PredefinedRange.LATEST_30_DAYS, label: "Last 30 days" },
    { range: PredefinedRange.LATEST_90_DAYS, label: "Last 90 days" },
    { range: PredefinedRange.LATEST_180_DAYS, label: "Last 6 months" },
    { range: PredefinedRange.CUSTOM, label: "Custom" }
];
```

### Custom Styling

Modify `style/visual.less` to customize:
- Colors and typography
- Spacing and layout
- Responsive behavior
- Theme customizations

### Advanced Filtering

For complex filters, modify the `FilterService` class in `src/visual.ts`:

```typescript
private createBasicFilter(dateRange: IDateRange): any {
    // Configure for your specific data model
    return {
        target: {
            table: "YourTable",      // Specify table name
            column: "YourDateColumn" // Specify column name
        },
        // Custom filter configuration
    };
}
```

## Technical Documentation

### Architecture Overview

The Power BI DateTime Picker Visual is a sophisticated custom visual that provides advanced date range filtering capabilities for Power BI reports. Built following SOLID principles, it offers automatic date range detection, predefined range selection, and seamless integration with Power BI's filtering system.

### Core Classes

#### `DateTimePickerVisual`
**Purpose**: Main visual class that orchestrates all components and services

**Key Responsibilities**:
- Initializes and coordinates all services and components
- Handles Power BI visual lifecycle (constructor, update, enumerateObjectInstances)
- Manages UI creation and event handling
- Processes Power BI data updates and extracts date constraints

**Important Methods**:
- `constructor(options)`: Initializes visual with Power BI options
- `update(options)`: Handles data and viewport updates from Power BI
- `initializeServices()`: Sets up dependency injection for services
- `initializeComponents()`: Creates UI components with proper callbacks
- `updateDataColumnInfo(options)`: Extracts min/max dates from Power BI data

#### `DateUtils`
**Purpose**: Static utility class for all date-related operations

**Key Responsibilities**:
- Date formatting for HTML inputs and Power BI filters
- Date parsing and validation
- Predefined range calculations
- Min/max date extraction from data arrays

**Important Methods**:
- `formatDate(date: Date): string`: Converts Date to YYYY-MM-DD format
- `getDateRange(range: PredefinedRange, maxDate?: Date): IDateRange`: Calculates predefined ranges
- `findMinMaxDates(data: any[]): {minDate, maxDate}`: Analyzes data for date bounds
- `isValidDateRange(startDate: Date, endDate: Date): boolean`: Validates date ranges

#### `FilterService`
**Purpose**: Handles all Power BI filter operations

**Key Responsibilities**:
- Creating Power BI filter objects
- Applying and clearing filters through Power BI host
- Managing date column information for filtering
- Error handling for filter operations

**Important Methods**:
- `setDateColumn(column: IDateColumnInfo)`: Sets target column for filtering
- `applyFilter(dateRange: IDateRange)`: Applies date range filter to Power BI
- `clearFilter()`: Removes all date filters
- `createBasicFilter(dateRange: IDateRange)`: Creates Power BI filter JSON

#### `MessageService`
**Purpose**: Manages user feedback messages

**Key Responsibilities**:
- Displaying success and error messages
- Message styling and auto-hide functionality
- Consistent user feedback across the visual

**Important Methods**:
- `showSuccess(message: string)`: Displays green success message
- `showError(message: string)`: Displays red error message
- `showMessage(text: string, isError: boolean)`: Internal message display logic

### UI Components

#### `PredefinedRangesComponent`
**Purpose**: Renders and manages predefined date range buttons

**Features**:
- Dynamic button creation for predefined ranges
- Visual feedback for selected range
- Callback-based communication with parent
- Responsive button layout

**Usage**:
```typescript
const component = new PredefinedRangesComponent((range) => {
    console.log('Selected range:', range);
});
component.render(containerElement);
```

#### `DateInputsComponent`
**Purpose**: Manages custom date input controls with validation

**Features**:
- Start and end date inputs with labels
- Automatic min/max constraint application
- Real-time date change notifications
- Accessible form controls

**Usage**:
```typescript
const component = new DateInputsComponent((start, end) => {
    console.log('Date range changed:', start, end);
});
component.render(containerElement);
component.update({ minDate: new Date('2020-01-01'), maxDate: new Date() });
```

### Data Flow

#### Visual Initialization
1. Power BI calls `constructor(options)`
2. Visual initializes services (`MessageService`, `FilterService`)
3. Visual creates UI components with callbacks
4. Visual renders complete UI structure
5. Default date range (last 7 days) is applied

#### Data Updates
1. Power BI calls `update(options)` with new data
2. Visual extracts date column information from `dataViews`
3. Min/max dates are calculated from actual data
4. Date input constraints are updated
5. UI reflects current data connection status
6. Filter service is updated with new column information

#### User Interactions
1. **Predefined Range Selection**:
   - User clicks predefined range button
   - Component updates visual selection state
   - Callback triggers date range calculation
   - Date inputs are updated automatically

2. **Custom Date Entry**:
   - User modifies date inputs
   - Component validates date range
   - Change callback notifies parent
   - Real-time validation feedback

3. **Filter Application**:
   - User clicks "Apply Filter" button
   - Visual validates current date range
   - Filter service creates Power BI filter object
   - Filter is applied through Power BI host
   - Success/error feedback is displayed

### Configuration

#### Predefined Ranges
Current predefined ranges are defined in the `PredefinedRange` enum:

```typescript
enum PredefinedRange {
    LATEST_7_DAYS = 7,    // Last 7 days from max date
    LATEST_30_DAYS = 30,  // Last 30 days from max date
    LATEST_90_DAYS = 90,  // Last 90 days from max date
    CUSTOM = 0            // User-defined range
}
```

#### Visual Capabilities
Defined in `capabilities.json`:
- **Data Roles**: Single date field requirement
- **Data View Mappings**: Categorical data support
- **Objects**: Property panel configurations (currently minimal)

#### Styling
Defined in `style/visual.less`:
- Modern Power BI-compatible styling
- Responsive design for various visual sizes
- Theme support (light/dark/high contrast)
- Professional color scheme and typography

## API Documentation

### Main Classes

#### `DateTimePickerVisual`
Main visual class that orchestrates all components.

**Methods:**
- `constructor(options: any)`: Initializes the visual
- `update(options: any)`: Updates visual with new data
- `enumerateObjectInstances()`: Returns visual properties

#### `DateUtils`
Utility class for date operations.

**Static Methods:**
- `formatDate(date: Date): string`: Formats date for inputs
- `parseDate(dateString: string): Date`: Parses date strings
- `getDateRange(range: PredefinedRange, maxDate?: Date): IDateRange`: Calculates predefined ranges
- `isValidDateRange(startDate: Date, endDate: Date): boolean`: Validates date ranges
- `findMinMaxDates(data: any[]): {minDate, maxDate}`: Extracts date bounds from data

#### `FilterService`
Handles Power BI filter operations.

**Methods:**
- `setDateColumn(column: IDateColumnInfo)`: Sets the target date column
- `applyFilter(dateRange: IDateRange)`: Applies date range filter
- `clearFilter()`: Removes all filters

#### `MessageService`
Manages user feedback messages.

**Methods:**
- `showSuccess(message: string)`: Shows success message
- `showError(message: string)`: Shows error message

### Interfaces

#### `IDateRange`
```typescript
interface IDateRange {
    startDate: Date;
    endDate: Date;
}
```

#### `IDateColumnInfo`
```typescript
interface IDateColumnInfo {
    displayName: string;
    queryName: string;
    minDate?: Date;
    maxDate?: Date;
}
```

### Error Handling

#### Validation Layers
1. **Input Validation**: Date range validation (start ≤ end)
2. **Data Validation**: Min/max constraint checking
3. **Filter Validation**: Power BI filter object validation
4. **Runtime Error Handling**: Try-catch blocks for all operations

#### Error Types and Handling
- **Date Range Errors**: "Start date must be before end date"
- **Missing Data Errors**: "Add a date field to the Fields area"  
- **Filter Errors**: "Error applying filter" with console logging
- **Connection Errors**: Visual feedback for data connection status

#### User Feedback
All errors and successes are communicated through:
- Colored message boxes with auto-hide functionality
- Status indicators in field information area
- Console logging for debugging purposes

## Troubleshooting

### Common Issues

1. **Certificate error**:
   ```powershell
   pbiviz --install-cert
   ```

2. **TypeScript compilation error**:
   - Check dependency versions
   - Run `npm install` again
   - Verify Node.js version compatibility

3. **Visual not loading in Power BI**:
   - Verify development server is running
   - Confirm certificate is installed
   - Check browser console for errors

4. **Filters not applying**:
   - Verify data model configuration
   - Confirm table/column names are correct
   - Check DirectQuery permissions
   - Ensure date field is properly connected

### Debugging

1. **Enable logging**:
   ```typescript
   console.log("Debug info:", this.dateColumn);
   ```

2. **Use Developer Tools**:
   - F12 in Power BI Desktop
   - Check Console and Network tabs

3. **Verify applied filters**:
   - Use Performance Analyzer in Power BI
   - Review generated DAX queries

### Performance Tips

1. **Data Optimization**:
   - Use date hierarchies in your model
   - Implement proper date tables
   - Consider date partitioning

2. **Visual Performance**:
   - Limit data volume when possible
   - Use appropriate aggregation levels
   - Monitor filter complexity

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Follow SOLID principles
4. Add appropriate documentation
5. Include unit tests
6. Submit a pull request

### Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **Architecture**: Maintain SOLID principles
3. **Documentation**: Document all public methods
4. **Testing**: Include unit tests for new features
5. **Performance**: Consider Power BI performance implications

## License

MIT License - see LICENSE file for details.

## Support

For technical support:
- Review official Power BI Custom Visuals documentation
- Check browser console for error logs
- Verify DirectQuery configuration in your data model
- Consult Power BI community forums

## Roadmap

Planned future features:
- [ ] Multiple timezone support
- [ ] User-configurable range presets  
- [ ] Business calendar integration
- [ ] Complex relative filter support
- [ ] Configuration export/import
- [ ] Period comparison mode
- [ ] Custom date formatting options
- [ ] Advanced filter templates

## Performance Considerations

### Best Practices
1. **Data Model**: Use proper date tables and relationships
2. **Indexing**: Ensure date columns are indexed
3. **Partitioning**: Consider date-based partitioning for large datasets
4. **Aggregations**: Use appropriate aggregation strategies
5. **Refresh**: Optimize refresh schedules for DirectQuery scenarios

### Monitoring
- Use Power BI Performance Analyzer
- Monitor DAX query performance
- Track visual rendering times
- Review filter application impact

## Installation and Setup

### Prerequisites
1. **Node.js** (version 14 or higher)
2. **Power BI Custom Visuals Tools**:
   ```powershell
   npm install -g powerbi-visuals-tools
   ```

### Installation Steps

1. **Clone or download the project**:
   ```powershell
   git clone <repository-url>
   cd datetimepicker
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Install development certificate** (first time only):
   ```powershell
   pbiviz --install-cert
   ```

4. **Compile the visual**:
   ```powershell
   npx tsc
   ```

### Development

1. **Start development server**:
   ```powershell
   npx pbiviz start
   ```

2. **Open Power BI Desktop** and add the development visual from the visual marketplace

3. **Make changes** to the code and the visual will update automatically

### Production Packaging

1. **Create .pbiviz package**:
   ```powershell
   npx pbiviz package
   ```

2. The `DateTimePickerVisual.pbiviz` file will be created in the `dist/` folder

3. **Import into Power BI**:
   - Power BI Desktop: File → Import → Import visual from file
   - Power BI Service: Settings → Custom visual → Add custom visual

## Visual Configuration

### Data Requirements

1. **Date Field**: Add a date/datetime field to the "Fields" section of the visual
2. **Automatic Detection**: The visual will automatically detect min/max dates from the data
3. **Filter Integration**: Filters are applied to the entire report page

### Available Properties

#### Date Settings
- **Default Range**: Predefined range when visual loads
- **Date Constraints**: Automatically set based on data min/max values
- **Filter Behavior**: Real-time filter application

#### Appearance
- **Theme Support**: Automatic light/dark/high contrast mode detection
- **Responsive Design**: Adapts to different visual sizes
- **Modern UI**: Professional Power BI styling

### DirectQuery Optimization

For effective use with DirectQuery:

1. **Configure data fields**:
   - Add the primary date field in the visual's "Fields" section

2. **Filter context configuration**:
   - The visual automatically applies filters to the page
   - Filters synchronize with other visuals

3. **Performance optimization**:
   - Use indexes on date columns
   - Consider table partitioning by date
   - Configure appropriate refresh intervals

## Using the Visual

### User Interface

1. **Quick Range Selection**:
   - Click predefined range buttons (7, 30, 90 days)
   - Dates update automatically based on data max date

2. **Custom Range**:
   - Click "Custom" button
   - Set start and end dates manually
   - Date inputs respect data constraints

3. **Action Buttons**:
   - **Apply Filter**: Applies the selected date range
   - **Clear Filter**: Removes all date filters

4. **Smart Features**:
   - Real-time validation (start ≤ end date)
   - Automatic date constraints from data
   - Visual feedback for filter status

### Data Integration

The visual automatically:
- Detects min/max dates from connected data
- Sets appropriate date input constraints
- Updates predefined ranges based on data
- Displays current data range in field info

## Advanced Customization

### Adding Custom Date Ranges

To add new predefined ranges, modify the `PredefinedRange` enum in `src/visual.ts`:

```typescript
enum PredefinedRange {
    LATEST_7_DAYS = 7,
    LATEST_30_DAYS = 30,
    LATEST_90_DAYS = 90,
    LATEST_180_DAYS = 180,  // New range
    CUSTOM = 0
}
```

Then update the ranges array in `PredefinedRangesComponent`:

```typescript
const ranges = [
    { range: PredefinedRange.LATEST_7_DAYS, label: "Last 7 days" },
    { range: PredefinedRange.LATEST_30_DAYS, label: "Last 30 days" },
    { range: PredefinedRange.LATEST_90_DAYS, label: "Last 90 days" },
    { range: PredefinedRange.LATEST_180_DAYS, label: "Last 6 months" },
    { range: PredefinedRange.CUSTOM, label: "Custom" }
];
```

### Custom Styling

Modify `style/visual.less` to customize:
- Colors and typography
- Spacing and layout
- Responsive behavior
- Theme customizations

### Advanced Filtering

For complex filters, modify the `FilterService` class in `src/visual.ts`:

```typescript
private createBasicFilter(dateRange: IDateRange): any {
    // Configure for your specific data model
    return {
        target: {
            table: "YourTable",      // Specify table name
            column: "YourDateColumn" // Specify column name
        },
        // Custom filter configuration
    };
}
```

## Troubleshooting

### Common Issues

1. **Certificate error**:
   ```powershell
   pbiviz --install-cert
   ```

2. **TypeScript compilation error**:
   - Check dependency versions
   - Run `npm install` again
   - Verify Node.js version compatibility

3. **Visual not loading in Power BI**:
   - Verify development server is running
   - Confirm certificate is installed
   - Check browser console for errors

4. **Filters not applying**:
   - Verify data model configuration
   - Confirm table/column names are correct
   - Check DirectQuery permissions
   - Ensure date field is properly connected

### Debugging

1. **Enable logging**:
   ```typescript
   console.log("Debug info:", this.dateColumn);
   ```

2. **Use Developer Tools**:
   - F12 in Power BI Desktop
   - Check Console and Network tabs

3. **Verify applied filters**:
   - Use Performance Analyzer in Power BI
   - Review generated DAX queries

### Performance Tips

1. **Data Optimization**:
   - Use date hierarchies in your model
   - Implement proper date tables
   - Consider date partitioning

2. **Visual Performance**:
   - Limit data volume when possible
   - Use appropriate aggregation levels
   - Monitor filter complexity

## API Documentation

### Main Classes

#### `DateTimePickerVisual`
Main visual class that orchestrates all components.

**Methods:**
- `constructor(options: any)`: Initializes the visual
- `update(options: any)`: Updates visual with new data
- `enumerateObjectInstances()`: Returns visual properties

#### `DateUtils`
Utility class for date operations.

**Static Methods:**
- `formatDate(date: Date): string`: Formats date for inputs
- `parseDate(dateString: string): Date`: Parses date strings
- `getDateRange(range: PredefinedRange, maxDate?: Date): IDateRange`: Calculates predefined ranges
- `isValidDateRange(startDate: Date, endDate: Date): boolean`: Validates date ranges
- `findMinMaxDates(data: any[]): {minDate, maxDate}`: Extracts date bounds from data

#### `FilterService`
Handles Power BI filter operations.

**Methods:**
- `setDateColumn(column: IDateColumnInfo)`: Sets the target date column
- `applyFilter(dateRange: IDateRange)`: Applies date range filter
- `clearFilter()`: Removes all filters

#### `MessageService`
Manages user feedback messages.

**Methods:**
- `showSuccess(message: string)`: Shows success message
- `showError(message: string)`: Shows error message

### Interfaces

#### `IDateRange`
```typescript
interface IDateRange {
    startDate: Date;
    endDate: Date;
}
```

#### `IDateColumnInfo`
```typescript
interface IDateColumnInfo {
    displayName: string;
    queryName: string;
    minDate?: Date;
    maxDate?: Date;
}
```

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Follow SOLID principles
4. Add appropriate documentation
5. Include unit tests
6. Submit a pull request

### Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **Architecture**: Maintain SOLID principles
3. **Documentation**: Document all public methods
4. **Testing**: Include unit tests for new features
5. **Performance**: Consider Power BI performance implications

## License

MIT License - see LICENSE file for details.

## Support

For technical support:
- Review official Power BI Custom Visuals documentation
- Check browser console for error logs
- Verify DirectQuery configuration in your data model
- Consult Power BI community forums

## Roadmap

Planned future features:
- [ ] Multiple timezone support
- [ ] User-configurable range presets  
- [ ] Business calendar integration
- [ ] Complex relative filter support
- [ ] Configuration export/import
- [ ] Period comparison mode
- [ ] Custom date formatting options
- [ ] Advanced filter templates

## Performance Considerations

### Best Practices
1. **Data Model**: Use proper date tables and relationships
2. **Indexing**: Ensure date columns are indexed
3. **Partitioning**: Consider date-based partitioning for large datasets
4. **Aggregations**: Use appropriate aggregation strategies
5. **Refresh**: Optimize refresh schedules for DirectQuery scenarios

### Monitoring
- Use Power BI Performance Analyzer
- Monitor DAX query performance
- Track visual rendering times
- Review filter application impact
