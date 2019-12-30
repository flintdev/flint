// entry - starter

import * as React from "react";
import {render} from "react-dom";
import {Provider} from 'react-redux';
import {store} from "../redux/store";

render(
    <Provider store={store}>
        <h1>TEST HELLO</h1>
    </Provider>,
    document.getElementById('rootContainer'),
);

