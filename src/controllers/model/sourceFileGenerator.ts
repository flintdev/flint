// src/controllers/model/sourceFileGenerator.ts

import {FSHelper} from "../utils/fsHelper";
import {ModelManager} from "./modelManager";
import {SpecGenerator} from "./specGenerator";
import {DataConverter} from "./dataConverter";

interface File {
    path: string,
    content: string,
}

export class SourceFileGenerator {
    fsHelper = new FSHelper();
    sourceDirPath: string;
    modelManager: ModelManager;
    constructor(rootDir: string) {
        this.sourceDirPath = `${rootDir}/src/models`;
        this.modelManager = new ModelManager(rootDir);
    }

    generate = async () => {
        await this.generateCRDSpecs();
    };

    private generateCRDSpecs = async () => {
        const models = await this.modelManager.getModelList();
        let files: File[] = [];
        for (const modelName of models) {
            const editorData = await this.modelManager.getEditorData(modelName);
            if (!editorData) continue;
            const schemaData = new DataConverter(editorData, modelName).convertToOpenAPISchema();
            const crdSpecYaml = new SpecGenerator().renderCRDSpecYaml(modelName, schemaData);
            files.push({
                path: `${this.sourceDirPath}/${modelName}.yaml`,
                content: crdSpecYaml
            });
        }
        await this.batchToCreateFiles(files);
    };

    private removeSourceDir = async () => {
        await this.fsHelper.removeDir(this.sourceDirPath);
    };

    private checkAndCreateDir = async (dir: string) => {
        try {
            await this.fsHelper.checkPathExists(dir);
        } catch (e) {
            await this.fsHelper.createDirByPath(dir);
        }
    };

    private batchToCreateFiles = async (files: File[]) => {
        for (const file of files) {
            const {path, content} = file;
            await this.fsHelper.createFile(path, content);
        }
    };
}