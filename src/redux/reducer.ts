// src/redux/reducer.ts

import {StoreState} from "./state";
import {reducer as starterReducer, StarterAction} from "./modules/starter/reducer";
import {reducer as configReducer, ConfigAction} from "./modules/config/reducer";

export type Action = StarterAction & ConfigAction;

export function reducer(state: StoreState, action: Action) {
    return {
        starter: starterReducer(state.starter, action),
        config: configReducer(state.config, action),
    }
}