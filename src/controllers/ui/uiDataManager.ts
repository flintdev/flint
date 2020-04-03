// src/controllers/ui/uiDataManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';
import {ActionData, ComponentData, SettingsData, StateUpdaterData} from "@flintdev/ui-editor/dist/interface";

const INITIAL_CONFIG = {};

export interface UIData {
    actions: ActionData[],
    stateUpdaters: StateUpdaterData[],
    initialState: string,
    components: ComponentData[],
    settings: SettingsData,
}

export class UIDataManager {
    rootDir: string;
    fsHelper: FSHelper;
    dirPath: string;
    configPath: string;
    sourceDirPath: string;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
        this.dirPath = `${this.rootDir}/.flint/ui`;
        this.configPath = `${this.rootDir}/.flint/ui/config.json`;
        this.sourceDirPath = `${this.rootDir}/src/ui`;
    }

    checkAndCreateUIDir = async () => {
        try {
            await this.fsHelper.checkPathExists(this.dirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.dirPath);
        }
        await this.checkAndCreateUIConfigFile();
    };

    getUIData = async () => {
        return await this.getEditorData();
    };

    saveUIData = async (data: UIData) => {
        await this.saveEditorData(data);
    };

    private getEditorData = async () => {
        const configJson = await this.fetchConfigData();
        return _.get(configJson, ['editorDataMap', 'default']);
    };

    private saveEditorData = async (editorData: any) => {
        let configJson = await this.fetchConfigData();
        _.set(configJson, ['editorDataMap', 'default'], editorData);
        await this.saveConfigData(configJson);
    };

    private checkAndCreateUIConfigFile = async () => {
        try {
            await this.fsHelper.checkPathExists(this.configPath);
            return true;
        } catch (e) {
            await this.fsHelper.createFile(this.configPath, JSON.stringify(INITIAL_CONFIG));
            return true;
        }
    };

    private fetchConfigData = async () => {
        const data = await this.fsHelper.readFile(this.configPath);
        return JSON.parse(<string>data);
    };

    private saveConfigData = async (configJson: object) => {
        await this.fsHelper.createFile(this.configPath, JSON.stringify(configJson));
        return true
    };


}