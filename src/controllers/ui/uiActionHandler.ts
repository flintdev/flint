// src/controllers/ui/uiActionHandler.ts

import {FSHelper} from "../utils/fsHelper";

const TEMP_ACTION_FILE_PATH = '/tmp/flint-action.js'

export class UIActionHandler {
    fsHelper: FSHelper = new FSHelper();
    writeToTempActionFile = async (code: string) => {
        await this.fsHelper.createFile(TEMP_ACTION_FILE_PATH, code);
    };

    readTempActionFile = async () => {
        const code = await this.fsHelper.readFile(TEMP_ACTION_FILE_PATH);
        return code;
    };

    getVSCodeURL = () => {
        return `vscode://file${TEMP_ACTION_FILE_PATH}`;
    };
}