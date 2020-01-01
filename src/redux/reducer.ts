// src/redux/reducer.ts

import {StoreState} from "./state";
import {reducer as starterReducer, StarterAction} from "./modules/starter/reducer";

export type Action = | StarterAction;

export function reducer(state: StoreState, action: Action) {
    return {
        starter: starterReducer(state.starter, action),
    }
}