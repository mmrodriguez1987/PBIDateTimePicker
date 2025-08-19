"use strict";

import powerbi from "powerbi-visuals-api";
import * as models from "powerbi-models";

import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

interface IDateRange {
    startDate: Date;
    endDate: Date;
}
interface IDateColumnInfo {
    displayName: string; 
    queryName: string; 
    minDate?: Date; 
    maxDate?: Date;
}
interface IFilterService { 
    applyFilter(dateRange: IDateRange): void; 
    clearFilter(): void; 
    setDateColumn(column: IDateColumnInfo | null): void; 
}
interface IMessageService { 
    showSuccess(message: string): void; 
    showError(message: string): void; 
}
interface IUIComponent { 
    render(container: HTMLElement): void; 
    update(data?: any): void; 
}

enum PredefinedRange {
    LATEST_7_DAYS = 7, 
    LATEST_30_DAYS = 30, 
    LATEST_90_DAYS = 90, 
    CUSTOM = 0 
}

class DateUtils {
    static formatDate(date: Date): string {
        if (!date) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    static parseDate(input: any): Date {
        if (!input) return new Date(NaN);
        if (input instanceof Date) return new Date(input.getFullYear(), input.getMonth(), input.getDate());
        const s = String(input).trim();
        const mIso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (mIso) return new Date(+mIso[1], +mIso[2] - 1, +mIso[3]);
        const mSl = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mSl) {
            const a = +mSl[1], b = +mSl[2], y = +mSl[3];
            const ddFirst = a > 12;
            const d = ddFirst ? a : b;
            const mo = ddFirst ? b : a;
            return new Date(y, mo - 1, d);
        }
        const d = new Date(s);
        if (isNaN(d.getTime())) return new Date(NaN);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    static getDateRange(range: PredefinedRange, maxDate?: Date): IDateRange {
        const endDate = maxDate || new Date();
        const startDate = new Date(endDate);
        if (range !== PredefinedRange.CUSTOM) startDate.setDate(endDate.getDate() - range);
        return { startDate, endDate };
    }
    static isValidDateRange(start: Date, end: Date): boolean { return start <= end; }
    static findMinMaxDates(arr: any[]) {
        if (!arr || !arr.length) return { minDate: null as Date | null, maxDate: null as Date | null };
        let min: Date | null = null, max: Date | null = null;
        for (const v of arr) {
            const dt = DateUtils.parseDate(v);
            if (!isNaN(dt.getTime())) { if (!min || dt < min) min = dt; if (!max || dt > max) max = dt; }
        }
        return { minDate: min, maxDate: max };
    }
}

class MessageService implements IMessageService {
    constructor(private messageDiv: HTMLDivElement) { }
    showSuccess(m: string) { this.show(m, false); }
    showError(m: string) { this.show(m, true); }
    private show(text: string, isError: boolean) {
        this.messageDiv.textContent = text;
        this.messageDiv.style.display = "block";
        if (isError) { this.messageDiv.style.background = "#fed9cc"; this.messageDiv.style.border = "1px solid #d83b01"; this.messageDiv.style.color = "#d83b01"; }
        else { this.messageDiv.style.background = "#dff6dd"; this.messageDiv.style.border = "1px solid #107c10"; this.messageDiv.style.color = "#107c10"; }
        setTimeout(() => { this.messageDiv.style.display = "none"; }, 2500);
    }
}

class FilterService implements IFilterService {
    private dateColumn: IDateColumnInfo | null = null;
    
    constructor(private host: any, private messageService: IMessageService) { }
    setDateColumn(column: IDateColumnInfo | null): void { this.dateColumn = column; }

    private getTargetFromQueryName(qn: string, displayName: string): { table: string, column: string } {
        if (!qn) return { table: "Table", column: displayName || "Date" };
        if (qn.indexOf(".") >= 0) { const parts = qn.split("."); return { table: parts[0], column: parts[1] || displayName || "Date" }; }
        const m = qn.match(/^(.+)\[(.+)\]$/);
        if (m) return { table: m[1], column: m[2] };
        return { table: "Table", column: displayName || qn };
    }

