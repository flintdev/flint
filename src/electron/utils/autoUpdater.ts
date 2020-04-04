// src/electron/utils/autoUpdater.ts

import {app, dialog, BrowserWindow} from 'electron';
import {autoUpdater} from "electron-updater";
import {CHANNEL} from "../constants";

export class AutoUpdater {
    mainWindow: BrowserWindow;
    interval: any;
    updateAlert: boolean = false;
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    initEventListeners = () => {
        autoUpdater.on('checking-for-update', () => {
            this.consoleLog('checking-for-update');
        });
        autoUpdater.on('update-available', (info) => {
            this.consoleLog('update-available');
            this.consoleLog(info);
            if (this.updateAlert) this.showUpdateAvailableDialog().then(r => {});
        });
        autoUpdater.on('update-not-available', (info) => {
            this.consoleLog('update-not-available');
            this.consoleLog(info);
            if (this.updateAlert) this.showNoUpdateDialog().then(r => {});
        });
        autoUpdater.on('download-progress', (progressObj) => {
            console.log('download-progress', progressObj);
            this.consoleLog('download-progress');
            this.consoleLog(progressObj);
            // if (progressObj.percent === 100) {
            //     this.showDownloadedDialog().then(r => {});
            // }
        });
        autoUpdater.on('update-downloaded', (info) => {
            this.consoleLog('update-downloaded');
            this.consoleLog(info);
            this.showDownloadedDialog().then(r => {});
        });
        autoUpdater.on('error', (err) => {
            console.log('error', err);
            this.consoleLog('error');
            this.consoleLog(err);
        });
    };

    private consoleLog = (message: any) => {
        this.mainWindow.webContents.send(CHANNEL.CONSOLE, message);
    };

    stop = () => {
        autoUpdater.removeAllListeners();
        if (!!this.interval) clearInterval(this.interval);
    };

    checkForUpdates = async (alert?: boolean) => {
        this.updateAlert = !!alert;
        if (!!this.interval) clearInterval(this.interval);
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
            // @ts-ignore
            app.quiting = true;
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