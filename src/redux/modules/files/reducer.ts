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
        case types.SELECT_NODE:
            return update(state, {
                nodeSelected: {$set: action.node}
            });
        case types.SET_FILE_CONTENT:
            return update(state, {
                fileContent: {$set: action.value}
            });

        default:
            return state;
    }
}

export {FilesAction};