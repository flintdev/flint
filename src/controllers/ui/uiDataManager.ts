// src/controllers/ui/uiDataManager.ts

import {FSHelper} from "../utils/fsHelper";
import * as _ from 'lodash';
import {
    ActionData,
    ComponentData,
    PerspectiveData,
    SettingsData,
    StateUpdaterData
} from "@flintdev/ui-editor/dist/interface";
import {UI_DATA_SCHEMA_VERSION} from "../../constants/data";

const INITIAL_CONFIG = {};

export interface UIData {
    actions: ActionData[],
    stateUpdaters: StateUpdaterData[],
    schemaEditorData: any, // the editor data to define data structure of global state.
    initialState: string,
    components: ComponentData[],
    settings: SettingsData,
    perspectives: PerspectiveData[],
}

export class UIDataManager {
    rootDir: string;
    fsHelper: FSHelper;
    dirPath: string;
    configPath: string;
    sourceDirPath: string;
    plugins: string[]; // for recurToGetPlugins function only
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
        this.dirPath = `${this.rootDir}/.flint/ui`;
        this.configPath = `${this.rootDir}/.flint/ui/config.json`;
        this.sourceDirPath = `${this.rootDir}/src/ui`;
        this.plugins = [];
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

    fetchConfigData = async () => {
        try {
            const data = await this.fsHelper.readFile(this.configPath);
            return JSON.parse(<string>data);
        } catch (err) {
            return null;
        }
    };

    saveConfigData = async (configJson: object) => {
        _.set(configJson, ['schemaVersion'], UI_DATA_SCHEMA_VERSION);
        await this.fsHelper.createFile(this.configPath, JSON.stringify(configJson));
        return true
    };

    getDependentPlugins = async () => {
        try {
            const uiData: UIData = await this.getUIData();
            const components = uiData.components;
            this.plugins = [];
            this.recurToGetPlugins(components);
            return this.plugins;
        } catch (e) {
            return [];
        }
    };

    private recurToGetPlugins = (children?: ComponentData[]) => {
        if (!children) return;
        children.forEach(component => {
            const pluginId = component.name.split('::')[0];
            if (!this.plugins.includes(pluginId)) {
                this.plugins.push(pluginId);
            }
            this.recurToGetPlugins(component.children);
        })
    };


}