// src/containers/editorWindow/MVCEditor/ModelEditorView/ModelListView/definition.ts

import {Form} from "../../../../../components/DialogForm/DialogForm";

export const CreateModelParamsDef: Form[] = [
    {
        type: "input",
        key: "name",
        label: "Name of data model",
        required: true,
        autofocus: true,
    }
];