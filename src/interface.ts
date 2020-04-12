// src/interface.ts

export interface FileTreeNode {
    path: string,
    name: string,
    type: 'file' | 'dir',
    children?: FileTreeNode[]
}

export interface PluginData {
    type: 'widget' | 'step',
    id: string,
    name: string,
    owner: string,
    repo: string,
    preinstalled?: boolean,
    currentVersion?: string,
    newVersion?: string,
}
