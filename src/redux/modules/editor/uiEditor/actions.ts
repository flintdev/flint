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

// interfaces

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
    AddWidgetDialogOpen |
    AddWidgetDialogClose;

