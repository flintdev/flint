// src/controllers/files/fileBrowser.ts

import {FSHelper} from "../utils/fsHelper";

export class FileBrowser {
    rootDir: string;
    fsHelper: FSHelper;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    getTreeData = async () => {
        await this.recurToGetChildrenFiles(this.rootDir);
    };

    private recurToGetChildrenFiles = async (parentPath: string) => {
        const files = this.fsHelper.readDir(parentPath);
        console.log(files);
    };
}