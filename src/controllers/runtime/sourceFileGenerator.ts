// src/controllers/runtime/sourceFileGenerator.ts

import {FSHelper} from "../utils/fsHelper";
import DockerComposeYaml from './templates/docker-compose-yaml.txt';
import * as Mustache from "mustache";
import * as _ from 'lodash';

interface File {
    path: string,
    content: string,
}

export class SourceFileGenerator {
    rootDir: string;
    fsHelper: FSHelper;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    generate = async () => {
        await this.removeFiles();
        await this.generateDockerComposeFile();
    };

    private removeFiles = async () => {
        const dirs = [
            `${this.rootDir}/docker-compose.yaml`,
        ];
        for (const dir of dirs) {
            await this.fsHelper.removeDir(dir)
        }
    };

    private generateDockerComposeFile = async () => {
        const files: File[] = [
            {
                path: `${this.rootDir}/docker-compose.yaml`,
                content: DockerComposeYaml
            }
        ];
        await this.batchToCreateFiles(files);
    };

    private batchToCreateFiles = async (files: File[]) => {
        for (const file of files) {
            const {path, content} = file;
            await this.fsHelper.createFile(path, content);
        }
    };
}