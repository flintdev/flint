// src/controllers/ui/sourceFileGenerator.ts
// generate UI/React source files

import {UIDataManager, UIData} from "./uiDataManager";
import {FSHelper} from "../utils/fsHelper";
import BabelRC from './templates/babelrc.txt';
import IndexHTML from './templates/index-html.txt';
import PackageJSON from './templates/package-json.txt';
import WebpackConfig from './templates/webpack-config.txt';
import ReduxStoreJS from './templates/redux-store-js.txt';
import ReduxActionsJS from './templates/redux-actions-js.txt';
import ReduxReducerJS from './templates/redux-reducer-js.txt';
import ReduxTypesJS from './templates/redux-types-js.txt';
import * as Mustache from "mustache";
import * as _ from 'lodash';
import {ProjectManager} from "../project/projectManager";
import {StateUpdaterData} from "@flintdev/ui-editor/dist/interface";

interface File {
    path: string,
    content: string,
}

export class SourceFileGenerator {
    uiDataManager: UIDataManager;
    fsHelper: FSHelper;
    editorData: UIData;
    sourceDirPath: string;
    projectName: string;
    projectManager: ProjectManager;
    constructor(rootDir: string) {
        this.uiDataManager = new UIDataManager(rootDir);
        this.projectManager = new ProjectManager(rootDir);
        this.fsHelper = new FSHelper();
        this.sourceDirPath = `${rootDir}/src/ui`;
        this.projectName = this.projectManager.getProjectName();
    }

    loadEditorData = async () => {
        this.editorData = await this.uiDataManager.getUIData();
    };

    checkAndCreateDir = async (dir: string) => {
        try {
            await this.fsHelper.checkPathExists(dir);
        } catch (e) {
            await this.fsHelper.createDirByPath(dir);
        }
    };

    generate = async () => {
        await this.removeSourceDir();
        await this.checkAndCreateDir(this.sourceDirPath);
        await this.loadEditorData();
        await this.generateConfigFiles();
        await this.generateReduxFiles();
    };

    private removeSourceDir = async () => {
        await this.fsHelper.removeDir(this.sourceDirPath);
    };

    private generateConfigFiles = async () => {
        let files: File[] = [];
        // webpack.config.js
        files.push({
            path: `${this.sourceDirPath}/webpack.config.js`,
            content: WebpackConfig
        });
        // package.json
        files.push({
            path: `${this.sourceDirPath}/package.json`,
            content: Mustache.render(PackageJSON, {projectName: this.projectName}),
        });
        // .babelrc
        files.push({
            path: `${this.sourceDirPath}/.babelrc`,
            content: BabelRC
        });
        // index.html
        files.push({
            path: `${this.sourceDirPath}/index.html`,
            content: Mustache.render(IndexHTML, {projectName: this.projectName})
        });
        await this.batchToCreateFiles(files);
    };

    private generateComponentFiles = async () => {
        let files: File[] = [];

    };

    private generateReduxFiles = async () => {
        const {initialState, stateUpdaters} = this.editorData;
        const reduxDir = `${this.sourceDirPath}/redux`;
        await this.checkAndCreateDir(reduxDir);
        let files: File[] = [];
        const updaters = this.reformatUpdaters(stateUpdaters);
        // redux actions.js
        files.push({
            path: `${reduxDir}/actions.js`,
            content: Mustache.render(ReduxActionsJS, {updaters}),
        });
        // redux reducer.js
        files.push({
            path: `${reduxDir}/reducer.js`,
            content: Mustache.render(ReduxReducerJS, {updaters}),
        });
        // redux types.js
        files.push({
            path: `${reduxDir}/types.js`,
            content: Mustache.render(ReduxTypesJS, {updaters}),
        });
        // redux store.js
        files.push({
            path: `${reduxDir}/store.js`,
            content: ReduxStoreJS,
        });
        // redux state.js
        files.push({
            path: `${reduxDir}/state.js`,
            content: initialState,
        });
        await this.batchToCreateFiles(files);
    };

    private reformatUpdaters = (stateUpdaters: StateUpdaterData[]) => {
        return stateUpdaters.map((updater: StateUpdaterData) => {
            let data = {};
            updater.operations.forEach(operation => {
                const {field, operator, parameter} = operation;
                const path = field.split('.').slice(1);
                _.set(data, path, {[`$${operator.toLowerCase()}`]: `action.args.${parameter}`})
            });
            let dataStr = JSON.stringify(data, null, 4).replace(/"/gi, '');
            const tempList = dataStr.split('\n');
            dataStr = `${tempList.join(`\n${new Array(12).fill(' ').join('')}`)}`;
            return {
                name: updater.name,
                actionName: _.camelCase(updater.name),
                data: dataStr,
            }
        })
    };

    private batchToCreateFiles = async (files: File[]) => {
        for (const file of files) {
            const {path, content} = file;
            await this.fsHelper.createFile(path, content);
        }
    };
}