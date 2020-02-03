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

export function selectNode(node: FileTreeNode): SelectNode {
    return { type: types.SELECT_NODE, node }
}

export function setFileContent(value: string|null): SetFileContent {
    return { type: types.SET_FILE_CONTENT, value }
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

export interface SelectNode {
    type: typeof types.SELECT_NODE,
    node: FileTreeNode,
}

export interface SetFileContent {
    type: typeof types.SET_FILE_CONTENT,
    value: string|null,
}

export type FilesAction =
    SetTreeData |
    SelectNode |
    SetFileContent |
    SetProjectDir;
