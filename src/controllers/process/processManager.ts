// src/controllers/process/processManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';
import {EditorData} from "@flintdev/model-editor/dist/interface";

interface Config {
    processes: object[]
}

const INITIAL_CONFIG: Config = {
    processes: []
};

export class ProcessManager {
    rootDir: string;
    fsHelper: FSHelper;
    dirPath: string;
    configPath: string;
    sourceDirPath: string;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
        this.dirPath = `${this.rootDir}/.flint/processes`;
        this.configPath = `${this.rootDir}/.flint/processes/config.json`;
        this.sourceDirPath = `${this.rootDir}/src/controllers`;
    }

    checkAndCreateProcessDir = async () => {
        try {
            await this.fsHelper.checkPathExists(this.dirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.dirPath);
        }
    };

    createProcess = async (processName: string) => {
        if (!await this.checkAndCreateProcessConfigFile()) return false;
        let configJson = await this.fetchConfigData();
        configJson.processes.push(processName);
        await this.saveConfigData(configJson);
    };

    deleteProcess = async (processName: string) => {
        let configJson = await this.fetchConfigData();
        let {processes, editorDataMap, revision} = configJson;
        // remove from processes
        _.remove(processes, (process: string) => process === processName);
        // remove from editorDataMap
        editorDataMap = _.omit(editorDataMap, [processName]);
        revision = _.omit(revision, [processName]);
        _.set(configJson, ['editorDataMap'], editorDataMap);
        _.set(configJson, ['processes'], processes);
        _.set(configJson, ['revision'], revision);
        await this.saveConfigData(configJson);
    };

    getProcessList = async () => {
        const processList: string[] = [];
        const configJson = await this.fetchConfigData();
        if (!configJson.processes) return processList;
        return configJson.processes;
    };

    getEditorData = async (processName: string) => {
        const configJson = await this.fetchConfigData();
        return _.get(configJson, ['editorDataMap', processName]);
    };

    getRevision = async (processName: string) => {
        const configJson = await this.fetchConfigData();
        const revision =  _.get(configJson, ['revision', processName]);
        const editor = !!revision?.editor ? revision.editor : 1;
        const source = !!revision?.source ? revision.source : 0;
        return {editor, source};
    };

    saveEditorData = async (processName: string, editorData: any) => {
        let configJson = await this.fetchConfigData();
        _.set(configJson, ['editorDataMap', processName], editorData);
        let editorRevision = _.get(configJson, ['revision', processName, 'editor']);
        editorRevision = !!editorRevision ? editorRevision + 1 : 1;
        _.set(configJson, ['revision', processName, 'editor'], editorRevision);
        await this.saveConfigData(configJson);
    };

    private checkAndCreateProcessConfigFile = async () => {
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