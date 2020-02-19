// src/redux/modules/editorWindow/actions/processEditor/actions.ts

import * as types from './types';

// functions

export function setProcessList(processList: string[]): SetProcessList {
    return { type: types.SET_PROCESS_LIST, processList }
}

export function selectProcess(value: string): SelectProcess {
    return { type: types.SELECT_PROCESS, value }
}

export function processEditorDialogOpen(): ProcessEditorDialogOpen {
    return { type: types.PROCESS_EDITOR_DIALOG_OPEN }
}

export function processEditorDialogClose(): ProcessEditorDialogClose {
    return { type: types.PROCESS_EDITOR_DIALOG_CLOSE }
}

export function stepEditDialogOpen(stepData: any): StepEditDialogOpen {
    return { type: types.STEP_EDIT_DIALOG_OPEN, stepData }
}

export function stepEditDialogClose(): StepEditDialogClose {
    return { type: types.STEP_EDIT_DIALOG_CLOSE }
}

// interfaces

export interface SetProcessList {
    type: typeof types.SET_PROCESS_LIST,
    processList: string[]
}

export interface SelectProcess {
    type: typeof types.SELECT_PROCESS,
    value: string
}

export interface ProcessEditorDialogOpen {
    type: typeof types.PROCESS_EDITOR_DIALOG_OPEN,
}

export interface ProcessEditorDialogClose {
    type: typeof types.PROCESS_EDITOR_DIALOG_CLOSE,
}


export interface StepEditDialogOpen {
    type: typeof types.STEP_EDIT_DIALOG_OPEN,
    stepData: any
}

export interface StepEditDialogClose {
    type: typeof types.STEP_EDIT_DIALOG_CLOSE,
}

export type ProcessEditorAction =
    SelectProcess |
    ProcessEditorDialogOpen |
    ProcessEditorDialogClose |
    StepEditDialogOpen |
    StepEditDialogClose |
    SetProcessList;


