// src/controllers/model/modelManager.ts

import {FSHelper} from "../utils/fsHelper";

export class ModelManager {
    rootDir: string;
    fsHelper: FSHelper;

    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    checkAndCreateModelDir = () => {
        const modelDirPath = `${this.rootDir}/.flint/models`;
        this.fsHelper.checkPathExists(modelDirPath)
            .then(() => {
            })
            .catch(err => {
                this.fsHelper.createDirByPath(modelDirPath)
                    .then(() => {

                    });
            });
    };
}