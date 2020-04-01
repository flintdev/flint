// src/controllers/mainProcessCommunicator.ts

import {ipcRenderer} from 'electron';
import {CHANNEL} from "../constants";

export enum Error {
    CANCELLED,
    INVALID_PROJECT_DIR
}

export class MainProcessCommunicator {

    switchFromStarterToEditorWindow = (projectDir: string) => {
        // open editorWindow window and close starterWindow window
        return new Promise((resolve, reject) => {
            ipcRenderer.send(CHANNEL.OPEN_EDITOR_AND_CLOSE_STARTER, projectDir);
            resolve();
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

    receiveProjectDir = () => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.SEND_PROJECT_DIR, (event: object, arg: string) => {
                const projectDir = arg;
                if (!projectDir) reject(Error.INVALID_PROJECT_DIR);
                else resolve(projectDir);
            });
        });
    };

    initGlobalListeners = () => {
        ipcRenderer.on(CHANNEL.CONSOLE, ((event, args) => {
            console.log(args);
        }));
    };

}