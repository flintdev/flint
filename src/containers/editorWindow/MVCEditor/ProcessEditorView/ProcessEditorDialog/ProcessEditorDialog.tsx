// src/containers/editorWindow/MVCEditor/ProcessEditorView/ProcessEditorDialog/ProcessEditorDialog.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {stepOptions} from "./stepOptions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {ProcessEditor} from "@flintdev/process-editor";
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';
import StepEditDialog from "../StepEditDialog";
import {ProcessManager} from "../../../../../controllers/process/processManager";
import Toast from 'src/components/Toast';
import {ToastType} from "../../../../../components/Toast/Toast";
import {LOADING_STATUS} from "../../../../../constants";

const styles = createStyles({
    root: {},
    dialogContent: {
        margin: -24
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    processEditorDialogClose: () => void,
    stepEditDialogOpen: (stepData: any) => void,
    updateEditorData: (editorData: any) => void,
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface State {
    toastOpen: boolean,
    toastType: ToastType,
    toastMessage: string,
    editorDataLoadingStatus: LOADING_STATUS,
}

class ProcessEditorDialog extends React.Component<Props, object> {
    state: State = {
        toastOpen: false,
        toastType: 'success',
        toastMessage: '',
        editorDataLoadingStatus: LOADING_STATUS.NOT_STARTED,
    };
    operations: object = {};
    processManager: ProcessManager;

    componentDidMount(): void {
        const {projectDir} = this.props;
        this.processManager = new ProcessManager(projectDir);
    }

    onEnter = async () => {
        this.setState({editorDataLoadingStatus: LOADING_STATUS.LOADING});
        const {processSelected} = this.props;
        const editorData = await this.processManager.getEditorData(processSelected);
        this.props.updateEditorData(editorData);
        this.setState({editorDataLoadingStatus: LOADING_STATUS.COMPLETE});
    };

    onExit = async () => {
        this.setState({
            editorDataLoadingStatus: LOADING_STATUS.NOT_STARTED,
        });
        this.props.updateEditorData(undefined);
    };

    editorOnSaved = async (editorData: any) => {
        const {processSelected} = this.props;
        await this.processManager.saveEditorData(processSelected, editorData);
        this.props.updateEditorData(editorData);
        this.handleToastOpen();
    };

    editorStepDbClick = (stepData: any) => {
        this.props.stepEditDialogOpen(stepData);
    };

    handleToastOpen = () => {
        const {processSelected} = this.props;
        this.setState({
            toastOpen: true,
            toastType: 'success',
            toastMessage: `${processSelected} is saved successfully`,
        });
    };

    handleToastClose = () => {
        this.setState({toastOpen: false});
    };

    render() {
        const {classes, processEditorDialog} = this.props;
        const {editorDataLoadingStatus} = this.state;
        console.log('editorData', processEditorDialog.editorData);
        return (
            <div className={classes.root}>
                <Dialog
                    open={processEditorDialog.open}
                    onClose={this.props.processEditorDialogClose}
                    fullScreen={true}
                    TransitionComponent={Transition}
                    disableEnforceFocus={true}
                    onEnter={this.onEnter}
                    onExit={this.onExit}
                >
                    <DialogContent className={classes.dialogContent}>
                        {editorDataLoadingStatus === LOADING_STATUS.COMPLETE &&
                        <ProcessEditor
                            operations={this.operations}
                            stepOptions={stepOptions}
                            editorData={processEditorDialog.editorData}
                            onSaved={this.editorOnSaved}
                            stepDbClick={this.editorStepDbClick}
                            onClose={this.props.processEditorDialogClose}
                        />
                        }
                    </DialogContent>
                </Dialog>

                <StepEditDialog
                    operations={this.operations}
                />

                <Toast
                    open={this.state.toastOpen}
                    onClose={this.handleToastClose}
                    type={this.state.toastType}
                    message={this.state.toastMessage}
                />

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.processEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        stepEditDialogOpen: (stepData: any) => dispatch(actions.processEditor.stepEditDialogOpen(stepData)),
        processEditorDialogClose: () => dispatch(actions.processEditor.processEditorDialogClose()),
        updateEditorData: (editorData: any) => dispatch(actions.processEditor.updateEditorData(editorData)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessEditorDialog));
