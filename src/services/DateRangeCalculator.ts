/*
 *  Power BI Date Slicer Visual
 *  
 *  Date Range Calculator Implementation
 *  Single Responsibility: Handle all date range calculations
 *  
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

import { DateRangeType, IDateRange } from "../settings";
import { IDateRangeCalculator } from "../interfaces/IDateRangeCalculator";

/**
 * Implementation of date range calculation service
 * Single Responsibility: Calculate different types of date ranges
 * Open/Closed Principle: Open for extension (new range types), closed for modification
 */
export class DateRangeCalculator implements IDateRangeCalculator {
    
    /**
     * Calculate date range based on predefined types
     * @param rangeType The type of date range to calculate
     * @returns IDateRange object with start and end dates
     */
    public calculateDateRange(rangeType: DateRangeType): IDateRange {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of day
        
        let startDate: Date;
        const endDate = new Date(today);

        switch (rangeType) {
            case DateRangeType.Last7Days:
                startDate = this.subtractDays(today, 7);
                break;
            case DateRangeType.Last30Days:
                startDate = this.subtractDays(today, 30);
                break;
            case DateRangeType.Last90Days:
                startDate = this.subtractDays(today, 90);
                break;
            case DateRangeType.Custom:
            default:
                // For custom, return today as both start and end
                startDate = new Date(today);
                break;
        }

        startDate.setHours(0, 0, 0, 0); // Set to start of day

        return {
            startDate,
            endDate,
            type: rangeType
        };
    }

    /**
     * Create custom date range
     * @param startDate Start date for the range
     * @param endDate End date for the range
     * @returns IDateRange object with custom dates
     */
    public createCustomRange(startDate: Date, endDate: Date): IDateRange {
        const adjustedStartDate = new Date(startDate);
        const adjustedEndDate = new Date(endDate);
        
        adjustedStartDate.setHours(0, 0, 0, 0);
        adjustedEndDate.setHours(23, 59, 59, 999);

        return {
            startDate: adjustedStartDate,
            endDate: adjustedEndDate,
            type: DateRangeType.Custom
        };
    }

    /**
     * Validate if a date range is valid
     * @param dateRange The date range to validate
     * @returns True if valid, false otherwise
     */
    public isValidDateRange(dateRange: IDateRange): boolean {
        if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
            return false;
        }

        return dateRange.startDate <= dateRange.endDate;
    }

    /**
     * Subtract days from a given date
     * @param date The base date
     * @param days Number of days to subtract
     * @returns New date with days subtracted
     */
    private subtractDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    /**
     * Format date for display purposes
     * @param date The date to format
     * @returns Formatted date string
     */
    public formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Get display text for date range type
     * @param rangeType The range type
     * @returns Display text for the range type
     */
    public getRangeTypeDisplayText(rangeType: DateRangeType): string {
        switch (rangeType) {
            case DateRangeType.Last7Days:
                return "Last 7 Days";
            case DateRangeType.Last30Days:
                return "Last 30 Days";
            case DateRangeType.Last90Days:
                return "Last 90 Days";
            case DateRangeType.Custom:
                return "Custom Range";
            default:
                return "Unknown Range";
        }
    }
}
