// src/controllers/utils/githubHelper.ts

import fetch from 'node-fetch';
import * as Bluebird from 'bluebird';
// @ts-ignore
fetch.Promise = Bluebird;
const API_BASE_URL = `https://api.github.com`;
const SITE_BASE_URL = 'https://github.com';

export class GithubHelper {
    headers: object = {
        'User-Agent': 'node.js',
        'Content-Type': 'application/json'
    };
    constructor() {

    }

    getLatestRelease = async (owner: string, repo: string) => {
        const url = `${API_BASE_URL}/repos/${owner}/${repo}/releases/latest`;
        // @ts-ignore
        const response = await fetch(url, {
            headers: {...this.headers},
            method: "GET"
        });
        return await response.json();
    };

    getAssetDownloadURL = (owner: string, repo: string, releaseInfo: any, filename: string) => {
        const tag = releaseInfo.tag_name;
        return `${SITE_BASE_URL}/${owner}/${repo}/releases/download/${tag}/${filename}`;
    };
}