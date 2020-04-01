// src/electron/utils/autoUpdater.ts

import {app, dialog, BrowserWindow} from 'electron';
import {autoUpdater} from "electron-updater";

export class AutoUpdater {
    mainWindow: BrowserWindow;
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    initEventListeners = () => {
        autoUpdater.on('checking-for-update', () => {
            console.log('checking-for-update');
        });
        autoUpdater.on('update-available', (info) => {
            console.log('update-available', info)
        });
        autoUpdater.on('update-not-available', (info) => {
            console.log('update-not-available', info)
        });
        autoUpdater.on('download-progress', (progressObj) => {
            console.log('download-progress', progressObj);
        });
        autoUpdater.on('update-downloaded', (info) => {
            console.log('update-downloaded', info);
        });
        autoUpdater.on('error', (err) => {
            console.log('error', err);
        });
    };

    removeAllListeners = () => {
        autoUpdater.removeAllListeners();
    };

    checkForUpdates = async () => {
        try {
            await autoUpdater.checkForUpdates()
        } catch (e) {
            console.log('err - check for updates', e);
        }
    };
}