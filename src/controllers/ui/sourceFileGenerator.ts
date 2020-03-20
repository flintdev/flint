// src/controllers/ui/sourceFileGenerator.ts
// generate UI/React source files

import {UIDataManager, UIData} from "./uiDataManager";
import {FSHelper} from "../utils/fsHelper";
import BabelRC from './templates/babelrc.txt';
import IndexHTML from './templates/index-html.txt';
import PackageJSON from './templates/package-json.txt';
import WebpackConfig from './templates/webpack-config.txt';
import * as Mustache from "mustache";
import * as _ from 'lodash';

export class SourceFileGenerator {
    uiDataManager: UIDataManager;
    fsHelper: FSHelper;
    editorData: UIData;
    sourceDirPath: string;
    projectName: string;
    constructor(rootDir: string, projectName: string) {
        this.uiDataManager = new UIDataManager(rootDir);
        this.fsHelper = new FSHelper();
        this.sourceDirPath = `${rootDir}/src/ui`;
        this.projectName = projectName;
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
        await this.generateConfigFiles();
    };

    private removeSourceDir = async () => {
        await this.fsHelper.removeDir(this.sourceDirPath);
    };

    private generateConfigFiles = async () => {
        let files: any[] = [];
        // webpack.config.js
        files.push({
            path: `${this.sourceDirPath}/webpack.config.json`,
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

    private batchToCreateFiles = async (files: any[]) => {
        for (const file of files) {
            const {path, content} = file;
            await this.fsHelper.createFile(path, content);
        }
    };
}