// src/interface.ts

export interface FileTreeNode {
    path: string,
    name: string,
    type: 'file' | 'dir',
    children?: FileTreeNode[]
}