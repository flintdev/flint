// src/redux/modules/editor/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {EditorAction} from "./actions";

export function reducer(state: object, action: EditorAction) {
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
        case types.SET_SCHEMA_DATA:
            return update(state, {
                modelEditor: {
                    schemaData: {$set: action.schemaData}
                }
            });

        default:
            return state;
    }
}

export {EditorAction};
