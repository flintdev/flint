// src/components/interface.ts

export type ToastType = 'success' | 'error' | 'warning' | 'info';

type FormType = 'input' | 'select';
type FormValueType = string|number;

export interface Form {
    type: FormType,
    key: string,
    label: string,
    placeholder?: string,
    helperText?: string,
    required?: boolean,
    dataType?: string,
    autofocus?: boolean,
    defaultValue?: FormValueType,
    options?: Array<FormValueType>
}

export interface DialogFormData {
    forms: Form[],
    title: string,
    description?: string,
    submitLabel?: string,
    cancelLabel?: string,
}

export type DialogFormSubmitFunc = (values: any) => void;

