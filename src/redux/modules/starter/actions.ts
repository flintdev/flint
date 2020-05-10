// src/redux/modules/starterWindow/actions.ts

import * as types from './types';

// functions

export function createProjectDialogOpen(): CreateProjectDialogOpen {
    return { type: types.CREATE_PROJECT_DIALOG_OPEN }
}

export function createProjectDialogClose(): CreateProjectDialogClose {
    return { type: types.CREATE_PROJECT_DIALOG_CLOSE };
}

export function validationDialogOpen(projectDirSelected: string): ValidationDialogOpen {
    return { type: types.VALIDATION_DIALOG_OPEN, projectDirSelected }
}

export function validationDialogClose(): ValidationDialogClose {
    return { type: types.VALIDATION_DIALOG_CLOSE }
}

export function setRecentProjects(projects: any[]): SetRecentProjects {
    return { type: types.SET_RECENT_PROJECTS, projects }
}

// interfaces

export interface SetRecentProjects {
    type: typeof types.SET_RECENT_PROJECTS,
    projects: any[],
}

export interface ValidationDialogClose {
    type: typeof types.VALIDATION_DIALOG_CLOSE,
}

export interface ValidationDialogOpen {
    type: typeof types.VALIDATION_DIALOG_OPEN,
    projectDirSelected: string,
}

export interface CreateProjectDialogOpen {
    type: typeof types.CREATE_PROJECT_DIALOG_OPEN
}

export interface CreateProjectDialogClose {
    type: typeof types.CREATE_PROJECT_DIALOG_CLOSE
}

export type StarterAction =
    SetRecentProjects |
    ValidationDialogOpen |
    ValidationDialogClose |
    CreateProjectDialogOpen |
    CreateProjectDialogClose;