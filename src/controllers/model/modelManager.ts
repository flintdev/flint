// src/controllers/model/modelManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';

interface Config {
    models: Array<object>
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

    checkAndCreateModelDir = () => {
        // should be called at models UI loaded
        this.fsHelper.checkPathExists(this.dirPath)
            .then(() => {
            })
            .catch(err => {
                this.fsHelper.createDirByPath(this.dirPath)
                    .then(() => {

                    });
            });
    };

    createModel = async (modelName: string) => {
        const result = await this.checkAndCreateModelConfigFile();
        if (!result) return false;
        let configJson = await this.fetchConfigData();
        configJson.models.push(modelName);
        await this.saveConfigData(configJson);
    };

    private checkAndCreateModelConfigFile = async () => {
        try {
            await this.fsHelper.checkPathExists(this.configPath);
            return false;
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