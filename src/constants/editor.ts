// src/constants/editorWindow.ts

import {Output} from "../controllers/process/processDataHandler";

export enum Page {
    Editor,
    Files,
    Plugins,
    Delivery,
}

export const NavigationPages = [
    {key: Page.Editor, name: 'Editor'},
    {key: Page.Files, name: 'Files'},
    {key: Page.Plugins, name: 'Plugins'},
    {key: Page.Delivery, name: 'Delivery'},
];

export enum MVC {
    Model = 'model',
    View = 'view',
    Controller = 'controller'
}

export const MVCViews: Array<ModelView> = [
    {key: MVC.View, name: 'User Interface'},
    {key: MVC.Controller, name: 'Processes'},
    {key: MVC.Model, name: 'Data Models'},
];

export interface ModelView {
    key: MVC,
    name: string
}

export const AlwaysOutputs: Output[] = [
    {
        name: "Always",
        condition: {
            key: "",
            operator: 'always',
            value: ""
        }
    }
];
