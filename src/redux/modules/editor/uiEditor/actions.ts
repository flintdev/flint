// src/redux/modules/editor/uiEditor/actions.ts

import * as types from './types';

// functions

export function addWidgetDialogOpen (): AddWidgetDialogOpen {
    return { type: types.ADD_WIDGET_DIALOG_OPEN }
}

export function addWidgetDialogClose(): AddWidgetDialogClose {
    return { type: types.ADD_WIDGET_DIALOG_CLOSE }
}

export function increaseMark(): IncreaseMark {
    return { type: types.INCREASE_MARK }
}

export function addLibraryDialogClose(): AddLibraryDialogClose {
    return { type: types.ADD_LIBRARY_DIALOG_CLOSE }
}

export function addLibraryDialogOpen(): AddLibraryDialogOpen {
    return { type: types.ADD_LIBRARY_DIALOG_OPEN }
}

// interfaces

export interface AddLibraryDialogOpen {
    type: typeof types.ADD_LIBRARY_DIALOG_OPEN,
}

export interface AddLibraryDialogClose {
    type: typeof types.ADD_LIBRARY_DIALOG_CLOSE,
}

export interface AddWidgetDialogClose {
    type: typeof types.ADD_WIDGET_DIALOG_CLOSE,
}

export interface AddWidgetDialogOpen {
    type: typeof types.ADD_WIDGET_DIALOG_OPEN,
}

export interface IncreaseMark {
    type: typeof types.INCREASE_MARK,
}

export type UIEditorAction =
    IncreaseMark |
    AddLibraryDialogOpen |
    AddLibraryDialogClose |
    AddWidgetDialogOpen |
    AddWidgetDialogClose;

