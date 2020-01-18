// src/redux/modules/editor/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {EditorAction} from "./actions";

export function reducer(state: object, action: EditorAction) {
    switch (action.type) {
        case types.INITIALIZE_EDITOR:
            return update(state, {

            });
        case types.SET_CURRENT_PAGE:
            return update(state, {
                currentPageIndex: {$set: action.pageIndex}
            });
        case types.SET_PROJECT_DIR:
            return update(state, {
                projectDir: {$set: action.value}
            });
        default:
            return state;
    }
}

export {EditorAction};
