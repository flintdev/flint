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
                editorData: {$set: action.editorData},
                _mark: {$set: state._mark + 1}
            });
        case types.DELETE_MODEL:
            return update(state, {
                editorData: {$set: undefined},
                modelSelected: {$set: undefined},
                modelList: {$splice: [[state.modelList.indexOf(action.modelName), 1]]},
            });
        case types.BLOCK_EDIT_DIALOG_OPEN:
            return update(state, {
                blockEditDialog: {
                    open: {$set: true},
                    blockData: {$set: action.blockData},
                }
            });
        case types.BLOCK_EDIT_DIALOG_CLOSE:
            return update(state, {
                blockEditDialog: {
                    open: {$set: false}
                }
            });

        default:
            return state;
    }
}

export {ModelEditorAction};