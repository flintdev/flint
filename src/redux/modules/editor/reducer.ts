// src/redux/modules/editor/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {EditorAction} from "./actions";

export function reducer(state: object, action: EditorAction) {
    switch (action.type) {
        case types.INITIALIZE_EDITOR:
            return update(state, {

            });
        default:
            return state;
    }
}

export {EditorAction};
