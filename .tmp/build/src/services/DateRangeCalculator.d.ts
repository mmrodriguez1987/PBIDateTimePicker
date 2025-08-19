import { DateRangeType, IDateRange } from "../settings";
import { IDateRangeCalculator } from "../interfaces/IDateRangeCalculator";
/**
 * Implementation of date range calculation service
 * Single Responsibility: Calculate different types of date ranges
 * Open/Closed Principle: Open for extension (new range types), closed for modification
 */
export declare class DateRangeCalculator implements IDateRangeCalculator {
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
    /**
     * Subtract days from a given date
     * @param date The base date
     * @param days Number of days to subtract
     * @returns New date with days subtracted
     */
    private subtractDays;
    /**
     * Format date for display purposes
     * @param date The date to format
     * @returns Formatted date string
     */
    formatDate(date: Date): string;
    /**
     * Get display text for date range type
     * @param rangeType The range type
     * @returns Display text for the range type
     */
    getRangeTypeDisplayText(rangeType: DateRangeType): string;
}
