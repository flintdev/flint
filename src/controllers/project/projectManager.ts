// src/controllers/project/projectManager.ts

import {FSHelper} from "../utils/fsHelper";

export class ProjectManager {
    rootDir: string;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
    }

    initializeProjectFiles = () => {

    };

    updateRecentProjects = () => {

    };

    getProjectName = () => {
        const projectName: string = this.rootDir.split('/')[-1];
        return projectName;
    };

    private createConfigFile = () => {

    };
}

