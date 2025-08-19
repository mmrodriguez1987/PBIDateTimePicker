/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Date Slicer Settings Card
 * Responsible for configuring the date slicer behavior and appearance
 */
class DateSlicerSettings extends FormattingSettingsCard {
    /**
     * Default date range selection (Last 7 Days, Last 30 Days, Last 90 Days, Custom)
     */
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

    /**
     * Enable/Disable debug mode for troubleshooting
     */
    debugMode = new formattingSettings.ToggleSwitch({
        name: "debugMode",
        displayName: "Enable Debug Mode",
        value: false
    });

    /**
     * Primary color for the slicer UI
     */
    primaryColor = new formattingSettings.ColorPicker({
        name: "primaryColor",
        displayName: "Primary Color",
        value: { value: "#0078d4" }
    });

    /**
     * Secondary color for buttons and accents
     */
    secondaryColor = new formattingSettings.ColorPicker({
        name: "secondaryColor",
        displayName: "Secondary Color",
        value: { value: "#106ebe" }
    });

    /**
     * Font size for the slicer text
     */
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 14,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: 8
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 24
            }
        }
    });

    name: string = "dateSlicerSettings";
    displayName: string = "Date Slicer Settings";
    slices: Array<FormattingSettingsSlice> = [
        this.defaultRange,
        this.debugMode,
        this.primaryColor,
        this.secondaryColor,
        this.fontSize
    ];
}

/**
 * Visual formatting settings model class
 * Single Responsibility: Manages all formatting settings for the visual
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dateSlicerSettings = new DateSlicerSettings();

    cards = [this.dateSlicerSettings];
}

/**
 * Enum for predefined date ranges
 */
export enum DateRangeType {
    Last7Days = "last7days",
    Last30Days = "last30days",
    Last90Days = "last90days",
    Custom = "custom"
}

/**
 * Interface for date range data
 */
export interface IDateRange {
    startDate: Date;
    endDate: Date;
    type: DateRangeType;
}
