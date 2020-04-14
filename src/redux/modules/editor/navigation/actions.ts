// src/redux/modules/editorWindow/navigation/actions.ts

import * as types from './types';

// functions

export function setCurrentView(value: string): SetCurrentView {
    return { type: types.SET_CURRENT_VIEW, value }
}

export function notificationPopoverOpen(anchorEl: HTMLButtonElement): NotificationPopoverOpen {
    return { type: types.NOTIFICATION_POPOVER_OPEN, anchorEl }
}

export function notificationPopoverClose(): NotificationPopoverClose {
    return { type: types.NOTIFICATION_POPOVER_CLOSE }
}

// interfaces

export interface NotificationPopoverClose {
    type: typeof types.NOTIFICATION_POPOVER_CLOSE,
}

export interface NotificationPopoverOpen {
    type: typeof types.NOTIFICATION_POPOVER_OPEN,
    anchorEl: HTMLButtonElement
}

export interface SetCurrentView {
    type: typeof types.SET_CURRENT_VIEW,
    value: string
}

export type NavigationAction =
    NotificationPopoverOpen |
    NotificationPopoverClose |
    SetCurrentView;

