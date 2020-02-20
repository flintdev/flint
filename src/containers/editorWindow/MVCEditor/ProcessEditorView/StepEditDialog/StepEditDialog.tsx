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
import {ProcessDataHandler} from "../../../../../controllers/process/processDataHandler";
import StepAttributePane from "./StepAttributePane/StepAttributePane";
import {StepAttributes} from "./interface";
import CodeBlockPane from "./CodeBlockPane";

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    operations: Operations,
    stepEditDialogClose: () => void,
}

interface Operations {
    updateStepData?: (stepData: any) => void
}

interface State {
    attributes: StepAttributes,
    code: string,
    outputs: object[]
}

class StepEditDialog extends React.Component<Props, object> {
    state: State = {
        attributes: null,
        code: '',
        outputs: []
    };
    operations: Operations = {};
    componentDidMount(): void {

    }

    onEnter = () => {
        this.operations = this.props.operations;
        const {attributes, code, outputs} = this.parseStepData();
        this.setState({attributes, code, outputs});
    };

    handleDialogClose = () => {
        const newStepData = {};
        this.operations.updateStepData(newStepData);
        this.props.stepEditDialogClose();
    };

    parseStepData = () => {
        const {stepData} = this.props.stepEditDialog;
        if (!stepData) return {attributes: null, code: '', outputs: null};
        return new ProcessDataHandler().parseStepData(stepData);
    };

    handleAttributesUpdated = (attributes: StepAttributes) => {
        this.setState({attributes});
    };

    handleCodeUpdated = (code: string) => {
        this.setState({code});
    };

    render() {
        const {classes, stepEditDialog} = this.props;
        const {open} = stepEditDialog;
        const {attributes, code, outputs} = this.state;
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
                        <StepAttributePane
                            attributes={attributes}
                            onUpdated={this.handleAttributesUpdated}
                        />
                        <CodeBlockPane
                            code={code}
                            onUpdated={this.handleCodeUpdated}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button>Close</Button>
                        <Button variant={"contained"} color={"primary"}>Update</Button>
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
        stepEditDialogClose: () => dispatch(actions.processEditor.stepEditDialogClose()),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepEditDialog));
