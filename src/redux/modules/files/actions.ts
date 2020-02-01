// src/redux/modules/files/actions.ts

import * as types from './types';

// functions

export function setProjectDir(projectDir: string): SetProjectDir {
    return { type: types.SET_PROJECT_DIR, projectDir };
}

// interfaces

export interface SetProjectDir {
    type: typeof types.SET_PROJECT_DIR,
    projectDir: string,
}

export type FilesAction = SetProjectDir;
