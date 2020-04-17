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
    libraryName?: string,
    description?: string,
}

export type NotificationType = 'widget-update';

export interface Notification {
    type: NotificationType,
    title: string,
    subtitle: string,
}

export enum TriggerEventType {
    'ADDED'= "ADDED",
    'MODIFIED' = 'MODIFIED',
    'DELETED' = 'DELETED'
}
export interface TriggerData {
    model: string,
    eventType: TriggerEventType,
    when: string
}