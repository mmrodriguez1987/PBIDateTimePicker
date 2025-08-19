import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var mDCDateTimePicker7C1D2202FB0B4C51A0E6FA961EBF229C_DEBUG: IVisualPlugin = {
    name: 'mDCDateTimePicker7C1D2202FB0B4C51A0E6FA961EBF229C_DEBUG',
    displayName: 'MDCDateTimePicker',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["mDCDateTimePicker7C1D2202FB0B4C51A0E6FA961EBF229C_DEBUG"] = mDCDateTimePicker7C1D2202FB0B4C51A0E6FA961EBF229C_DEBUG;
}
export default mDCDateTimePicker7C1D2202FB0B4C51A0E6FA961EBF229C_DEBUG;