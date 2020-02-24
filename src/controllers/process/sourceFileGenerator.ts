// src/controllers/process/sourceFileGenerator.ts

import {EditorData} from "@flintdev/process-editor";
import {Output} from "./processDataHandler";
import {ModelManager} from "../model/modelManager";
import {FSHelper} from "../utils/fsHelper";
import {ProcessManager} from "./processManager";
import MainGoTemplate from './templates/main-go.txt';
import * as Mustache from "mustache";

export class SourceFileGenerator {
    processName: string;
    editorData: EditorData;
    modelManager: ModelManager;
    processManager: ProcessManager;
    fsHelper: FSHelper;
    sourceDirPath: string;
    constructor(processName: string, editorData: EditorData, rootDir: string) {
        this.processName = processName;
        this.editorData = editorData;
        this.modelManager = new ModelManager(rootDir);
        this.processManager = new ProcessManager(rootDir);
        this.fsHelper = new FSHelper();
        this.sourceDirPath = `${rootDir}/src/controllers`;
    }

    checkAndCreateSourceDir = async () => {
        try {
            await this.fsHelper.checkPathExists(this.sourceDirPath);
        } catch (e) {
            await this.fsHelper.createDirByPath(this.sourceDirPath);
        }
    };

    generate = async () => {
        await this.checkAndCreateSourceDir();
        await this.generateWorkflowConfig();
        await this.generateMainFile();
    };

    private generateStepFile = async (stepName: string, code: string) => {

    };

    private generateWorkflowDefinition = async (stepName: string, outputs: Output[]) => {

    };

    private generateMainFile = async () => {
        const modelList = await this.modelManager.getModelList();
        const data = modelList.map((modelName: string) => {
            return {name: modelName.toLowerCase()}
        });
        const content = Mustache.render(MainGoTemplate, {workflows: data});
        const filePath = `${this.sourceDirPath}/main.go`;
        console.log(filePath, content);
        await this.fsHelper.createFile(filePath, content);
    };

    private generateWorkflowConfig = async () => {
        const modelList = await this.modelManager.getModelList();
        let gvr: any = {};
        modelList.forEach((modelName: string) => {
            const singular: string = modelName.toLowerCase();
            const plural = `${modelName.toLowerCase()}s`;
            gvr[singular] = {
                group: 'flintapp',
                version: 'v1',
                resources: plural
            };
        });
        const configJson = {gvr};
        const filePath = `${this.sourceDirPath}/config.json`;
        await this.fsHelper.createFile(filePath, JSON.stringify(configJson, null, 4));
    };
}