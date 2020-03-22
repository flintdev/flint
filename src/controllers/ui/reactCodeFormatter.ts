// src/controllers/ui/reactCodeFormatter.ts

import {ComponentData} from "@flintdev/ui-editor/dist/interface";

export class ReactCodeFormatter {
    components: ComponentData[];
    widgetList: string[];
    actionList: string[];
    constructor(components: ComponentData[]) {
        this.components = components;
        this.widgetList = [];
        this.actionList = [];
    }

    getRenderData = () => {

    };

    recurToGetCodeStr = (parentIndent: number, componentData: ComponentData): string => {
        const {name, params, events, children, tag} = componentData;
        const paramsStr = this.generateParamsStr(parentIndent + 4, params);
        const eventsStr = !!events ? this.generateEventsStr(parentIndent + 4, events) : '';
        const space = new Array(parentIndent).fill(' ');
        if (!!children && children.length > 0) {

        } else {

        }
    };

    generateParamsStr = (indent: number, params: any): string => {
        let paramsStr = '';
        const space = new Array(indent).fill(' ');
        Object.keys(params).forEach(key => {
            const value: string = params[key];
            if (value.includes('state::')) {
                const statePath = value.split('::')[1];
                paramsStr += `${space}${key}: state.${statePath.split('.').slice(1).join('.')},\n`
            } else {
                paramsStr += `${space}${key}: "${value}",\n`
            }
        });
        return `{${paramsStr}}`;
    };

    generateEventsStr = (indent: number, events: any[]): string => {
        let eventsStr = '';
        const space = new Array(indent).fill(' ');
        events.forEach(item => {
            const {event, action} = item;
            eventsStr += `${space}${event}: this.props.${action},\n`;
        });
        return `{${eventsStr}}`;
    };

}