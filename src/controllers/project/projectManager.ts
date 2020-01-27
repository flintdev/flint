// src/controllers/project/projectManager.ts

import {FSHelper} from "../utils/fsHelper";

export class ProjectManager {
    rootDir: string;
    fsHelper: FSHelper;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    createProjectDir = async () => {
        await this.fsHelper.createDirByPath(this.rootDir);
    };

    initializeProjectFiles = async () => {
        const configDirPath = `${this.rootDir}/.flint`;
        await this.fsHelper.createDirByPath(configDirPath);
        return true;
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

