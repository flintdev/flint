// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/CodeBlockPane/templates/templateMap.ts

import executeFuncTemplate from './executeFunc.txt';
import triggerFuncTemplate from './triggerFunc.txt';
import {StepType} from "../../interface";
import * as _ from 'lodash';
import * as Mustache from "mustache";

export const TemplateMap = {
    [StepType.CODE_BLOCK]: (stepName: string) => {
        return Mustache.render(executeFuncTemplate, {package: _.camelCase(stepName)})
    },
    [StepType.TRIGGER]: (processName: string) => {
        return Mustache.render(triggerFuncTemplate, {package: _.camelCase(processName)})
    }
};
