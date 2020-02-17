//

import * as types from './types';
import update from 'immutability-helper';
import {ModelEditorState} from "../../../state";
import {ModelEditorAction} from "./actions";

export function reducer(state: ModelEditorState, action: ModelEditorAction) {
    switch (action.type) {
        case types.SET_MODEL_LIST:
            return update(state, {
                modelList: {$set: action.modelList}
            });
        case types.SELECT_MODEL:
            return update(state, {
                modelSelected: {$set: action.value}
            });
        case types.SET_EDITOR_DATA:
            return update(state, {
                editorData: {$set: action.editorData}
            });
        case types.SET_DEFAULT_EDITOR_DATA:
            return update(state, {
                defaultEditorData: {$set: action.editorData}
            });
        case types.SET_SCHEMA_DATA:
            return update(state, {
                schemaData: {$set: action.schemaData}
            });
        case types.DELETE_MODEL:
            return update(state, {
                editorData: {$set: undefined},
                schemaData: {$set: undefined},
                defaultEditorData: {$set: undefined},
                modelSelected: {$set: undefined},
                modelList: {$splice: [[state.modelList.indexOf(action.modelName), 1]]},
            });
        case types.SET_CURRENT_REVISION:
            return update(state, {
                currentRevision: {
                    editor: {$set: action.editor},
                    source: {$set: action.source},
                }
            });
        default:
            return state;
    }
}

export {ModelEditorAction};