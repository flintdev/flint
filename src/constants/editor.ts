// src/constants/editorWindow.ts

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