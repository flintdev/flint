// src/redux/modules/editor/settings/actions.ts

import * as types from './types';

// functions

export function settingsDialogOpen(): SettingsDialogOpen {
    return { type: types.SETTINGS_DIALOG_OPEN }
}

export function settingsDialogClose(): SettingsDialogClose {
    return { type: types.SETTINGS_DIALOG_CLOSE }
}

// interfaces

export interface SettingsDialogOpen {
    type: typeof types.SETTINGS_DIALOG_OPEN,
}

export interface SettingsDialogClose {
    type: typeof types.SETTINGS_DIALOG_CLOSE,
}

export type SettingsAction =
    SettingsDialogOpen |
    SettingsDialogClose;