    private formatDateForDirectQuery(date: Date, isStart: boolean): string {
        const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, "0"); const d = String(date.getDate()).padStart(2, "0");
        return isStart ? `${y}-${m}-${d}T00:00:00.000` : `${y}-${m}-${d}T23:59:59.999`;
    }

    
    private createAdvancedFilter(dateRange: IDateRange): models.AdvancedFilter | null {
        if (!this.dateColumn) return null;
        const targetObj = this.getTargetFromQueryName(this.dateColumn.queryName, this.dateColumn.displayName);
        const target: models.IFilterTarget = { table: targetObj.table, column: targetObj.column };
        const start = this.formatDateForDirectQuery(dateRange.startDate, true);
        const end = this.formatDateForDirectQuery(dateRange.endDate, false);
        const conditions: models.IAdvancedFilterCondition[] = [
            { operator: "GreaterThanOrEqual", value: start },
            { operator: "LessThanOrEqual", value: end }
        ];
        return new models.AdvancedFilter(target, "And", conditions);
    }
    applyFilter(dateRange: IDateRange): void {
        if (!this.dateColumn) { this.messageService.showError("Unable to apply filter - add a date field"); return; }
        try {
            const filter = this.createAdvancedFilter(dateRange);
            if (!filter) { this.messageService.showError("Filter couldn't be built"); return; }

            const MERGE = (powerbi as any).FilterAction?.merge ?? 0; // 0 = merge
            this.host.applyJsonFilter(filter, "general", "filter", MERGE);

            this.messageService.showSuccess("Filter applied successfully!");
        } catch (e) { /* eslint-disable no-console */ 
            console.error(e); 
            this.messageService.showError("Error applying filter."); }
    }
    clearFilter(): void {
        try {

            const REMOVE = (powerbi as any).FilterAction?.remove ?? 1; // 1 = remove
            this.host.applyJsonFilter(null, "general", "filter", REMOVE);

            this.messageService.showSuccess("All filters cleared - showing full data");
        } catch (e) { /* eslint-disable no-console */ console.error(e); this.messageService.showError("Error clearing filters."); }
    }
}

class PredefinedRangesComponent implements IUIComponent {
    private container!: HTMLElement;
    private selectedRange: PredefinedRange = PredefinedRange.LATEST_7_DAYS;
    constructor(private onRangeSelected: (r: PredefinedRange) => void) { }
    render(container: HTMLElement): void {
        this.container = container;
        const wrap = document.createElement("div"); wrap.style.cssText = "display:flex;flex-direction:column;gap:4px;margin-bottom:12px;";
        const title = document.createElement("div"); title.textContent = "Quick Select:"; title.style.cssText = "font-size:11px;font-weight:600;color:#323130;margin-bottom:6px;"; wrap.appendChild(title);
        const box = document.createElement("div"); box.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;"; wrap.appendChild(box);
        const defs = [
            { range: PredefinedRange.LATEST_7_DAYS, label: "Last 7 days" },
            { range: PredefinedRange.LATEST_30_DAYS, label: "Last 30 days" },
            { range: PredefinedRange.LATEST_90_DAYS, label: "Last 90 days" },
            { range: PredefinedRange.CUSTOM, label: "Custom" }
        ];
        defs.forEach(({ range, label }) => {
            const b = document.createElement("button"); b.textContent = label;
            const sel = range === this.selectedRange;
            b.style.cssText = `padding:4px 8px;border:1px solid ${sel ? "#0078d4" : "#605e5c"};background:${sel ? "#0078d4" : "#ffffff"};color:${sel ? "#ffffff" : "#323130"};border-radius:2px;font-size:10px;cursor:pointer;flex:1;min-width:60px;`;
            b.onclick = () => { this.selectedRange = range; this.onRangeSelected(range); Array.from(box.querySelectorAll("button")).forEach(btn => { (btn as HTMLButtonElement).style.border = "1px solid #605e5c"; (btn as HTMLButtonElement).style.background = "#ffffff"; (btn as HTMLButtonElement).style.color = "#323130"; }); b.style.border = "1px solid #0078d4"; b.style.background = "#0078d4"; b.style.color = "#ffffff"; };
            box.appendChild(b);
        });
        container.appendChild(wrap);
    }
    update(): void { }
}

class DateInputsComponent implements IUIComponent {
    private startDateInput!: HTMLInputElement; private endDateInput!: HTMLInputElement;
    private minDate: Date | null = null; private maxDate: Date | null = null;
    constructor(private onDateChange: (s: string, e: string) => void) { }
    render(container: HTMLElement): void {
        const form = document.createElement("div"); form.style.cssText = "display:flex;flex-direction:column;gap:8px;";
        const mk = (labelText: string, name: string) => {
            const c = document.createElement("div");
            const l = document.createElement("label"); l.textContent = labelText; l.style.cssText = "display:block;margin-bottom:3px;font-size:11px;font-weight:600;color:#323130;"; c.appendChild(l);
            const i = document.createElement("input"); i.type = "date"; i.name = name; i.style.cssText = "width:100%;padding:6px 8px;border:1px solid #605e5c;border-radius:2px;font-size:12px;box-sizing:border-box;"; c.appendChild(i);
            return { c, i };
        };
        const s = mk("Start Date:", "startDate"); this.startDateInput = s.i; this.startDateInput.addEventListener("change", () => this.onDateChange(this.startDateInput.value, this.endDateInput.value)); form.appendChild(s.c);
        const e = mk("End Date:", "endDate"); this.endDateInput = e.i; this.endDateInput.addEventListener("change", () => this.onDateChange(this.startDateInput.value, this.endDateInput.value)); form.appendChild(e.c);
        container.appendChild(form);
    }
    update(data?: { minDate?: Date; maxDate?: Date }): void {
        if (data) { this.minDate = data.minDate ?? null; this.maxDate = data.maxDate ?? null; this.applyConstraints(); }
    }
    setDateRange(startDate: Date, endDate: Date): void {
        this.startDateInput.value = DateUtils.formatDate(startDate);
        this.endDateInput.value = DateUtils.formatDate(endDate);
    }
    getDateRange(): IDateRange { return { startDate: DateUtils.parseDate(this.startDateInput.value), endDate: DateUtils.parseDate(this.endDateInput.value) }; }
    private applyConstraints(): void {
        if (this.minDate) { const s = DateUtils.formatDate(this.minDate); this.startDateInput.min = s; this.endDateInput.min = s; }
        if (this.maxDate) { const e = DateUtils.formatDate(this.maxDate); this.startDateInput.max = e; this.endDateInput.max = e; }
    }
}

