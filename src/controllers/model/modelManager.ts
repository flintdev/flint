// src/controllers/model/modelManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';

interface Config {
    models: Array<object>
}

interface ModelData {
    name: string,
    editorData: object | undefined
}

const INITIAL_CONFIG: Config = {
    models: [],
};

export class ModelManager {
    rootDir: string;
    fsHelper: FSHelper;
    dirPath: string;
    configPath: string;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
        this.dirPath = `${this.rootDir}/.flint/models`;
        this.configPath = `${this.rootDir}/.flint/models/config.json`;
    }

    checkAndCreateModelDir = async () => {
        // should be called at models UI loaded
        try {
            await this.fsHelper.checkPathExists(this.dirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.dirPath);
        }
    };

    createModel = async (modelName: string) => {

        const result = await this.checkAndCreateModelConfigFile();
        if (!result) return false;
        let configJson = await this.fetchConfigData();
        configJson.models.push(modelName);
        await this.saveConfigData(configJson);
    };

    getModelList = async () => {
        const modelList: string[] = [];
        const configJson = await this.fetchConfigData();
        if (!configJson.models) return modelList;
        return configJson.models;
    };

    getEditorData = async (modelName: string) => {
        const configJson = await this.fetchConfigData();
        return _.get(configJson, ['editorDataMap', modelName]);
    };

    private checkAndCreateModelConfigFile = async () => {
        try {
            await this.fsHelper.checkPathExists(this.configPath);
            return true
        } catch (err) {
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