// src/controllers/model/specGenerator.ts

import * as yaml from 'js-yaml';
import * as _ from 'lodash';
import crdTemplate from './templates/crd.yaml';
import * as Mustache from "mustache";

export class SpecGenerator {
    constructor() {

    }

    renderCRDSpecYaml = (modelName: string, schemaData: any) => {
        // modelName must be lowercase
        const plural = `${modelName.toLowerCase()}s`;
        const singular = modelName.toLowerCase();
        const camelCase = _.camelCase(modelName);
        const kind = _.capitalize(camelCase);
        const partialRenderedTemplate = Mustache.render(crdTemplate, {
            plural, singular, kind,
        });
        let crdJsonStr = JSON.stringify(yaml.safeLoad(partialRenderedTemplate));
        crdJsonStr = crdJsonStr.replace('"$schemaData$"', JSON.stringify(schemaData));
        const crdJson = JSON.parse(crdJsonStr);
        return yaml.safeDump(crdJson);
    };
}