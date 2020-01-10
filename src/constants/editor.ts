// src/constants/editor.ts

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

export const MVCViews = [
    {key: MVC.Model, name: 'Models'},
    {key: MVC.View, name: 'Views'},
    {key: MVC.Controller, name: 'Controllers'},
];
