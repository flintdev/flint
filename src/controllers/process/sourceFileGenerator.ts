// src/controllers/process/sourceFileGenerator.ts

import {EditorData, EditorNode} from "@flintdev/process-editor/dist";
import {ModelManager} from "../model/modelManager";
import {FSHelper} from "../utils/fsHelper";
import {ProcessManager} from "./processManager";
// workflow engine templates
import MainGoTemplate from './templates/main-go.txt';
import InitGoTemplate from './templates/init-go.txt';
import GoModTemplate from './templates/go-mod.txt';
import ConfigGoTemplate from './templates/config-go.txt';
import DefinitionGoTemplate from './templates/definition-go.txt';
import WorkflowsManageSh from './templates/manage-sh.txt';
// python executors templates
import AppPyTemplate from './templates/executors/python/app-py.txt';
import PyManageShTemplate from './templates/executors/python/manage-sh.txt';
import RequirementsTemplate from './templates/executors/python/requirements.txt';
import InitPyTemplate from './templates/executors/python/init-py.txt';
//
import * as Mustache from "mustache";
import {StepType} from "../../containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/interface";
import * as _ from 'lodash';

interface File {
    path: string,
    content: string,
}

export class SourceFileGenerator {
    processNameList: string[] = [];
    editorDataMap: any = {};
    modelManager: ModelManager;
    processManager: ProcessManager;
    fsHelper: FSHelper;
    sourceDirPath: string;
    workflowEngineDirPath: string;
    executorsDirPath: string;
    constructor(rootDir: string) {
        this.modelManager = new ModelManager(rootDir);
        this.processManager = new ProcessManager(rootDir);
        this.fsHelper = new FSHelper();
        this.sourceDirPath = `${rootDir}/src/controllers`;
        this.workflowEngineDirPath = `${this.sourceDirPath}/workflowEngine`;
        this.executorsDirPath = `${this.sourceDirPath}/executors`;
    }

    loadData = async () => {
        this.processNameList = await this.processManager.getProcessList();
        for (const processName of this.processNameList) {
            this.editorDataMap[processName] = await this.processManager.getEditorData(processName);
        }
    };

    checkAndCreateDir = async (dir: string) => {
        try {
            await this.fsHelper.checkPathExists(dir);
        } catch (e) {
            await this.fsHelper.createDirByPath(dir);
        }
    };

    generate = async () => {
        await this.loadData();
        await this.removeSourceDir();
        await this.checkAndCreateDir(this.sourceDirPath);
        await this.checkAndCreateDir(this.workflowEngineDirPath);
        await this.checkAndCreateDir(this.executorsDirPath);
        await this.generateWorkflowEngine();
        await this.generateExecutors();
    };

    private generateWorkflowEngine = async () => {
        await this.generateWorkflowConfig();
        await this.generateMainFile();
        await this.generateGoModFile();
        await this.generateInitGoFile();
        await this.generateWorkflowDefinition();
        await this.generateWorkflowManageSh();
    };

    private generateExecutors = async () => {
        const workflows = await this.generateFilesOfSteps();
        await this.generateRootFilesOfExecutors(workflows);
    };

    private removeSourceDir = async () => {
        await this.fsHelper.removeDir(this.sourceDirPath);
    };

    // generate executor files

    private generateRootFilesOfExecutors = async (workflows: any) => {
        let files: File[] = [];
        // app.py
        files.push({
            path: `${this.executorsDirPath}/app.py`,
            content: Mustache.render(AppPyTemplate, {
                workflowNames: this.processNameList.join(', '),
                workflows
            })
        });
        // manage.sh
        files.push({
            path: `${this.executorsDirPath}/manage.sh`,
            content: PyManageShTemplate,
        });
        // requirements.txt
        files.push({
            path: `${this.executorsDirPath}/requirements.txt`,
            content: RequirementsTemplate
        });
        await this.batchToCreateFiles(files);
    };

