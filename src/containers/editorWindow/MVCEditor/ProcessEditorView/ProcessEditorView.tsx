// 

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import ProcessListView from "./ProcessListView";
import EditView from "./EditView";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    content: {
        marginTop: 2,
        flexGrow: 1,
    },
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {

}

class ProcessEditorView extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes, processSelected} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    {!processSelected &&
                    <ProcessListView/>
                    }
                    {!!processSelected &&
                    <EditView/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessEditorView));