export class DateTimePickerVisual implements IVisual {
    private host: any; private target: HTMLElement;
    private container!: HTMLDivElement; private messageDiv!: HTMLDivElement; private fieldInfo!: HTMLDivElement;
    private messageService!: IMessageService; private filterService!: IFilterService;
    private predefinedRangesComponent!: PredefinedRangesComponent; private dateInputsComponent!: DateInputsComponent;
    private dateColumn: IDateColumnInfo | null = null; private currentRange: PredefinedRange = PredefinedRange.LATEST_7_DAYS;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host; this.target = options.element;

        this.container = document.createElement("div");
        this.container.style.cssText = "padding:15px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#fff;border:1px solid #d1d1d1;border-radius:6px;height:100%;box-sizing:border-box;overflow:auto;";
        this.target.appendChild(this.container);

        const title = document.createElement("h3"); title.textContent = "Date Range Filter"; title.style.cssText = "margin:0 0 12px 0;color:#323130;font-size:14px;font-weight:600;padding-bottom:8px;border-bottom:1px solid #edebe9;"; this.container.appendChild(title);

        this.fieldInfo = document.createElement("div");
        this.fieldInfo.style.cssText = "margin-bottom:12px;padding:6px 10px;background:#fff4ce;border:1px solid #ffb900;border-radius:3px;font-size:11px;color:#8a8886;";
        this.fieldInfo.textContent = "Add a date field to the Fields area";
        this.container.appendChild(this.fieldInfo);

        this.messageDiv = document.createElement("div"); this.messageService = new MessageService(this.messageDiv);
        this.filterService = new FilterService(this.host, this.messageService);

        this.predefinedRangesComponent = new PredefinedRangesComponent((r) => this.handleRangeSelection(r)); this.predefinedRangesComponent.render(this.container);
        this.dateInputsComponent = new DateInputsComponent((s, e) => this.handleDateChange(s, e)); this.dateInputsComponent.render(this.container);

        const btnBox = document.createElement("div"); btnBox.style.cssText = "display:flex;gap:6px;margin:12px 0;";
        const applyBtn = document.createElement("button"); applyBtn.textContent = "Apply Filter"; applyBtn.style.cssText = "flex:1;padding:8px 12px;background:#0078d4;color:white;border:none;border-radius:2px;font-size:12px;font-weight:600;cursor:pointer;"; applyBtn.onclick = () => this.applyFilter(); btnBox.appendChild(applyBtn);
        const clearBtn = document.createElement("button"); clearBtn.textContent = "Show All Data"; clearBtn.style.cssText = "flex:1;padding:8px 12px;background:#8a8886;color:white;border:none;border-radius:2px;font-size:12px;font-weight:600;cursor:pointer;"; clearBtn.onclick = () => this.clearFilter(); btnBox.appendChild(clearBtn);
        this.container.appendChild(btnBox);

