// src/controllers/process/processDataHandler.ts

import {StepAttributes} from "../../containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/interface";

export interface StepData {
    name: string,
    inputs: any,
    outputs: any,
    position: any,
    id: number,
    data: {
        category: string,
        label: string,
        group: string,
        code: string,
        type: string,
        outputs: Output[]
    }
}

export interface Output {
    name: string,
    condition?: {
        key: string,
        value: string,
        operator: '==',
    }
}

export class ProcessDataHandler {
    constructor() {

    }

    parseStepData = (stepData: StepData) => {
        // convert step data to attributes, outputs and code
        const {data} = stepData;
        const {category, label, group, code, type, outputs} = data;
        const attributes = {
            category, type, group, name: label,
        };
        return {attributes, code, outputs};
    };

    updateStepData = (stepData: StepData, attributes: StepAttributes, code: string, outputs: Output[]) => {
        stepData.data = {
            label: attributes.name,
            ...attributes,
            code,
            outputs
        };
        return stepData;
    };
}