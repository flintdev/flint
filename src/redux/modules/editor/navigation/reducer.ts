//

import * as types from './types';
import update from 'immutability-helper';
import {NavigationAction} from "./actions";

export function reducer(state: object, action: NavigationAction) {
    switch (action.type) {
        case types.SET_CURRENT_VIEW:
            return update(state, {
                currentView: {$set: action.value}
            });
        default:
            return state;
    }
}

export {NavigationAction};