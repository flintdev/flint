// src/controllers/mainProcessCommunicator.ts

const {ipcRenderer} = require('electron');
import {CHANNEL} from "../constants";

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


}