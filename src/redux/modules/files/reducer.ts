// src/redux/modules/files/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {FilesAction} from "./actions";
import {FilesState} from "../../state";

export function reducer(state: FilesState, action: FilesAction) {
    switch (action.type) {
        case types.SET_PROJECT_DIR:
            return update(state, {
                projectDir: {$set: action.projectDir}
            });

        default:
            return state;
    }
}

export {FilesAction};