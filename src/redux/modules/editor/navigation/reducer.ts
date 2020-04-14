// src/redux/modules/editor/navigation/reducer.ts

import * as types from './types';
import update from 'immutability-helper';
import {NavigationAction} from "./actions";
import {NavigationState} from "../../../state";

export function reducer(state: NavigationState, action: NavigationAction) {
    switch (action.type) {
        case types.SET_CURRENT_VIEW:
            return update(state, {
                currentView: {$set: action.value}
            });
        case types.NOTIFICATION_POPOVER_OPEN:
            return update(state, {
                notificationPopoverAnchorEl: {$set: action.anchorEl}
            });
        case types.NOTIFICATION_POPOVER_CLOSE:
            return update(state, {
                notificationPopoverAnchorEl: {$set: null}
            });

        default:
            return state;
    }
}

export {NavigationAction};