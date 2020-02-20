// src/controllers/process/sourceFileGenerator.ts

import {EditorData} from "@flintdev/process-editor";
import {Output} from "./processDataHandler";

export class SourceFileGenerator {
    editorData: EditorData;
    constructor(editorData: EditorData) {
        this.editorData = editorData;
    }

    private generateStepFile = async (stepName: string, code: string) => {

    };

    private generateWorkflowDefinition = async (stepName: string, outputs: Output[]) => {

    };

    private generateWorkflowConfig = async () => {

    };
}