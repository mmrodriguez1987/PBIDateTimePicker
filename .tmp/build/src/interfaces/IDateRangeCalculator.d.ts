import { DateRangeType, IDateRange } from "../settings";
/**
 * Interface for date range calculation services
 * Single Responsibility: Define contract for date range calculations
 */
export interface IDateRangeCalculator {
    /**
     * Calculate date range based on predefined types
     * @param rangeType The type of date range to calculate
     * @returns IDateRange object with start and end dates
     */
    calculateDateRange(rangeType: DateRangeType): IDateRange;
    /**
     * Create custom date range
     * @param startDate Start date for the range
     * @param endDate End date for the range
     * @returns IDateRange object with custom dates
     */
    createCustomRange(startDate: Date, endDate: Date): IDateRange;
    /**
     * Validate if a date range is valid
     * @param dateRange The date range to validate
     * @returns True if valid, false otherwise
     */
    isValidDateRange(dateRange: IDateRange): boolean;
}
