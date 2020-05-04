// src/redux/modules/editorWindow/actions.ts

import * as modelEditor from './modelEditor/actions';
import * as processEditor from './processEditor/actions';
import * as uiEditor from './uiEditor/actions';
import * as navigation from './navigation/actions';
import * as settings from './settings/actions';

export type EditorAction =
    modelEditor.ModelEditorAction |
    processEditor.ProcessEditorAction |
    uiEditor.UIEditorAction |
    navigation.NavigationAction |
    settings.SettingsAction;


export {modelEditor, processEditor, uiEditor, navigation, settings};
