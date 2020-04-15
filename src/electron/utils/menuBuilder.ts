// src/electron/utils/menuBuilder.ts

import {app, Menu, dialog, BrowserWindow, shell} from 'electron';
import {version} from 'pjson';
import {AutoUpdater} from "./autoUpdater";

const isMac = process.platform === 'darwin';

interface Options {
    autoUpdater: AutoUpdater
}

export class MenuBuilder {
    mainWindow: BrowserWindow;
    autoUpdater: AutoUpdater;
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    build = (options: Options) => {
        this.autoUpdater = options.autoUpdater;
        this.initMenu();
    };

    private initMenu = () => {
        const menuTemplate: any = [
            this.getMainMenu(),
            this.getEditMenu(),
            this.getViewMenu(),
            this.getWindowMenu(),
            this.getHelpMenu(),
        ];
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    };

    private getMainMenu = () => {
        return {
            label: 'Flint',
            submenu: [
                {
                    label: 'About Flint',
                    click: this.showFlintInfoDialog
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }
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
                {
                    label: 'Check For Updates',
                    click: async () => {
                        await this.autoUpdater.checkForUpdates(true);
                        await this.autoUpdater.checkForPluginUpdates();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Dev Tools',
                    click: () => {
                        this.mainWindow.webContents.openDevTools();
                    }
                }
            ]
        }
    };

    showFlintInfoDialog = async () => {
        const options = {
            type: 'info',
            buttons: ['Ok'],
            defaultId: 0,
            cancelId: 0,
            title: 'About Flint',
            message: `Current version: v${version}`,
            detail: 'More info: https://github.com/flintdev/flint'
        };
        await dialog.showMessageBox(options);
    }
}

