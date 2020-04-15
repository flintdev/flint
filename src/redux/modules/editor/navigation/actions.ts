// src/redux/modules/editorWindow/navigation/actions.ts

import * as types from './types';
import {Notification} from "../../../../interface";

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

export function addNotification(notification: Notification): AddNotification {
    return { type: types.ADD_NOTIFICATION, notification }
}

export function resetNotifications(): ResetNotifications {
    return { type: types.RESET_NOTIFICATIONS }
}

export function widgetUpdateDialogOpen(): WidgetUpdateDialogOpen {
    return { type: types.WIDGET_UPDATE_DIALOG_OPEN }
}

export function widgetUpdateDialogClose(): WidgetUpdateDialogClose {
    return { type: types.WIDGET_UPDATE_DIALOG_CLOSE }
}

// interfaces

export interface ResetNotifications {
    type: typeof types.RESET_NOTIFICATIONS,
}

export interface AddNotification {
    type: typeof types.ADD_NOTIFICATION,
    notification: Notification,
}

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

export interface WidgetUpdateDialogOpen {
    type: typeof types.WIDGET_UPDATE_DIALOG_OPEN,
}

export interface WidgetUpdateDialogClose {
    type: typeof types.WIDGET_UPDATE_DIALOG_CLOSE,
}

export type NavigationAction =
    WidgetUpdateDialogOpen |
    WidgetUpdateDialogClose |
    AddNotification |
    ResetNotifications |
    NotificationPopoverOpen |
    NotificationPopoverClose |
    SetCurrentView;

