// src/redux/modules/config/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {ConfigAction} from "./actions";

export function reducer(state: object, action: ConfigAction) {
    switch (action.type) {
        case types.SET_CURRENT_PAGE:
            return update(state, {
                currentPageIndex: {$set: action.pageIndex}
            });
        case types.SET_PROJECT_DIR:
            return update(state, {
                projectDir: {$set: action.value}
            });
        default:
            return state;
    }
}

export {ConfigAction};