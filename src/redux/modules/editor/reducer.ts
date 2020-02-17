// src/redux/modules/editorWindow/reducer.ts

import {EditorAction} from "./actions";
import {EditorState} from "../../state";
import {reducer as modelEditorReducer, ModelEditorAction} from "./modelEditor/reducer";
import {reducer as navigationReducer, NavigationAction} from "./navigation/reducer";

export type Action = NavigationAction & ModelEditorAction;

export function reducer(state: EditorState, action: Action) {
    return {
        navigation: navigationReducer(state.navigation, action),
        modelEditor: modelEditorReducer(state.modelEditor, action),
    }
}

