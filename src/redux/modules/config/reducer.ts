// src/redux/modules/config/reducer.ts

import * as types from "./types";
import update from 'immutability-helper';
import {ConfigAction} from "./actions";

export function reducer(state: object, action: ConfigAction) {
    switch (action.type) {
        case types.SET_PROJECT_DIR:
            return update(state, {
                projectDor: {$set: action.value}
            });
        default:
            return state;

    }
}

export {ConfigAction}