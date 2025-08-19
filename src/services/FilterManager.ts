/*
 *  Power BI Date Slicer Visual
 *  
 *  Filter Manager Implementation
 *  Single Responsibility: Handle all filter operations with Power BI
 *  
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

import powerbi from "powerbi-visuals-api";
import { IDateRange } from "../settings";
import { IFilterManager } from "../interfaces/IFilterManager";

import FilterAction = powerbi.FilterAction;

/**
 * Implementation of filter management service
 * Single Responsibility: Manage Power BI filters
 * Dependency Inversion: Depends on abstractions (interfaces), not concretions
 */
export class FilterManager implements IFilterManager {
    private dateColumnTarget: powerbi.data.ISQExpr | null = null;
    private dateColumnName: string | null = null;
    private tableQualifiedName: string | null = null;

    /**
     * Apply date filter to the report
     * @param dateRange Date range to apply as filter
     * @param host Power BI visual host for applying filters
     */
    public applyDateFilter(dateRange: IDateRange, host: powerbi.extensibility.visual.IVisualHost): void {
        try {
            if (!this.dateColumnTarget || !this.dateColumnName || !this.tableQualifiedName) {
                console.warn("No date column available for filtering");
                return;
            }

            if (!this.isValidDateRange(dateRange)) {
                console.error("Invalid date range provided for filtering");
                return;
            }

            // Create advanced filter for date range using proper schema
            const filter = {
                $schema: "https://powerbi.com/product/schema#advanced",
                target: {
                    table: this.tableQualifiedName,
                    column: this.dateColumnName
                },
                logicalOperator: "And",
                conditions: [
                    {
                        operator: "GreaterThanOrEqual",
                        value: dateRange.startDate.toISOString()
                    },
                    {
                        operator: "LessThanOrEqual",
                        value: dateRange.endDate.toISOString()
                    }
                ]
            };

            // Apply the filter
            host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);
            
            console.log(`Applied date filter: ${dateRange.startDate.toDateString()} to ${dateRange.endDate.toDateString()}`);
        } catch (error) {
            console.error("Error applying date filter:", error);
        }
    }

    /**
     * Clear all applied filters
     * @param host Power BI visual host for clearing filters
     */
    public clearFilters(host: powerbi.extensibility.visual.IVisualHost): void {
        try {
            // Simply apply null to remove all filters
            host.applyJsonFilter(null as any, "general", "filter", FilterAction.remove);
            
            console.log("Cleared all date filters");
        } catch (error) {
            console.error("Error clearing filters:", error);
        }
    }

    /**
     * Validate if date column is available for filtering
     * @param dataView Power BI data view
     * @returns True if date column is available, false otherwise
     */
    public hasDateColumn(dataView: powerbi.DataView): boolean {
        try {
            if (!dataView || !dataView.metadata || !dataView.metadata.columns) {
                return false;
            }

            // Look for date column in the data view
            const dateColumn = dataView.metadata.columns.find(column => 
                column.type && column.type.dateTime
            );

            if (dateColumn && dateColumn.expr) {
                this.dateColumnTarget = dateColumn.expr;
                this.dateColumnName = dateColumn.displayName || "Date";
                
                // Extract table name from the expression
                if (dateColumn.expr && (dateColumn.expr as any).source) {
                    this.tableQualifiedName = (dateColumn.expr as any).source.entity || "Table";
                }
                
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error checking for date column:", error);
            return false;
        }
    }

    /**
     * Private method to validate date range
     * @param dateRange The date range to validate
     * @returns True if valid, false otherwise
     */
    private isValidDateRange(dateRange: IDateRange): boolean {
        return dateRange && 
               dateRange.startDate instanceof Date && 
               dateRange.endDate instanceof Date &&
               dateRange.startDate <= dateRange.endDate;
    }

    /**
     * Get the current date column target
     * @returns The current date column target expression
     */
    public getDateColumnTarget(): powerbi.data.ISQExpr | null {
        return this.dateColumnTarget;
    }

    /**
     * Set the date column target manually
     * @param target The date column target expression
     * @param columnName The column name
     * @param tableName The table name
     */
    public setDateColumnTarget(target: powerbi.data.ISQExpr, columnName: string, tableName: string): void {
        this.dateColumnTarget = target;
        this.dateColumnName = columnName;
        this.tableQualifiedName = tableName;
    }
}
