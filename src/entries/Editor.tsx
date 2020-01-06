// entries - starter

import * as React from "react";
import {render} from "react-dom";
import {Provider} from 'react-redux';
import {store} from "src/redux/store";
import StarterContainer from "../containers/editor/EditorContainer";
import 'antd/dist/antd.css';

render(
    <Provider store={store}>
        <StarterContainer/>
    </Provider>,
    document.getElementById('rootContainer'),
);

