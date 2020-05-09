// src/redux/modules/components/actions.ts

import * as types from './types';
import {
    ConfirmationDialogSubmitFunc,
    DialogFormData,
    DialogFormSubmitFunc,
    ToastType
} from "../../../components/interface";

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

export function openConfirmationDialog(
    messageType: string,
    title: string,
    description?: string,
    submitLabel?: string,
    onSubmit?: ConfirmationDialogSubmitFunc,
): OpenConfirmationDialog {
    return { type: types.OPEN_CONFIRMATION_DIALOG, messageType, title, description, submitLabel, onSubmit}
}

export function closeConfirmationDialog(): CloseConfirmationDialog {
    return { type: types.CLOSE_CONFIRMATION_DIALOG }
}

// interfaces

export interface CloseConfirmationDialog {
    type: typeof types.CLOSE_CONFIRMATION_DIALOG,
}

export interface OpenConfirmationDialog {
    type: typeof types.OPEN_CONFIRMATION_DIALOG,
    messageType: string,
    title: string,
    submitLabel?: string,
    description?: string,
    onSubmit?: ConfirmationDialogSubmitFunc,
}

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
    OpenConfirmationDialog |
    CloseConfirmationDialog |
    OpenDialogForm |
    CloseDialogForm |
    ToastOpen |
    ToastClose;