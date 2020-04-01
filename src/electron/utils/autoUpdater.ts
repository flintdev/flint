// src/electron/utils/autoUpdater.ts

import {app, dialog, BrowserWindow} from 'electron';
import {autoUpdater} from "electron-updater";

export class AutoUpdater {
    mainWindow: BrowserWindow;
    interval: any;
    updateAlert: boolean = false;
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    initEventListeners = () => {
        autoUpdater.on('checking-for-update', () => {
            console.log('checking-for-update');
        });
        autoUpdater.on('update-available', (info) => {
            console.log('update-available', info);
            if (this.updateAlert) this.showUpdateAvailableDialog().then(r => {});
        });
        autoUpdater.on('update-not-available', (info) => {
            console.log('update-not-available', info);
            if (this.updateAlert) this.showNoUpdateDialog().then(r => {});
        });
        autoUpdater.on('download-progress', (progressObj) => {
            console.log('download-progress', progressObj);
        });
        autoUpdater.on('update-downloaded', (info) => {
            console.log('update-downloaded', info);
            this.showDownloadedDialog().then(r => {});
        });
        autoUpdater.on('error', (err) => {
            console.log('error', err);
        });
    };

    stop = () => {
        autoUpdater.removeAllListeners();
        if (!!this.interval) clearInterval(this.interval);
    };

    checkForUpdates = async (alert?: boolean) => {
        this.updateAlert = !!alert;
        try {
            await autoUpdater.checkForUpdates();
            this.interval = setInterval(async () => {
                await autoUpdater.checkForUpdates();
            }, 10*60*1000);
        } catch (e) {
            console.log('err - check for updates', e);
        }
    };

    showDownloadedDialog = async () => {
        const options: any = {
            type: 'info',
            buttons: ['Install & Relaunch', 'Later'],
            defaultId: 0,
            cancelId: 1,
            title: 'Update Flint',
            message: 'New version of Flint is available',
            detail: 'The new version has been downloaded. Relaunch the application to apply the updates.'
        };
        const result: Electron.MessageBoxReturnValue = await dialog.showMessageBox(options);
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    };

    showNoUpdateDialog = async () => {
        const options = {
            type: 'info',
            button: ['Ok'],
            defaultId: 0,
            cancelId: 0,
            title: 'Check updates',
            message: 'Your are up-to-date!',
            detail: 'You already have the latest version of Flint installed already.'
        };
        await dialog.showMessageBox(options);
    };

    showUpdateAvailableDialog = async () => {
        const options = {
            type: 'info',
            button: ['Ok'],
            defaultId: 0,
            cancelId: 0,
            title: 'Update available',
            message: 'New version of Flint is available',
            detail: 'New version is being downloaded in background. You will be prompted when it is downloaded.'
        };
        await dialog.showMessageBox(options);
    };
}