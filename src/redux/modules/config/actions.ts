// src/redux/modules/config/actions.ts

import * as types from './types';

// functions

export function setCurrentPage(pageIndex: number): SetCurrentPage {
    return { type: types.SET_CURRENT_PAGE, pageIndex }
}

export function setProjectDir(value: string): SetProjectDir {
    return {
        type: types.SET_PROJECT_DIR,
        value
    }
}

// interfaces

export interface SetCurrentPage {
    type: typeof types.SET_CURRENT_PAGE,
    pageIndex: number
}

export interface SetProjectDir {
    type: typeof types.SET_PROJECT_DIR,
    value: string
}

export type ConfigAction =
    SetCurrentPage |
    SetProjectDir;
