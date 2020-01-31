// src/controllers/model/modelManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";
import {SpecGenerator} from "./specGenerator";
import {edit} from "ace-builds";

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
    sourceDirPath: string;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
        this.dirPath = `${this.rootDir}/.flint/models`;
        this.configPath = `${this.rootDir}/.flint/models/config.json`;
        this.sourceDirPath = `${this.rootDir}/src/models`;
    }

    checkAndCreateModelDir = async () => {
        // should be called at models UI loaded
        try {
            await this.fsHelper.checkPathExists(this.dirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.dirPath);
        }
    };

    checkAndCreateSourceDir = async () => {
        try {
            await this.fsHelper.checkPathExists(this.sourceDirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.sourceDirPath);
        }
    };

    createModel = async (modelName: string) => {
        const result = await this.checkAndCreateModelConfigFile();
        if (!result) return false;
        let configJson = await this.fetchConfigData();
        configJson.models.push(modelName);
        await this.saveConfigData(configJson);
    };

    deleteModel = async (modelName: string) => {
        let configJson = await this.fetchConfigData();
        let {models, editorDataMap, revision} = configJson;
        // remove from models
        _.remove(models, (model: string) => model === modelName);
        // remove from editorDataMap
        editorDataMap = _.omit(editorDataMap, [modelName]);
        revision = _.omit(revision, [modelName]);
        _.set(configJson, ['editorDataMap'], editorDataMap);
        _.set(configJson, ['models'], models);
        _.set(configJson, ['revision'], revision);
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

    getRevision = async (modelName: string) => {
        const configJson = await this.fetchConfigData();
        const revision =  _.get(configJson, ['revision', modelName]);
        const editor = !!revision?.editor ? revision.editor : 1;
        const source = !!revision?.source ? revision.source : 0;
        return {editor, source};
    };

    saveEditorData = async (modelName: string, editorData: EditorData) => {
        let configJson = await this.fetchConfigData();
        _.set(configJson, ['editorDataMap', modelName], editorData);
        let editorRevision = _.get(configJson, ['revision', modelName, 'editor']);
        editorRevision = !!editorRevision ? editorRevision + 1 : 1;
        _.set(configJson, ['revision', modelName, 'editor'], editorRevision);
        await this.saveConfigData(configJson);
    };

    generateSourceFiles = async (modelName: string, schemaData: SchemaData) => {
        const crdSpecYaml = new SpecGenerator().renderCRDSpecYaml(modelName, schemaData);
        await this.checkAndCreateSourceDir();
        const filePath = `${this.sourceDirPath}/${modelName}.yaml`;
        await this.fsHelper.createFile(filePath, crdSpecYaml);
        await this.syncSourceRevision(modelName);
    };

    private syncSourceRevision = async (modelName: string) => {
        const configJson = await this.fetchConfigData();
        const {editor} = await this.getRevision(modelName);
        _.set(configJson, ['revision', modelName, 'editor'], editor);
        _.set(configJson, ['revision', modelName, 'source'], editor);
        await this.saveConfigData(configJson);
    };

    private checkAndCreateModelConfigFile = async () => {
        try {
            await this.fsHelper.checkPathExists(this.configPath);
            return true;
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