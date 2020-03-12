// src/redux/modules/editor/uiEditor/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {UIEditorAction} from "./actions";
import {UIEditorState} from "../../../state";

export function reducer(state: UIEditorState, action: UIEditorAction) {
    switch (action.type) {
        case types.ADD_WIDGET_DIALOG_OPEN:
            return update(state, {
                addWidgetDialog: {
                    open: {$set: true}
                }
            });
        case types.ADD_WIDGET_DIALOG_CLOSE:
            return update(state, {
                addWidgetDialog: {
                    open: {$set: false}
                }
            });

        default:
            return state;
    }
}

export {UIEditorAction};