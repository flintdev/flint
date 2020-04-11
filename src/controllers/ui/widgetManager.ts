// src/controllers/ui/widgetManager.ts
import * as library from '@flintdev/material-widgets';
import {ComponentData} from "@flintdev/ui-editor/dist/interface";
import * as _ from 'lodash';
import {Param} from "@flintdev/ui-editor/dist/components/ParamFormGenerator/interface";

console.log('library', library);
// @ts-ignore
const {widgetInfo, getWidgetConfiguration, getWidget} = library;

export class WidgetManager {
    constructor() {

    }

    getWidgetNameList = () => {
        return Object.keys(widgetInfo).sort();
    };

    getWidgetData = (name: string): ComponentData => {
        const config = getWidgetConfiguration(name);
        // @ts-ignore
        const {params, canvas} = config;
        let values: any = {};
        params.forEach((param: Param) => {
            param.items.forEach(item => {
                const {key, defaultValue} = item;
                values[key] = defaultValue;
            })
        });
        return {
            id: this.generateUniqueId(),
            name,
            params: values,
            children: [],
            canvas
        }
    };

    private generateUniqueId = () => {
        const timestamp = (new Date()).getTime().toString(36);
        return `${timestamp}${_.uniqueId()}`;
    };
}