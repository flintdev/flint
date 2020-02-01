// src/redux/reducer.ts

import {StoreState} from "./state";
import {reducer as starterReducer, StarterAction} from "./modules/starter/reducer";
import {reducer as editorReducer, EditorAction} from "./modules/editor/reducer";
import {reducer as filesReducer, FilesAction} from "./modules/files/reducer";

export type Action = StarterAction & EditorAction & FilesAction;

export function reducer(state: StoreState, action: Action) {
    return {
        starter: starterReducer(state.starter, action),
        editor: editorReducer(state.editor, action),
        files: filesReducer(state.files, action),
    }
}