// src/controllers/project/projectManager.ts

import {FSHelper} from "../utils/fsHelper";

export class ProjectManager {
    rootDir: string;
    fsHelper: FSHelper;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    initializeProjectFiles = () => {
        const configDirPath = `${this.rootDir}/.flint`;
        this.fsHelper.createDirByPath(configDirPath)
            .then(() => {

            })
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

