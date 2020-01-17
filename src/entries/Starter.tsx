// entries - starter

import * as React from "react";
import {render} from "react-dom";
import {Provider} from 'react-redux';
import {store} from "src/redux/store";
import StarterContainer from "../containers/starter/StarterContainer";

render(
    <Provider store={store}>
        <StarterContainer/>
    </Provider>,
    document.getElementById('rootContainer'),
);

