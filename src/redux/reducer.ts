// src/redux/reducer.ts

import {StoreState} from "./state";
import {reducer as starterReducer, StarterAction} from "./modules/starter/reducer";
import {reducer as editorReducer, Action as EditorAction} from "./modules/editor/reducer";
import {reducer as filesReducer, FilesAction} from "./modules/files/reducer";
import {reducer as configReducer, ConfigAction} from "./modules/config/reducer";

export type Action = StarterAction & ConfigAction & EditorAction & FilesAction;

export function reducer(state: StoreState, action: Action) {
    return {
        starter: starterReducer(state.starter, action),
        config: configReducer(state.config, action),
        editor: editorReducer(state.editor, action),
        files: filesReducer(state.files, action),
    }
}