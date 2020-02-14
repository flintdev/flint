import * as types from '../../types';
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";

// functions

export function setModelList(modelList: string[]): SetModelList {
    return { type: types.SET_MODEL_LIST, modelList }
}

export function selectModel(value: string): SelectModel {
    return { type: types.SELECT_MODEL, value }
}

export function setEditorData (editorData: EditorData): SetEditorData {
    return { type: types.SET_EDITOR_DATA, editorData }
}

export function setSchemaData(schemaData: SchemaData): SetSchemaData {
    return { type: types.SET_SCHEMA_DATA, schemaData }
}

export function setDefaultEditorData(editorData: EditorData): SetDefaultEditorData {
    return { type: types.SET_DEFAULT_EDITOR_DATA, editorData}
}

export function deleteModel (modelName: string): DeleteModel {
    return { type: types.DELETE_MODEL, modelName }
}

export function setCurrentRevision(editor: number, source: number): SetCurrentRevision {
    return { type: types.SET_CURRENT_REVISION, editor, source }
}

// interfaces

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
    editorData: EditorData,
}

export interface SetSchemaData {
    type: typeof types.SET_SCHEMA_DATA,
    schemaData: SchemaData,
}

export interface SetDefaultEditorData {
    type: typeof types.SET_DEFAULT_EDITOR_DATA,
    editorData: EditorData,
}

export interface DeleteModel {
    type: typeof types.DELETE_MODEL,
    modelName: string
}

export interface SetCurrentRevision {
    type: typeof types.SET_CURRENT_REVISION,
    editor: number,
    source: number
}

export type ModelEditorAction =
    SetModelList |
    SelectModel |
    SetEditorData |
    SetSchemaData |
    SetDefaultEditorData |
    DeleteModel |
    SetCurrentRevision;