// src/controllers/process/sourceFileGenerator.ts

import {EditorData, EditorNode} from "@flintdev/process-editor/dist";
import {ModelManager} from "../model/modelManager";
import {FSHelper} from "../utils/fsHelper";
import {ProcessManager} from "./processManager";
import MainGoTemplate from './templates/main-go.txt';
import InitGoTemplate from './templates/init-go.txt';
import GoModTemplate from './templates/go-mod.txt';
import ConfigGoTemplate from './templates/config-go.txt';
import DefinitionGoTemplate from './templates/definition-go.txt';
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
        await this.removeSourceDir();
        await this.checkAndCreateDir(this.sourceDirPath);
        await this.generateWorkflowConfig();
        await this.generateMainFile();
        await this.generateGoModFile();
        await this.generateFilesOfSteps();
        await this.generateInitGoFile();
        await this.generateTriggerFile();
        await this.generateWorkflowDefinition();
    };

    private removeSourceDir = async () => {
        await this.fsHelper.removeDir(this.sourceDirPath);
    };

    private generateFilesOfSteps = async () => {
        for (const node of Object.values(this.editorData.nodes)) {
            if (node.data.type === StepType.CODE_BLOCK) {
                const {label, code} = node.data;
                const stepName = _.camelCase(label);
                const stepDirPath = `${this.sourceDirPath}/workflows/${this.processName}/steps/${stepName}`;
                await this.checkAndCreateDir(stepDirPath);
                const filePath = `${stepDirPath}/${stepName}.go`;
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
        let definition: any = {
            name: this.processName,
        };
        let steps: any = {};
        for (const node of Object.values(this.editorData.nodes)) {
            if (node.data.type === StepType.TRIGGER) {
                const nextSteps = this.getNextSteps(node);
                definition['startAt'] = nextSteps[0].name;
            } else if (node.data.type === StepType.END) {
                const stepName = _.camelCase(node.data.label);
                steps[stepName] = {nextSteps: []};
            } else {
                const stepName = _.camelCase(node.data.label);
                const nextSteps = this.getNextSteps(node);
                steps[stepName] = {nextSteps};
            }
        }
        definition['steps'] = steps;
        const content = Mustache.render(DefinitionGoTemplate, {
            json: JSON.stringify(definition, null, 4),
            package: this.processName
        });
        const filePath = `${workflowDir}/definition.go`;
        await this.fsHelper.createFile(filePath, content);
    };

    private getNextSteps = (node: any) => {
        let nextSteps: any[] = [];
        const {outputs} = node.data;
        outputs.forEach((output: any) => {
            const {name, condition} = output;
            node.outputs[name].connections.forEach((node: any) => {
                const nodeId = node.node;
                let result: any = {name: _.camelCase(this.editorData.nodes[nodeId].data.label)};
                if (!!condition && condition.operator !== 'always') result['condition'] = condition;
                nextSteps.push(result);
            });
        });
        return nextSteps;
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
        const processList = await this.processManager.getProcessList();
        const data = processList.map((processName: string) => {
            return {name: processName}
        });
        const content = Mustache.render(MainGoTemplate, {workflows: data});
        const filePath = `${this.sourceDirPath}/main.go`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateGoModFile = async () => {
        const content = GoModTemplate;
        const filePath = `${this.sourceDirPath}/go.mod`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateWorkflowConfig = async () => {
        const workflowsDirPath = `${this.sourceDirPath}/workflows`;
        await this.checkAndCreateDir(workflowsDirPath);
        const modelList = await this.modelManager.getModelList();
        let gvr: any = {};
        modelList.forEach((modelName: string) => {
            const singular: string = modelName.toLowerCase();
            const plural = `${modelName.toLowerCase()}s`;
            gvr[singular] = {
                group: 'flintapp.io',
                version: 'v1',
                resource: plural
            };
        });
        const configJson = JSON.stringify({gvr}, null, 4);
        const content = Mustache.render(ConfigGoTemplate, {configJson});
        const filePath = `${workflowsDirPath}/config.go`;
        await this.fsHelper.createFile(filePath, content);
    };
}