    private generateFilesOfSteps = async () => {
        let workflows = [];
        for (const processName of this.processNameList) {
            if (!this.editorDataMap[processName]) continue;
            const workflowDir = `${this.executorsDirPath}/workflows/${processName}`;
            await this.checkAndCreateDir(workflowDir);
            const editorData: EditorData = this.editorDataMap[processName];
            let stepNameList = [];
            for (const node of Object.values(editorData.nodes)) {
                if (node.data.type === StepType.CODE_BLOCK) {
                    const {label, code} = node.data;
                    const stepName = _.camelCase(label);
                    stepNameList.push(stepName);
                    const stepFilePath = `${workflowDir}/${stepName}.py`;
                    await this.fsHelper.createFile(stepFilePath, code);
                }
            }
            // create __init__.py
            const content = Mustache.render(InitPyTemplate, {
                stepNames: stepNameList.join(', '),
                steps: stepNameList.map(name => {return {name}})
            });
            const path = `${workflowDir}/__init__.py`;
            await this.fsHelper.createFile(path, content);
            //
            const steps = stepNameList.map(step => {return {step}});
            workflows.push({name: processName, steps});
        }
        return workflows;
    };

    // generate workflow engine files

    private generateWorkflowDefinition = async () => {
        for (const processName of this.processNameList) {
            if (!this.editorDataMap[processName]) continue;
            const workflowDir = `${this.workflowEngineDirPath}/workflows/${processName}`;
            await this.checkAndCreateDir(workflowDir);
            let definition: any = {
                name: processName,
            };
            const editorData: EditorData = this.editorDataMap[processName];
            let steps: any = {};
            for (let node of Object.values(editorData.nodes)) {
                if (node.data.type === StepType.TRIGGER) {
                    const nextSteps = this.getNextSteps(node, editorData);
                    definition['startAt'] = nextSteps[0].name;
                    definition['trigger'] = this.getTriggerData(node);
                } else if (node.data.type === StepType.END) {
                    const stepName = _.camelCase(node.data.label);
                    steps[stepName] = {nextSteps: []};
                } else {
                    const stepName = _.camelCase(node.data.label);
                    const nextSteps = this.getNextSteps(node, editorData);
                    steps[stepName] = {nextSteps};
                }
            }
            definition['steps'] = steps;
            const content = Mustache.render(DefinitionGoTemplate, {
                json: JSON.stringify(definition, null, 4),
                package: processName
            });
            const filePath = `${workflowDir}/definition.go`;
            await this.fsHelper.createFile(filePath, content);
        }
    };

    private getTriggerData = (node: any) => {
        return JSON.parse(node.data.code);
    }

    private getNextSteps = (node: any, editorData: EditorData) => {
        let nextSteps: any[] = [];
        const {outputs} = node.data;
        outputs.forEach((output: any) => {
            const {name, condition} = output;
            node.outputs[name].connections.forEach((node: any) => {
                const nodeId = node.node;
                let result: any = {name: _.camelCase(editorData.nodes[nodeId].data.label)};
                if (!!condition && condition.operator !== 'always') {
                    result['when'] = `${JSON.stringify(condition.key)} ${condition.operator} ${JSON.stringify(condition.value)}`;
                }
                nextSteps.push(result);
            });
        });
        return nextSteps;
    };

    private generateInitGoFile = async () => {
        for (const processName of this.processNameList) {
            if (!this.editorDataMap[processName]) continue;
            const workflowDir = `${this.workflowEngineDirPath}/workflows/${processName}`;
            await this.checkAndCreateDir(workflowDir);
            const content = Mustache.render(InitGoTemplate, {package: processName});
            const filePath = `${workflowDir}/init.go`;
            await this.fsHelper.createFile(filePath, content);
        }
    };

    private generateMainFile = async () => {
        const processList = await this.processManager.getProcessList();
        const data = processList.map((processName: string) => {
            return {name: processName}
        });
        const content = Mustache.render(MainGoTemplate, {workflows: data});
        const filePath = `${this.workflowEngineDirPath}/main.go`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateGoModFile = async () => {
        const content = GoModTemplate;
        const filePath = `${this.workflowEngineDirPath}/go.mod`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateWorkflowConfig = async () => {
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
        const filePath = `${this.workflowEngineDirPath}/config.go`;
        await this.fsHelper.createFile(filePath, content);
    };

    private generateWorkflowManageSh = async () => {
        const filePath = `${this.workflowEngineDirPath}/manage.sh`;
        await this.fsHelper.createFile(filePath, WorkflowsManageSh);
    };

    private batchToCreateFiles = async (files: File[]) => {
        for (const file of files) {
            const {path, content} = file;
            await this.fsHelper.createFile(path, content);
        }
    };
}