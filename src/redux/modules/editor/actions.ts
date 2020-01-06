// src/redux/modules/editor/actions.ts

import * as types from './types';

export interface InitializeEditor {
    type: typeof types.INITIALIZE_EDITOR,
}

export function initializeEditor(): InitializeEditor {
    return {type: types.INITIALIZE_EDITOR}
}

export type EditorAction = InitializeEditor;