// src/migrations/ui/revise.ts

import {revise as v2} from "./v2";

export async function revise(configData: any) {
    let {schemaVersion} = configData;
    schemaVersion = !!schemaVersion ? schemaVersion : 1;
    if (schemaVersion < 2) configData = await v2(configData);
    if (!configData) return;
    // add following versions
    return configData;
}