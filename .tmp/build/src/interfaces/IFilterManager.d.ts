import powerbi from "powerbi-visuals-api";
import { IDateRange } from "../settings";
/**
 * Interface for filter management operations
 * Single Responsibility: Define contract for filter operations
 */
export interface IFilterManager {
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
}
