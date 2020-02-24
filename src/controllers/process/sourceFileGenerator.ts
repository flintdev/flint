// src/controllers/process/sourceFileGenerator.ts

import {EditorData} from "@flintdev/process-editor/dist";
import {ModelManager} from "../model/modelManager";
import {FSHelper} from "../utils/fsHelper";
import {ProcessManager} from "./processManager";
import MainGoTemplate from './templates/main-go.txt';
import InitGoTemplate from './templates/init-go.txt';
import * as Mustache from "mustache";
import {StepType} from "../../containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/interface";
import * as _ from 'lodash';

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

    checkAndCreateDir = async (dir: string) => {
        try {
            await this.fsHelper.checkPathExists(dir);
        } catch (e) {
            await this.fsHelper.createDirByPath(dir);
        }
    };

    generate = async () => {
        await this.checkAndCreateDir(this.sourceDirPath);
        await this.generateWorkflowConfig();
        await this.generateMainFile();
        await this.generateFilesOfSteps();
        await this.generateInitGoFile();
        await this.generateTriggerFile();
    };

    private generateFilesOfSteps = async () => {
        const stepsDirPath = `${this.sourceDirPath}/workflows/${this.processName}/steps`;
        await this.checkAndCreateDir(stepsDirPath);
        for (const node of Object.values(this.editorData.nodes)) {
            if (node.data.type === StepType.CODE_BLOCK) {
                const {label, code} = node.data;
                const stepName = _.camelCase(label);
                const filePath = `${stepsDirPath}/${stepName}.go`;
                await this.fsHelper.createFile(filePath, code);
            }
        }
    };

    private generateTriggerFile = async () => {
        const workflowDir = `${this.sourceDirPath}/workflows/${this.processName}`;
        await this.checkAndCreateDir(workflowDir);
        for (const node of Object.values(this.editorData.nodes)) {
            if (node.data.type === StepType.TRIGGER) {
                const {label, code} = node.data;
                const filePath = `${workflowDir}/trigger.go`;
                await this.fsHelper.createFile(filePath, code);
            }
        }
    };

    private generateWorkflowDefinition = async () => {
        const workflowDir = `${this.sourceDirPath}/workflows/${this.processName}`;
        await this.checkAndCreateDir(workflowDir);
    };

    private generateInitGoFile = async () => {
        const workflowDir = `${this.sourceDirPath}/workflows/${this.processName}`;
        await this.checkAndCreateDir(workflowDir);
        let steps = [];
        for (const node of Object.values(this.editorData.nodes)) {
            if (node.data.type === StepType.CODE_BLOCK) {
                const {label} = node.data;
                const stepName = _.camelCase(label);
                steps.push({name: stepName});
            }
        }
        const content = Mustache.render(InitGoTemplate, {steps, package: this.processName});
        const filePath = `${workflowDir}/init.go`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateMainFile = async () => {
        const modelList = await this.modelManager.getModelList();
        const data = modelList.map((modelName: string) => {
            return {name: modelName.toLowerCase()}
        });
        const content = Mustache.render(MainGoTemplate, {workflows: data});
        const filePath = `${this.sourceDirPath}/main.go`;
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