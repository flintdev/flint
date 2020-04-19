// src/redux/modules/editor/processEditor/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {ProcessEditorAction} from "./actions";
import {ProcessEditorState} from "../../../state";

export function reducer(state: ProcessEditorState, action: ProcessEditorAction) {
    switch (action.type) {
        case types.SET_PROCESS_LIST:
            return update(state, {
                processList: {$set: action.processList}
            });
        case types.SELECT_PROCESS:
            return update(state, {
                processSelected: {$set: action.value}
            });
        case types.STEP_EDIT_DIALOG_OPEN:
            return update(state, {
                stepEditDialog: {
                    open: {$set: true},
                    stepData: {$set: action.stepData}
                }
            });
        case types.STEP_EDIT_DIALOG_CLOSE:
            return update(state, {
                stepEditDialog: {
                    open: {$set: false}
                }
            });
        case types.UPDATE_EDITOR_DATA:
            return update(state, {
                editorData: {$set: action.editorData}
            });
        case types.EDIT_PROCESS:
            return update(state, {
                processSelected: {$set: action.processName}
            });
        case types.EXIT_EDITING:
            return update(state, {
                processSelected: {$set: undefined},
            });

        default:
            return state;
    }
}

export {ProcessEditorAction};