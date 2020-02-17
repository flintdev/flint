// src/redux/modules/editorWindow/reducer.ts

import {EditorState} from "../../state";
import {reducer as modelEditorReducer, ModelEditorAction} from "./modelEditor/reducer";
import {reducer as navigationReducer, NavigationAction} from "./navigation/reducer";
import {reducer as processEditorReducer, ProcessEditorAction} from "./processEditor/reducer";

export type Action = NavigationAction & ModelEditorAction & ProcessEditorAction;

export function reducer(state: EditorState, action: Action) {
    return {
        navigation: navigationReducer(state.navigation, action),
        modelEditor: modelEditorReducer(state.modelEditor, action),
        processEditor: processEditorReducer(state.processEditor, action),
    }
}

