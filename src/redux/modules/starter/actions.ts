// src/redux/modules/starter/actions.ts

import * as types from './types';

export interface DefaultType {
    type: string
}

export interface CreateProjectDialogOpen {
    type: typeof types.CREATE_PROJECT_DIALOG_OPEN
}

export interface CreateProjectDialogClose {
    type: typeof types.CREATE_PROJECT_DIALOG_CLOSE
}

export type StarterAction =
    | DefaultType;

export function createProjectDialogOpen(): DefaultType {
    return { type: types.CREATE_PROJECT_DIALOG_OPEN }
}

export function createProjectDialogClose(): DefaultType {
    return { type: types.CREATE_PROJECT_DIALOG_CLOSE };
}

