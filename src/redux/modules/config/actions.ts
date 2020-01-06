// src/redux/modules/config/actions.ts

import * as types from './types';

export interface DefaultType {
    type: string
}

export interface SetProjectDir {
    type: typeof types.SET_PROJECT_DIR,
    value: string
}

export type ConfigAction = SetProjectDir;

export function setProjectDir(value: string): SetProjectDir {
    return {
        type: types.SET_PROJECT_DIR,
        value
    }
}

