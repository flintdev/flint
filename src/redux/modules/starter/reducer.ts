// src/redux/modules/starter/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {StarterAction} from "./actions";

export function reducer(state: object, action: StarterAction) {
    switch (action.type) {
        case types.CREATE_PROJECT_DIALOG_OPEN:
            return update(state, {
                createProjectDialog: {
                    open: {$set: true}
                }
            });
        case types.CREATE_PROJECT_DIALOG_CLOSE:
            return update(state, {
                createProjectDialog: {
                    open: {$set: false}
                }
            });
        default:
            return state;
    }
}

export {StarterAction};