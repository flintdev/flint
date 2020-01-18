// src/redux/reducer.ts

import {StoreState} from "./state";
import {reducer as starterReducer, StarterAction} from "./modules/starter/reducer";
import {reducer as editorReducer, EditorAction} from "./modules/editor/reducer";

export type Action = StarterAction & EditorAction;

export function reducer(state: StoreState, action: Action) {
    return {
        starter: starterReducer(state.starter, action),
        editor: editorReducer(state.editor, action),
    }
}