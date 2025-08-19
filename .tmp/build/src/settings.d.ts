import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Date Slicer Settings Card
 * Responsible for configuring the date slicer behavior and appearance
 */
declare class DateSlicerSettings extends FormattingSettingsCard {
    /**
     * Default date range selection (Last 7 Days, Last 30 Days, Last 90 Days, Custom)
     */
    defaultRange: formattingSettings.ItemDropdown;
    /**
     * Enable/Disable debug mode for troubleshooting
     */
    debugMode: formattingSettings.ToggleSwitch;
    /**
     * Primary color for the slicer UI
     */
    primaryColor: formattingSettings.ColorPicker;
    /**
     * Secondary color for buttons and accents
     */
    secondaryColor: formattingSettings.ColorPicker;
    /**
     * Font size for the slicer text
     */
    fontSize: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Visual formatting settings model class
 * Single Responsibility: Manages all formatting settings for the visual
 */
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dateSlicerSettings: DateSlicerSettings;
    cards: DateSlicerSettings[];
}
/**
 * Enum for predefined date ranges
 */
export declare enum DateRangeType {
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
export {};
