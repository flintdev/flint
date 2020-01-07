// src/controllers/mainProcessCommunicator.ts

const {ipcRenderer} = require('electron');
import {CHANNEL} from "../constants";

export enum Error {
    CANCELLED,
}

export class MainProcessCommunicator {

    switchFromStarterToEditorWindow = () => {
        // open editor window and close starter window
        return new Promise((resolve, reject) => {
            ipcRenderer.send(CHANNEL.OPEN_EDITOR_AND_CLOSE_STARTER)
                .then(() => {
                    resolve()
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    };

    selectDirectory = () => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.SELECT_DIRECTORY_REPLY, (event: object, arg: Array<string>) => {
                const filePaths = arg;
                if (filePaths.length > 0) resolve(filePaths[0]);
                else reject(Error.CANCELLED);
            });
            ipcRenderer.send(CHANNEL.SELECT_DIRECTORY);
        });
    };

}