// src/electron/utils/starterMenuBuilder.ts

import {app, Menu, dialog, BrowserWindow, shell} from 'electron';
const isMac = process.platform === 'darwin';

export class StarterMenuBuilder {
    window: BrowserWindow;
    constructor(window: BrowserWindow) {
        this.window = window;
    }

    build = () => {
        this.initMenu();
    };

    private initMenu = () => {
        const menuTemplate: any = [
            this.getEditMenu(),
            this.getViewMenu(),
            this.getWindowMenu(),
            this.getHelpMenu(),
        ];
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    };

    private getEditMenu = () => {
        return {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        }
    };

    private getViewMenu = () => {
        return {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    };

    private getWindowMenu = () => {
        return {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        }
    };

    private getHelpMenu = () => {
        return {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://github.com/flintdev/flint')
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Dev Tools',
                    click: () => {
                        this.window.webContents.openDevTools();
                    }
                }
            ]
        }
    };

}