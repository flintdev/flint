// src/redux/modules/editor/actions.ts

import * as types from './types';

// functions

export function initializeEditor(): InitializeEditor {
    return {type: types.INITIALIZE_EDITOR}
}

export function setCurrentPage(pageIndex: number): SetCurrentPage {
    return { type: types.SET_CURRENT_PAGE, pageIndex }
}

export function setProjectDir(value: string): SetProjectDir {
    return {
        type: types.SET_PROJECT_DIR,
        value
    }
}

export function setCurrentView(value: string): SetCurrentView {
    return { type: types.SET_CURRENT_VIEW, value }
}

export function setModelList(modelList: string[]): SetModelList {
    return { type: types.SET_MODEL_LIST, modelList }
}

export function selectModel(value: string): SelectModel {
    return { type: types.SELECT_MODEL, value }
}


// interfaces

export interface InitializeEditor {
    type: typeof types.INITIALIZE_EDITOR,
}

export interface SetCurrentPage {
    type: typeof types.SET_CURRENT_PAGE,
    pageIndex: number
}

export interface SetProjectDir {
    type: typeof types.SET_PROJECT_DIR,
    value: string
}

export interface SetCurrentView {
    type: typeof types.SET_CURRENT_VIEW,
    value: string
}

export interface SetModelList {
    type: typeof types.SET_MODEL_LIST,
    modelList: string[]
}

export interface SelectModel {
    type: typeof types.SELECT_MODEL,
    value: string,
}

export type EditorAction =
    InitializeEditor |
    SetCurrentPage |
    SetCurrentView |
    SetModelList |
    SelectModel |
    SetProjectDir;
