// entries - starter

import * as React from "react";
import {render} from "react-dom";
import {Provider} from 'react-redux';
import {store} from "src/redux/store";
import EditorContainer from "src/containers/editor/EditorContainer";
import 'antd/dist/antd.less';

render(
    <Provider store={store}>
        <EditorContainer/>
    </Provider>,
    document.getElementById('rootContainer'),
);
