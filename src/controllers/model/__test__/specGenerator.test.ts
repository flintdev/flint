// src/controllers/model/__test__/specGenerator.test.ts

import {SpecGenerator} from "../specGenerator";

test('render crd spec json', () => {
    const modelName = 'testmodel';
    const schemaData = {
        'f1': 'string',
        'f2': 'string',
        "f3": {
            'test': '123'
        }
    };
    // const crdJson = new SpecGenerator().renderCRDSpecJson(modelName, schemaData);
    // console.log(crdJson);
});