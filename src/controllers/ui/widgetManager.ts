// src/controllers/ui/widgetManager.ts
import {getWidgetConfiguration, getWidget, widgetInfo} from '@flintdev/material-widgets';
import {ComponentData} from "@flintdev/ui-editor/dist/interface";
import * as _ from 'lodash';
import {Param} from "@flintdev/ui-editor/dist/components/ParamFormGenerator/interface";

export class WidgetManager {
    constructor() {

    }

    getWidgetNameList = () => {
        return Object.keys(widgetInfo).sort();
    };

    getWidgetData = (name: string): ComponentData => {
        const config = getWidgetConfiguration(name);
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