import {applyMiddleware, createStore} from "redux";
import {initState} from "./state";
import {reducer} from "./reducer";
import thunk from 'redux-thunk';

// @ts-ignore
export const store = createStore(
    reducer,
    initState,
    applyMiddleware(thunk)
);
