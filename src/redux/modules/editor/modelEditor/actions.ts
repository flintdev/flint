// src/redux/modules/editorWindow/actions/modelEditor/actions.ts

import * as types from './types';

// functions

export function setModelList(modelList: string[]): SetModelList {
    return { type: types.SET_MODEL_LIST, modelList }
}

export function selectModel(value: string): SelectModel {
    return { type: types.SELECT_MODEL, value }
}

export function setEditorData (editorData: any): SetEditorData {
    return { type: types.SET_EDITOR_DATA, editorData }
}

export function deleteModel (modelName: string): DeleteModel {
    return { type: types.DELETE_MODEL, modelName }
}

export function blockEditDialogOpen(blockData: any): BlockEditDialogOpen {
    return { type: types.BLOCK_EDIT_DIALOG_OPEN, blockData }
}

export function blockEditDialogClose(): BlockEditDialogClose {
    return { type: types.BLOCK_EDIT_DIALOG_CLOSE }
}

// interfaces

export interface BlockEditDialogClose {
    type: typeof types.BLOCK_EDIT_DIALOG_CLOSE,
}

export interface BlockEditDialogOpen {
    type: typeof types.BLOCK_EDIT_DIALOG_OPEN,
    blockData: any,
}

export interface SetModelList {
    type: typeof types.SET_MODEL_LIST,
    modelList: string[]
}

export interface SelectModel {
    type: typeof types.SELECT_MODEL,
    value: string,
}

export interface SetEditorData {
    type: typeof types.SET_EDITOR_DATA,
    editorData: any,
}

export interface DeleteModel {
    type: typeof types.DELETE_MODEL,
    modelName: string
}

export type ModelEditorAction =
    BlockEditDialogOpen |
    BlockEditDialogClose |
    SetModelList |
    SelectModel |
    SetEditorData |
    DeleteModel ;