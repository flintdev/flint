// src/redux/modules/files/actions.ts

import * as types from './types';
import {FileTreeNode} from "../../../interface";

// functions

export function setProjectDir(projectDir: string): SetProjectDir {
    return { type: types.SET_PROJECT_DIR, projectDir };
}

export function setTreeData(treeData: FileTreeNode[]): SetTreeData {
    return { type: types.SET_TREE_DATA, treeData }
}

// interfaces

export interface SetProjectDir {
    type: typeof types.SET_PROJECT_DIR,
    projectDir: string,
}

export interface SetTreeData {
    type: typeof types.SET_TREE_DATA,
    treeData: FileTreeNode[],
}

export type FilesAction =
    SetTreeData |
    SetProjectDir;
