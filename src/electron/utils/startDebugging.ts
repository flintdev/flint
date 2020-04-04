// src/electron/utils/startDebugging.ts

import {exec} from 'child_process';

export function startDebugging (dir: string) {
    return new Promise((resolve, reject) => {
        exec("npm install", {cwd: dir}, ((error, stdout, stderr) => {
            console.log(stdout);
            if (!!error) {
                console.log('error - npm install', error);
                reject(error);
                return false;
            }
            exec("npm start", {cwd: dir}, (error1, stdout1, stderr1) => {
                console.log(stdout1);
                if (!!error1) {
                    console.log('error - npm start', error1);
                    reject(error1);
                    return false;
                }
                resolve(true);
            })
        }));
    });

}
