// controllers/utils/fsHelper.ts

const fs = window.require('fs');
const homedir = window.require('os').homedir();

export enum ErrorType {
    DirExists,
    DirNotExists,
}

export class FSHelper {
    createDirByPath = (path: string) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path)) {
                reject(ErrorType.DirExists);
            } else {
                fs.mkdirSync(path, {recursive: true});
                resolve();
            }
        });
    };

    checkPathExists = (path: string) => {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err: object, stats: object) => {
                if (!err) resolve();
                else reject(ErrorType.DirNotExists);
            });
        });
    };

    getDefaultPath = () => {
        return `${homedir}/Flint/untitled`;
    };

    getHomeDir = () => {
        return homedir;
    };

    getFileTree = (rootDirPath: string) => {

    };
}