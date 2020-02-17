// src/redux/modules/editorWindow/navigation/actions.ts

import * as types from './types';

// functions

export function setCurrentView(value: string): SetCurrentView {
    return { type: types.SET_CURRENT_VIEW, value }
}

// interfaces

export interface SetCurrentView {
    type: typeof types.SET_CURRENT_VIEW,
    value: string
}

export type NavigationAction =
    SetCurrentView;

