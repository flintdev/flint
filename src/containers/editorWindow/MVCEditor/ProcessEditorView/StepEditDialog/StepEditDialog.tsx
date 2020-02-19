// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepEditDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    operations: Operations,
    stepEditDialogOpen: (stepData: any) => void,
    stepEditDialogClose: () => void,
}

interface Operations {
    updateStepData?: (stepData: any) => void
}

class StepEditDialog extends React.Component<Props, object> {
    state = {

    };
    operations: Operations = {};
    componentDidMount(): void {

    }

    onEnter = () => {
        this.operations = this.props.operations
    };

    handleDialogClose = () => {
        const newStepData = {};
        this.operations.updateStepData(newStepData);
        this.props.stepEditDialogClose();
    };

    render() {
        const {classes, stepEditDialog} = this.props;
        const {open, stepData} = stepEditDialog;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.handleDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                    maxWidth={"lg"}
                    fullWidth={true}
                >
                    <DialogContent>

                    </DialogContent>
                    <DialogActions>
                        <Button>Close</Button>
                        <Button variant={"contained"}>Update</Button>
                    </DialogActions>
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
        stepEditDialogOpen: (stepData: any) => dispatch(actions.processEditor.stepEditDialogOpen(stepData)),
        stepEditDialogClose: () => dispatch(actions.processEditor.stepEditDialogClose()),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepEditDialog));
