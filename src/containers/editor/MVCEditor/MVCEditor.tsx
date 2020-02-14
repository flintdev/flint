// src/containers/editor/MVCEditor/MVCEditor.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import HeaderView from "./HeaderView/HeaderView";
import {MVC} from "../../../constants/editor";
import ModelListView from "./ModelEditorView";
import ProcessEditorView from "./ProcessEditorView";

const styles = createStyles({
    root: {
        display: 'flex',
        flexFlow: "column",
        height: "100%",
    },
    content: {
        flexGrow: 1
    },
});

export interface Props extends WithStyles<typeof styles>, EditorState {

}

class MVCEditor extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes, mvcEditor} = this.props;
        const {currentView} = mvcEditor;
        return (
            <div className={classes.root}>
                <HeaderView/>
                <div className={classes.content}>
                    {currentView === MVC.Model &&
                    <ModelListView/>
                    }
                    {currentView === MVC.Controller &&
                    <ProcessEditorView/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MVCEditor));
