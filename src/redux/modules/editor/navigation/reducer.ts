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
        case types.ADD_NOTIFICATION:
            return update(state, {
                notifications: {$push: [action.notification]}
            });
        case types.RESET_NOTIFICATIONS:
            return update(state, {
                notifications: {$set: []}
            });
        case types.WIDGET_UPDATE_DIALOG_OPEN:
            return update(state, {
                widgetUpdateDialog: {
                    open: {$set: true}
                }
            });
        case types.WIDGET_UPDATE_DIALOG_CLOSE:
            return update(state, {
                widgetUpdateDialog: {
                    open: {$set: false}
                }
            });

        default:
            return state;
    }
}

export {NavigationAction};