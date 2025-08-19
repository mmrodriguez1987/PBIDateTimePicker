import powerbi from "powerbi-visuals-api";
import { IDateRange } from "../settings";
import { IFilterManager } from "../interfaces/IFilterManager";
/**
 * Implementation of filter management service
 * Single Responsibility: Manage Power BI filters
 * Dependency Inversion: Depends on abstractions (interfaces), not concretions
 */
export declare class FilterManager implements IFilterManager {
    private dateColumnTarget;
    private dateColumnName;
    private tableQualifiedName;
    /**
     * Apply date filter to the report
     * @param dateRange Date range to apply as filter
     * @param host Power BI visual host for applying filters
     */
    applyDateFilter(dateRange: IDateRange, host: powerbi.extensibility.visual.IVisualHost): void;
    /**
     * Clear all applied filters
     * @param host Power BI visual host for clearing filters
     */
    clearFilters(host: powerbi.extensibility.visual.IVisualHost): void;
    /**
     * Validate if date column is available for filtering
     * @param dataView Power BI data view
     * @returns True if date column is available, false otherwise
     */
    hasDateColumn(dataView: powerbi.DataView): boolean;
    /**
     * Private method to validate date range
     * @param dateRange The date range to validate
     * @returns True if valid, false otherwise
     */
    private isValidDateRange;
    /**
     * Get the current date column target
     * @returns The current date column target expression
     */
    getDateColumnTarget(): powerbi.data.ISQExpr | null;
    /**
     * Set the date column target manually
     * @param target The date column target expression
     * @param columnName The column name
     * @param tableName The table name
     */
    setDateColumnTarget(target: powerbi.data.ISQExpr, columnName: string, tableName: string): void;
}
