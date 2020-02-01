// src/controllers/files/sourceFileManager.ts

import {FSHelper} from "../utils/fsHelper";

export interface TreeNode {
    name: string,
    type: 'file' | 'dir',
    children?: TreeNode[]
}

export class SourceFileManager {
    rootDir: string;
    fsHelper: FSHelper;
    constructor(rootDir: string) {
        this.rootDir = rootDir;
        this.fsHelper = new FSHelper();
    }

    getTreeData = async () => {
        const treeData = await this.recurToChildren(this.rootDir);
        console.log(treeData);
    };

    private recurToChildren = async (parentPath: string) => {
        const files = await this.fsHelper.readDir(parentPath);
        let nodes: TreeNode[] = [];
        for (let file of files) {
            const {name, type} = file;
            if (type === 'dir') {
                const children: TreeNode[] = await this.recurToChildren(`${parentPath}/${name}`);
                const node = {name, type, children};
                nodes.push(node);
            } else {
                const node = {name, type};
                nodes.push(node);
            }
        }
        return nodes;
    };
}
