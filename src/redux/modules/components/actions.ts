// src/redux/modules/components/actions.ts

import * as types from './types';
import {DialogFormData, DialogFormSubmitFunc, ToastType} from "../../../components/interface";

// functions

export function toastOpen(toastType: ToastType, message: string): ToastOpen {
    return { type: types.TOAST_OPEN, toastType, message }
}

export function toastClose(): ToastClose {
    return { type: types.TOAST_CLOSE }
}

export function openDialogForm(
    initValues: any,
    data: DialogFormData,
    onSubmit: DialogFormSubmitFunc
): OpenDialogForm {
    return { type: types.OPEN_DIALOG_FORM, initValues, data, onSubmit }
}

export function closeDialogForm(): CloseDialogForm {
    return { type: types.CLOSE_DIALOG_FORM }
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

export interface OpenDialogForm {
    type: typeof types.OPEN_DIALOG_FORM,
    initValues: any,
    data: DialogFormData,
    onSubmit: DialogFormSubmitFunc
}

export interface CloseDialogForm {
    type: typeof types.CLOSE_DIALOG_FORM,
}

export type ComponentsAction =
    OpenDialogForm |
    CloseDialogForm |
    ToastOpen |
    ToastClose;