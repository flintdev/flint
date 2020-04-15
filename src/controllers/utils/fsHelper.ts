// controllers/utils/fsHelper.ts

import ErrnoException = NodeJS.ErrnoException;
import {Dirent} from "fs";

import * as fs from "fs";
import {homedir as homedirFunc} from "os";
import * as rimraf from "rimraf";
const homedir = homedirFunc();

const FILES_IGNORE = [
    '.DS_Store'
];

export enum ErrorType {
    DirExists,
    DirNotExists,
}

export interface FileInfo {
    name: string,
    type: 'file' | 'dir',
}

export type ReadDirResolve = (files: FileInfo[]) => void;
export type ReadFileResolve = (value: string) => void;

export class FSHelper {
    createDirByPath = (path: string) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path)) {
                resolve();
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
        return new Promise((resolve: ReadDirResolve, reject) => {
            fs.readdir(path, {withFileTypes: true}, (err:ErrnoException, files:Dirent[]) => {
                if (!!err) return reject(err);
                const fileInfoList: FileInfo[] = files.filter(file => !FILES_IGNORE.includes(file.name)).map(file => {
                    return {
                        name: file.name,
                        type: file.isDirectory() ? 'dir' : 'file'
                    }
                });
                resolve(fileInfoList);
            })
        });
    };

    readDirSync = (path: string) => {
        const files = fs.readdirSync(path, {withFileTypes: true});
        const fileInfoList: FileInfo[] = files.filter(file => !FILES_IGNORE.includes(file.name)).map(file => {
            return {
                name: file.name,
                type: file.isDirectory() ? 'dir' : 'file'
            }
        });
        return fileInfoList;
    };

    readFile = (path: string) => {
        return new Promise((resolve: ReadFileResolve, reject) => {
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

    removeDir = (path: string) => {
        return new Promise((resolve, reject) => {
            rimraf(path, {}, (err: Error) => {
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    };

    getDefaultPath = () => {
        return `${homedir}/Flint/untitled`;
    };

    checkAndCreateDirWithWriteAccess = (dirPath: string) => {
        return new Promise((resolve, reject) => {
            fs.access(dirPath, fs.constants.W_OK, err => {
                if (!!err) {
                    fs.mkdir(dirPath, {recursive: true}, err1 => {
                        if (!!err1) reject(err1)
                        else resolve();
                    })
                } else resolve();
            });
        });
    };

    getHomeDir = () => {
        return homedir;
    };

    getFileTree = (rootDirPath: string) => {

    };
}