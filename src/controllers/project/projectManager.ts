// src/controllers/project/projectManager.ts

import {FSHelper} from "../utils/fsHelper";
import {LocalStorageManager} from "../localStoreManager";

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

    static UpdateRecentProjects = (projectDir: string) => {
        const projectDirs = new LocalStorageManager().getRecentProjects();
        let newProjectDirs = [projectDir];
        projectDirs.forEach(dir => {
            if (dir !== projectDir) newProjectDirs.push(dir);
        });
        new LocalStorageManager().setRecentProjects(newProjectDirs);
    };

    static GetRecentProjects = () => {
        const getProjectNameByPath = (projectDir: string) => {
            const tempList = projectDir.split('/');
            return tempList[tempList.length - 1];
        };
        const projectDirs = new LocalStorageManager().getRecentProjects();
        return projectDirs.map(dir => {
            return {
                name: getProjectNameByPath(dir),
                path: dir,
            }
        });
    };

    static RemoveRecentProject = (projectDir: string) => {
        let projectDirs = new LocalStorageManager().getRecentProjects();
        const index = projectDirs.indexOf(projectDir);
        projectDirs.splice(index, 1);
        new LocalStorageManager().setRecentProjects(projectDirs);
    };

    getProjectName = () => {
        const tempList = this.rootDir.split('/');
        return tempList[tempList.length - 1];
    };

}

