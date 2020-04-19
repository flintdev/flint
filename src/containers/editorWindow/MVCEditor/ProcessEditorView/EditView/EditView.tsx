// src/containers/editorWindow/MVCEditor/ProcessEditorView/EditView/EditView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ConfigState, ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {LOADING_STATUS} from "../../../../../constants";
import {ProcessManager} from "../../../../../controllers/process/processManager";
import {ToastType} from "../../../../../components/interface";
import * as componentsActions from "../../../../../redux/modules/components/actions";
import {stepOptions} from "../stepOptions";
import {ProcessEditor} from "@flintdev/process-editor";
import StepEditDialog from "../StepEditDialog/StepEditDialog";

const styles = createStyles({
    root: {

    },
});

interface State {
    editorDataLoadingStatus: LOADING_STATUS,
}

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    stepEditDialogOpen: (stepData: any) => void,
    updateEditorData: (editorData: any) => void,
    toastOpen: (toastType: ToastType, message: string) => void,
    exitEditing: () => void,
}

class EditView extends React.Component<Props, object> {
    state: State = {
        editorDataLoadingStatus: LOADING_STATUS.NOT_STARTED,
    };
    operations: any = {};
    processManager: ProcessManager;

    componentDidMount(): void {
        const {projectDir} = this.props;
        this.processManager = new ProcessManager(projectDir);
        this.initAction().then(r => {});
    }

    componentWillUnmount(): void {
        this.setState({
            editorDataLoadingStatus: LOADING_STATUS.NOT_STARTED,
        });
        this.props.updateEditorData(undefined);
    }

    initAction = async () => {
        this.setState({editorDataLoadingStatus: LOADING_STATUS.LOADING});
        const {processSelected} = this.props;
        const editorData = await this.processManager.getEditorData(processSelected);
        this.props.updateEditorData(editorData);
        this.setState({editorDataLoadingStatus: LOADING_STATUS.COMPLETE});
    };

    handleToastOpen = () => {
        const {processSelected} = this.props;
        const message = `${processSelected} is saved successfully`;
        this.props.toastOpen('success', message);
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

    render() {
        const {classes, editorData, processSelected} = this.props;
        const {editorDataLoadingStatus} = this.state;
        return (
            <div className={classes.root}>
                {editorDataLoadingStatus === LOADING_STATUS.COMPLETE &&
                <ProcessEditor
                    operations={this.operations}
                    name={processSelected}
                    stepOptions={stepOptions}
                    editorData={editorData}
                    onSaved={this.editorOnSaved}
                    stepDbClick={this.editorStepDbClick}
                    onClose={this.props.exitEditing}
                />
                }

                <StepEditDialog
                    operations={this.operations}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.processEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction | componentsActions.ComponentsAction>) => {
    return {
        updateEditorData: (editorData: any) => dispatch(actions.processEditor.updateEditorData(editorData)),
        toastOpen: (toastType: ToastType, message: string) => dispatch(componentsActions.toastOpen(toastType, message)),
        stepEditDialogOpen: (stepData: any) => dispatch(actions.processEditor.stepEditDialogOpen(stepData)),
        exitEditing: () => dispatch(actions.processEditor.exitEditing()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditView));
