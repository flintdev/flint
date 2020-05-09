// src/redux/modules/components/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {ComponentsAction} from "./actions";
import {ComponentsState} from "../../state";

export function reducer(state: ComponentsState, action: ComponentsAction) {
    switch (action.type) {
        case types.TOAST_OPEN:
            return update(state, {
                toast: {
                    open: {$set: true},
                    type: {$set: action.toastType},
                    message: {$set: action.message}
                }
            });
        case types.TOAST_CLOSE:
            return update(state, {
                toast: {
                    open: {$set: false}
                }
            });
        case types.OPEN_DIALOG_FORM:
            return update(state, {
                dialogForm: {
                    open: {$set: true},
                    initValues: {$set: action.initValues},
                    data: {$set: action.data},
                    onSubmit: {$set: action.onSubmit}
                }
            });
        case types.CLOSE_DIALOG_FORM:
            return update(state, {
                dialogForm: {
                    open: {$set: false}
                }
            });
        case types.OPEN_CONFIRMATION_DIALOG:
            return update(state, {
                confirmationDialog: {
                    open: {$set: true},
                    type: {$set: action.messageType},
                    title: {$set: action.title},
                    description: {$set: action.description},
                    submitLabel: {$set: action.submitLabel},
                    onSubmit: {$set: action.onSubmit},
                }
            });
        case types.CLOSE_CONFIRMATION_DIALOG:
            return update(state, {
                confirmationDialog: {
                    open: {$set: false}
                }
            });

        default:
            return state;
    }
}

export {ComponentsAction};