        this.messageDiv.style.cssText = "margin-top:8px;padding:6px 10px;border-radius:3px;font-size:11px;display:none;"; this.container.appendChild(this.messageDiv);
    }

    public update(options: VisualUpdateOptions): void {
        if (options?.viewport) { this.container.style.width = options.viewport.width + "px"; this.container.style.height = options.viewport.height + "px"; }
        this.updateDataColumnInfo(options);
    }

    private handleRangeSelection(range: PredefinedRange): void {
        this.currentRange = range;
        let startDate: Date, endDate: Date;
        if (range !== PredefinedRange.CUSTOM) {
            const maxRef = this.dateColumn?.maxDate || new Date();
            const r = DateUtils.getDateRange(range, maxRef);
            this.dateInputsComponent.setDateRange(r.startDate, r.endDate);
            startDate = r.startDate; endDate = r.endDate;
        } else {
            const r = this.dateInputsComponent.getDateRange(); startDate = r.startDate; endDate = r.endDate;
        }
        this.updateFieldInfoLabel(startDate, endDate);
    }

    private handleDateChange(start: string, end: string): void {
        if (start && end) {
            const s = DateUtils.parseDate(start); const e = DateUtils.parseDate(end);
            if (!DateUtils.isValidDateRange(s, e)) this.messageService.showError("Start date must be before end date");
            this.updateFieldInfoLabel(s, e);
        }
    }

    private updateFieldInfoLabel(startDate?: Date, endDate?: Date): void {
        if (this.dateColumn) {
            let label = `Connected to: ${this.dateColumn.displayName}`;
            if (startDate && endDate) label += ` | Selected: ${DateUtils.formatDate(startDate)} to ${DateUtils.formatDate(endDate)}`;
            else if (this.dateColumn.minDate && this.dateColumn.maxDate) label += ` | Range: ${DateUtils.formatDate(this.dateColumn.minDate)} to ${DateUtils.formatDate(this.dateColumn.maxDate)}`;
            this.fieldInfo.textContent = label;
            this.fieldInfo.style.background = "#dff6dd"; this.fieldInfo.style.borderColor = "#107c10"; this.fieldInfo.style.color = "#107c10";
        } else {
            this.fieldInfo.textContent = "Add a date field to the Fields area";
            this.fieldInfo.style.background = "#fff4ce"; this.fieldInfo.style.borderColor = "#ffb900"; this.fieldInfo.style.color = "#8a8886";
        }
    }

    private applyFilter(): void {
        const r = this.dateInputsComponent.getDateRange();
        if (!r.startDate || !r.endDate) { this.messageService.showError("Please select both start and end dates"); return; }
        if (!DateUtils.isValidDateRange(r.startDate, r.endDate)) { this.messageService.showError("Start date must be before end date"); return; }
        this.filterService.applyFilter(r);
    }

    private clearFilter(): void { this.filterService.clearFilter(); }

    private updateDataColumnInfo(options: VisualUpdateOptions): void {
        const dv: any = (options as any)?.dataViews?.[0];
        const cats: any[] | undefined = dv?.categorical?.categories as any[] | undefined;
        const metaCols: any[] = dv?.metadata?.columns || [];

        const pickMetaDateCol = () => metaCols.find(c =>
            (c?.roles && (c.roles["date"] || c.roles["category"])) && (c?.type?.dateTime || c?.type?.date)
        ) || metaCols.find(c => (c?.type?.dateTime || c?.type?.date));

        if (cats && cats.length) {
            const cat = cats.find(c => (c?.source?.roles && (c.source.roles["date"] || c.source.roles["category"])) ||
                (c?.source?.type && (c.source.type.dateTime || c.source.type.date))) || cats[0];
            this.dateColumn = { displayName: cat.source.displayName || "Date", queryName: cat.source.queryName || "" };
            const mm = DateUtils.findMinMaxDates(cat.values || []);
            this.dateColumn.minDate = mm.minDate || new Date(1900, 0, 1);
            this.dateColumn.maxDate = mm.maxDate || new Date(new Date().getFullYear() + 10, 11, 31);
        } else {
            const metaDate = pickMetaDateCol();
            if (metaDate) {
                this.dateColumn = { displayName: metaDate.displayName || "Date", queryName: metaDate.queryName || "" };
                // try to compute min/max from table rows
                let minDate: Date | null = null, maxDate: Date | null = null;
                const t = dv?.table;
                if (t?.rows && Array.isArray(t.rows) && metaCols.length) {
                    const idx = metaCols.indexOf(metaDate);
                    if (idx >= 0) {
                        const vals = t.rows.map((r: any[]) => r[idx]);
                        const mm = DateUtils.findMinMaxDates(vals);
                        minDate = mm.minDate; maxDate = mm.maxDate;
                    }
                }
                this.dateColumn.minDate = minDate || new Date(1900, 0, 1);
                this.dateColumn.maxDate = maxDate || new Date(new Date().getFullYear() + 10, 11, 31);
            } else {
                this.dateColumn = null;
            }
        }

        if (this.dateColumn) {
            this.dateInputsComponent.update({ minDate: this.dateColumn.minDate, maxDate: this.dateColumn.maxDate });
            const initial = DateUtils.getDateRange(PredefinedRange.LATEST_7_DAYS, this.dateColumn.maxDate);
            this.dateInputsComponent.setDateRange(initial.startDate, initial.endDate);
            this.filterService.setDateColumn(this.dateColumn);
            this.updateFieldInfoLabel();
        } else {
            this.filterService.setDateColumn(null);
            this.updateFieldInfoLabel();
        }
    }
}

export default DateTimePickerVisual;
