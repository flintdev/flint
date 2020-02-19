// src/containers/editorWindow/MVCEditor/ProcessEditorView/ProcessEditorDialog/ProcessEditorDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {stepOptions} from "./stepOptions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {ProcessEditor} from "@flintdev/process-editor";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

const styles = createStyles({
    root: {

    },
    dialogContent: {
        margin: -24
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    processEditorDialogClose: () => void,
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class ProcessEditorDialog extends React.Component<Props, object> {
    state = {

    };
    operations: object = {};

    componentDidMount(): void {

    }

    editorOnSaved = (processData: any, editorData: any) => {
        console.log(processData);
        console.log(editorData);
    };

    editorStepDbClick = (stepData: any) => {
        console.log(stepData);
    };

    render() {
        const {classes, processSelected, processEditorDialog} = this.props;
        return (
            <div className={classes.root}>
                <Dialog
                    open={processEditorDialog.open}
                    onClose={this.props.processEditorDialogClose}
                    fullScreen={true}
                    TransitionComponent={Transition}
                >
                    <DialogContent className={classes.dialogContent}>
                        <ProcessEditor
                            operations={this.operations}
                            stepOptions={stepOptions}
                            editorData={undefined}
                            onSaved={this.editorOnSaved}
                            stepDbClick={this.editorStepDbClick}
                            onClose={this.props.processEditorDialogClose}
                        />
                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        processEditorDialogClose: () => dispatch(actions.processEditor.processEditorDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessEditorDialog));
