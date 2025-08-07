class DateSettingsSettings {
    public dateColumn: string = "";
    public startDate: string = "";
    public endDate: string = "";
}

class AppearanceSettings {
    public showTitle: boolean = true;
    public titleText: string = "Date Range Filter";
    public titleColor: string = "#000000";
}

class VisualSettings {
    public dateSettings: DateSettingsSettings = new DateSettingsSettings();
    public appearance: AppearanceSettings = new AppearanceSettings();
}
