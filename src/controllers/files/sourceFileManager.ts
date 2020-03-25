// src/controllers/files/sourceFileManager.ts

import {FSHelper} from "../utils/fsHelper";
import {FileTreeNode} from "../../interface";

const excluded_path = [
    'src/ui/node_modules'
];

export class SourceFileManager {
    rootDir: string;
    fsHelper: FSHelper;

    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    getTreeData = async () => {
        const treeData = await this.recurToChildren(this.rootDir);
        return treeData;
    };

    getFileContent = async (path: string) => {
        try {
            return await this.fsHelper.readFile(path);
        } catch (e) {
            return null;
        }
    };

    private recurToChildren = async (parentPath: string) => {
        const files = await this.fsHelper.readDir(parentPath);
        let nodes: FileTreeNode[] = [];
        for (let file of files) {
            const {name, type} = file;
            const path = `${parentPath}/${name}`;
            if (this.isExcludedPath(path)) continue;
            if (type === 'dir') {
                const children: FileTreeNode[] = await this.recurToChildren(path);
                const node = {name, type, path, children};
                nodes.push(node);
            } else {
                const node = {name, type, path};
                nodes.push(node);
            }
        }
        return nodes;
    };

    private isExcludedPath = (absPath: string) => {
        for (const path of excluded_path) {
            if (absPath.includes(path)) return true;
        }
        return false;
    };
}
