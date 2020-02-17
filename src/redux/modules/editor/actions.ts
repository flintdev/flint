// src/redux/modules/editorWindow/actions.ts

import * as modelEditor from './modelEditor/actions';
import * as processEditor from './processEditor/actions';
import * as navigation from './navigation/actions';

export type EditorAction =
    modelEditor.ModelEditorAction |
    processEditor.ProcessEditorAction |
    navigation.NavigationAction;


export {modelEditor, processEditor, navigation};
