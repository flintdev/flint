// src/redux/modules/editor/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {EditorAction} from "./actions/actions";
import {EditorState} from "../../state";

export function reducer(state: EditorState, action: EditorAction) {
    switch (action.type) {
        case types.INITIALIZE_EDITOR:
            return update(state, {});
        case types.SET_CURRENT_PAGE:
            return update(state, {
                currentPageIndex: {$set: action.pageIndex}
            });
        case types.SET_PROJECT_DIR:
            return update(state, {
                projectDir: {$set: action.value}
            });
        case types.SET_CURRENT_VIEW:
            return update(state, {
                mvcEditor: {
                    currentView: {$set: action.value}
                }
            });
        case types.SET_MODEL_LIST:
            return update(state, {
                modelEditor: {
                    modelList: {$set: action.modelList}
                }
            });
        case types.SELECT_MODEL:
            return update(state, {
                modelEditor: {
                    modelSelected: {$set: action.value}
                }
            });
        case types.SET_EDITOR_DATA:
            return update(state, {
                modelEditor: {
                    editorData: {$set: action.editorData}
                }
            });
        case types.SET_DEFAULT_EDITOR_DATA:
            return update(state, {
                modelEditor: {
                    defaultEditorData: {$set: action.editorData}
                }
            });
        case types.SET_SCHEMA_DATA:
            return update(state, {
                modelEditor: {
                    schemaData: {$set: action.schemaData}
                }
            });
        case types.DELETE_MODEL:
            return update(state, {
                modelEditor: {
                    editorData: {$set: undefined},
                    schemaData: {$set: undefined},
                    defaultEditorData: {$set: undefined},
                    modelSelected: {$set: undefined},
                    modelList: {$splice: [[state.modelEditor.modelList.indexOf(action.modelName), 1]]},
                }
            });
        case types.SET_CURRENT_REVISION:
            return update(state, {
                modelEditor: {
                    currentRevision: {
                        editor: {$set: action.editor},
                        source: {$set: action.source},
                    }
                }
            });

        default:
            return state;
    }
}

export {EditorAction};
