// src/controllers/ui/reactCodeFormatter.ts

import {ComponentData} from "@flintdev/ui-editor/dist/interface";
import ComponentWithChildren from './templates/component-with-children.txt';
import ComponentWithoutChildren from './templates/component-without-children.txt';
import RepeatComponent from './templates/repeat-component.txt';
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
        const codeStrList: string[] = this.components.map(componentData => this.recurToGetCodeStr(4, componentData));
        let code = codeStrList.join('\n');
        code = this.reformatStringWithIndent(12, code);
        return {
            widgets: this.widgetList.map(name => {return {name}}),
            actions: this.actionList.map(name => {return {name}}),
            code
        }
    };

    recurToGetCodeStr = (parentIndent: number, componentData: ComponentData): string => {
        const {name, params, events, children, display, repeat, tag} = componentData;
        if (!this.widgetList.includes(name)) this.widgetList.push(name);
        const paramsStr = this.generateParamsStr(params);
        const eventsStr = !!events ? this.generateEventsStr(events) : '';
        let kvList: any[] = [];
        // key
        if (!!repeat) kvList.push({kv: `key={index}`});
        // params
        kvList.push({kv: `params={${paramsStr}}`});
        // events
        if (!!events && events.length > 0) kvList.push({kv: `events={${eventsStr}}`});
        // tag
        if (!!tag) kvList.push({kv: `tag={"${tag}"}`});
        let codeStr = '';
        // generate react component string
        if (!!children && children.length > 0) {
            const childCodeStrList: string[] = children.map(child => this.recurToGetCodeStr(parentIndent, child));
            codeStr = Mustache.render(ComponentWithChildren, {name, kvList, children: childCodeStrList.join('\n')});
        } else {
            codeStr = Mustache.render(ComponentWithoutChildren, {name, kvList});
        }
        // repeat component
        if (!!repeat) {
            const {fieldPath} = repeat as any;
            const path = this.getDataPath(fieldPath);
            codeStr = this.reformatStringWithIndent(8, codeStr);
            codeStr = Mustache.render(RepeatComponent, {path, code: codeStr}, {}, ['<%', '%>']);
        }
        return this.reformatStringWithIndent(parentIndent, codeStr);
    };

    generateParamsStr = (params: any): string => {
        let paramsStr = '';
        const space = new Array(8).fill(' ').join('');
        const space2 = new Array(4).fill(' ').join('');
        Object.keys(params).forEach(key => {
            let value: string = params[key];
            if (typeof value === "string" && value.includes('state::')) {
                const statePath = value.split('::')[1];
                paramsStr += `${space}${key}: ${this.getDataPath(statePath)},\n`;
            } else {
                if (typeof value === "string") value = `"${value}"`;
                paramsStr += `${space}${key}: ${value},\n`;
            }
        });
        return `{\n${paramsStr}${space2}}`;
    };

    generateEventsStr = (events: any[]): string => {
        let eventsStr = '';
        const space = new Array(8).fill(' ').join('');
        const space2 = new Array(4).fill(' ').join('');
        events.forEach(item => {
            const {event, action} = item;
            if (!this.actionList.includes(action)) this.actionList.push(action);
            eventsStr += `${space}${event}: this.props.${action},\n`;
        });
        return `{\n${eventsStr}${space2}}`;
    };

    private reformatStringWithIndent = (indent: number, text: string): string => {
        const space = new Array(indent).fill(' ').join('');
        const tempList = text.split('\n').map(line => space + line);
        return`${tempList.join('\n')}`;
    };

    private getDataPath = (fieldPath: string) => {
        const parts = fieldPath.split('.');
        let path = parts.slice(1).join('.');
        let head = 'item';
        if (parts[0] === '$') head = 'state';
        return `${head}.${path}`;
    };

}