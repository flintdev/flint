// entries - starterWindow

import * as React from "react";
import {render} from "react-dom";
import {Provider} from 'react-redux';
import {store} from "src/redux/store";
import EditorContainer from "src/containers/editorWindow/EditorContainer";
import 'typeface-roboto';
import {MainProcessCommunicator} from "../controllers/mainProcessCommunicator";
import ErrorBoundary from "../components/ErrorBoundary";

render(
    <Provider store={store}>
        <ErrorBoundary>
            <EditorContainer/>
        </ErrorBoundary>
    </Provider>,
    document.getElementById('rootContainer'),
);

new MainProcessCommunicator().initGlobalListeners();