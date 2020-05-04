// src/redux/modules/editor/settings/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {SettingsAction} from "./actions";
import {SettingsState} from "../../../state";

export function reducer(state: SettingsState, action: SettingsAction) {
    switch (action.type) {
        case types.SETTINGS_DIALOG_OPEN:
            return update(state, {
                open: {$set: true}
            });
        case types.SETTINGS_DIALOG_CLOSE:
            return update(state, {
                open: {$set: false}
            });
        default:
            return state;
    }
}

export {SettingsAction}