// src/redux/modules/components/actions.ts

import * as types from './types';
import {ToastType} from "../../../components/interface";

// functions

export function toastOpen(toastType: ToastType, message: string): ToastOpen {
    return { type: types.TOAST_OPEN, toastType, message }
}

export function toastClose(): ToastClose {
    return { type: types.TOAST_CLOSE }
}

// interfaces

export interface ToastOpen {
    type: typeof types.TOAST_OPEN,
    toastType: ToastType,
    message: string
}

export interface ToastClose {
    type: typeof types.TOAST_CLOSE,
}

export type ComponentsAction =
    ToastOpen |
    ToastClose;