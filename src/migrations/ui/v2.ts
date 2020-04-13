// src/migrations/ui/version_2.ts

import * as _ from 'lodash';
import {UIData} from "../../controllers/ui/uiDataManager";
import {ComponentData} from "@flintdev/ui-editor/dist/interface";

const DefaultPluginId = 'material-widgets';

export async function revise(configJson: any) {
    if (!configJson) return;
    const uiData: UIData = _.get(configJson, ['editorDataMap', 'default']);
    if (!uiData) return;
    let {components} = uiData;
    if (!components) return;
    components = components.map(item => recurToUpdateComponent(item));
    uiData.components = components;
    _.set(configJson, ['editorDataMap', 'default'], uiData);
    return configJson;
}

function recurToUpdateComponent(componentData: ComponentData): ComponentData {
    let {name, children} = componentData;
    name = `${DefaultPluginId}::${name}`;
    componentData.name = name;
    if (!!children && children.length > 0) {
        componentData.children = children.map((item: ComponentData) => recurToUpdateComponent(item));
    }
    return componentData;
}