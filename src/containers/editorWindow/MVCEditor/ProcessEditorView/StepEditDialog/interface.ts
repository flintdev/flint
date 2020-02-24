// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/interface.ts

export interface StepAttributes {
    name: string,
    group: string,
    category: string,
    type: string,
}

export enum StepType {
    CODE_BLOCK = 'Code Block',
    TRIGGER = 'Trigger',
    END = 'End',
}