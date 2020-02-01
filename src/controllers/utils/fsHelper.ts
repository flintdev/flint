// controllers/utils/fsHelper.ts

import ErrnoException = NodeJS.ErrnoException;
import {Dirent} from "fs";

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

    createFile = (path: string, content: string) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err: ErrnoException) => {
                if (err) return reject(err);
                resolve();
            });
        });
    };

    readDir = (path: string) => {
        return new Promise((resolve, reject) => {
            fs.readdir(path, {withFileTypes: true}, (err:ErrnoException, files:Dirent[]) => {
                if (err) return reject(err);
                resolve(files);
            })
        });
    };

    readFile = (path: string) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err: ErrnoException, data: Buffer) => {
                if (err) return reject(err);
                resolve(data.toString());
            });
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