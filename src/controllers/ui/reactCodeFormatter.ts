// src/controllers/ui/reactCodeFormatter.ts

import {ComponentData} from "@flintdev/ui-editor/dist/interface";
import ComponentWithChildren from './templates/component-with-children.txt';
import ComponentWithoutChildren from './templates/component-without-children.txt';
import * as Mustache from "mustache";

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
        const codeStrList: string[] = this.components.map(componentData => this.recurToGetCodeStr(12, componentData));
        return {
            widgets: this.widgetList.map(name => {return {name}}),
            actions: this.actionList.map(name => {return {name}}),
            code: codeStrList.join('\n'),
        }
    };

    recurToGetCodeStr = (parentIndent: number, componentData: ComponentData): string => {
        const {name, params, events, children, tag} = componentData;
        if (!this.widgetList.includes(name)) this.widgetList.push(name);
        const paramsStr = this.generateParamsStr(parentIndent + 4, params);
        const eventsStr = !!events ? this.generateEventsStr(parentIndent + 4, events) : '';
        let kvList: string[] = [];
        // params
        kvList.push(`params={${paramsStr}}\n`);
        // events
        if (!!events && events.length > 0) kvList.push(`events={${eventsStr}}\n`);
        // tag
        if (!!tag) kvList.push(`tag={"${tag}"}\n`);
        let codeStr = '';
        if (!!children && children.length > 0) {
            const childCodeStrList: string[] = children.map(child => this.recurToGetCodeStr(parentIndent + 4, child));
            codeStr = Mustache.render(ComponentWithChildren, {name, kvList, children: childCodeStrList.join('\n')});
        } else {
            codeStr = Mustache.render(ComponentWithoutChildren, {name, kvList});
        }
        return this.reformatStringWithIndent(parentIndent, codeStr);
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
        return `{\n${paramsStr}}`;
    };

    generateEventsStr = (indent: number, events: any[]): string => {
        let eventsStr = '';
        const space = new Array(indent).fill(' ');
        events.forEach(item => {
            const {event, action} = item;
            if (!this.actionList.includes(action)) this.actionList.push(action);
            eventsStr += `${space}${event}: this.props.${action},\n`;
        });
        return `{${eventsStr}}`;
    };

    private reformatStringWithIndent = (indent: number, text: string): string => {
        const space = new Array(indent).fill(' ');
        const tempList = text.split('\n').map(line => space + line);
        return`${tempList.join('\n')}`;
    };

}