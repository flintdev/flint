// src/electron/utils/debugHelper.ts

import {BrowserWindow} from 'electron';

export class DebugHelper {
    debugWindow: BrowserWindow;
    constructor(debugWindow: BrowserWindow) {
        this.debugWindow = debugWindow;
    }

    loadLocalStorage = async (localStorageItems: any[]) => {
        for (let item of localStorageItems) {
            const {key, value} = item;
            await this.debugWindow.webContents.executeJavaScript(`
                localStorage.setItem('${key}', '${value}');
            `);
        }
    };
}

