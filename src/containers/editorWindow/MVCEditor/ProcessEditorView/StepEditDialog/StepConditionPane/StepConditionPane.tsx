// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepConditionPane/StepConditionPane.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Output} from "src/controllers/process/processDataHandler";

const styles = createStyles({
    root: {

    },
    paper: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerTable: {
        width: '100%',
    },
});

export interface Props extends WithStyles<typeof styles>{
    outputs: Output[],
    onUpdated: (outputs: Output[]) => void,
}

class StepConditionPane extends React.Component<Props, object> {
    state = {
        editing: false,
        name: '',
        key: '',
        operator: '',
        value: '',
    };

    componentDidMount(): void {

    }

    render() {
        const {classes, outputs} = this.props;
        return (
            <div className={classes.root}>
                <table className={classes.headerTable}>

                </table>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepConditionPane));
