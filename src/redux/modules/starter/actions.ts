// src/redux/modules/starterWindow/actions.ts

import * as types from './types';

// functions

export function createProjectDialogOpen(): CreateProjectDialogOpen {
    return { type: types.CREATE_PROJECT_DIALOG_OPEN }
}

export function createProjectDialogClose(): CreateProjectDialogClose {
    return { type: types.CREATE_PROJECT_DIALOG_CLOSE };
}

export function validationDialogOpen(): ValidationDialogOpen {
    return { type: types.VALIDATION_DIALOG_OPEN }
}

export function validationDialogClose(): ValidationDialogClose {
    return { type: types.VALIDATION_DIALOG_CLOSE }
}

// interfaces

export interface ValidationDialogClose {
    type: typeof types.VALIDATION_DIALOG_CLOSE,
}

export interface ValidationDialogOpen {
    type: typeof types.VALIDATION_DIALOG_OPEN,
}

export interface CreateProjectDialogOpen {
    type: typeof types.CREATE_PROJECT_DIALOG_OPEN
}

export interface CreateProjectDialogClose {
    type: typeof types.CREATE_PROJECT_DIALOG_CLOSE
}

export type StarterAction =
    ValidationDialogOpen |
    ValidationDialogClose |
    CreateProjectDialogOpen |
    CreateProjectDialogClose;