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
        default:
            return state;
    }
}

export {ComponentsAction};