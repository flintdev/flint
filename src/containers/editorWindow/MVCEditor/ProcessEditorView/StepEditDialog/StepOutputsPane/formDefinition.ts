// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepOutputsPane/formDefinition.ts

import {Form} from "../../../../../../components/interface";

const OutputConditionOptions = [
    '==', '>=', '<=', '>', '<', 'contains'
];

export const OutputParamsDef: Form[] = [
    {
        type: 'input',
        key: 'name',
        label: "Output Name",
        required: true,
        autofocus: true,
    },
    {
        type: 'input',
        key: 'key',
        label: 'Condition Key Path',
        required: true,
    },
    {
        type: 'select',
        key: 'operator',
        label: 'Condition Operator',
        required: true,
        options: OutputConditionOptions
    },
    {
        type: 'input',
        key: 'value',
        label: 'Condition Value',
        required: true,
    },
];