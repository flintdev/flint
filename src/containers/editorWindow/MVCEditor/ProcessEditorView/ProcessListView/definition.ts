// src/containers/editorWindow/MVCEditor/ProcessEditorView/ProcessListView/definition.ts

import {Form} from 'src/components/DialogForm';

export const CreateProcessParamsDef: Form[] = [
    {
        type: "input",
        key: "name",
        label: "Process Name",
        required: true,
        autofocus: true,
    }
];
