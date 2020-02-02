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
        case types.SET_TREE_DATA:
            return update(state, {
                treeData: {$set: action.treeData}
            });

        default:
            return state;
    }
}

export {FilesAction};