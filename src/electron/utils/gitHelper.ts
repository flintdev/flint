// src/electron/utils/gitHelper.ts

import * as git from 'isomorphic-git'
import * as fs from "fs";
import {FSHelper} from "../../controllers/utils/fsHelper";
import {DatetimeHelper} from "../../controllers/utils/datetimeHelper";

export class GitHelper {
    repoDir: string;
    projectDir: string;
    fsHelper = new FSHelper();
    datetimeHelper = new DatetimeHelper();

    constructor(projectDir: string) {
        this.projectDir = projectDir;
        this.repoDir = `${projectDir}/.flint`;
    }

    checkGitFiles = async () => {
        const gitPath = `${this.repoDir}/.git`;
        try {
            await this.fsHelper.checkPathExists(gitPath)
            return true;
        } catch (e) {
            return false;
        }
    };

    initRepo = async () => {
        await git.init({fs, dir: this.repoDir});
    };

    private addFiles = async () => {
        const repo = {fs, dir: this.repoDir};
        await git.statusMatrix(repo).then((status) =>
            Promise.all(
                status.map(([filepath, , worktreeStatus]) =>
                    // isomorphic-git may report a changed file as unmodified, so always add if not removing
                    worktreeStatus ? git.add({...repo, filepath}) : git.remove({...repo, filepath})
                )
            )
        );
    };

    commitWithTimestamp = async () => {
        const gitExist = await this.checkGitFiles();
        if (!gitExist) await this.initRepo();
        await this.addFiles();
        await git.commit({
            fs,
            dir: this.repoDir,
            message: this.datetimeHelper.getCurrentTimestamp(),
            author: {
                name: 'flint',
            },
        });
    };

    listCommits = async () => {
        const commits = await git.log({
            fs,
            dir: this.repoDir,
        });
        return commits;
    };
}