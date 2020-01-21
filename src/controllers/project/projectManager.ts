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
        const tempList = this.rootDir.split('/');
        return tempList[tempList.length - 1];
    };

    private createConfigFile = () => {

    };
}

