// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepEditDialog.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import {Output, ProcessDataHandler} from "../../../../../controllers/process/processDataHandler";
import StepAttributePane from "./StepAttributePane/StepAttributePane";
import {StepAttributes, StepType} from "./interface";
import CodeBlockPane from "./CodeBlockPane";
import StepConditionPane from "./StepConditionPane";
import TriggerPane from "./TriggerPane/TriggerPane";
import {TriggerData, TriggerEventType} from "../../../../../interface";
import {Step} from "@material-ui/core";

const styles = createStyles({
    root: {},
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
    outputs: Output[],
    triggerData: any,
}

class StepEditDialog extends React.Component<Props, object> {
    state: State = {
        attributes: null,
        code: '',
        outputs: [],
        triggerData: {}
    };
    operations: Operations = {};

    componentDidMount(): void {

    }

    reset = () => {
        this.setState({
            attributes: null,
            code: '',
            outputs: []
        });
    };

    onEnter = () => {
        this.reset();
        this.operations = this.props.operations;
        const {stepData} = this.props.stepEditDialog;
        const {attributes, code, outputs} = this.parseStepData();
        if (stepData.data.type === StepType.CODE_BLOCK) {
            this.setState({attributes, code, outputs});
        } else if (stepData.data.type === StepType.TRIGGER) {
            let triggerData: TriggerData;
            if (!code || code === "") {
                triggerData = {model: '', eventType: TriggerEventType.ADDED, when: ""};
            } else {
                triggerData = JSON.parse(code);
            }
            this.setState({attributes, code, outputs, triggerData});
        }
    };

    handleDialogClose = () => {
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

    handleOutputsUpdated = (outputs: Output[]) => {
        this.setState({outputs});
    };

    handleUpdateButtonClick = () => {
        let {attributes, code, outputs, triggerData} = this.state;
        const {stepData} = this.props.stepEditDialog;
        if (stepData.data.type  === StepType.TRIGGER) {
            code = JSON.stringify(triggerData);
        }
        const newStepData = new ProcessDataHandler().updateStepData(stepData, attributes, code, outputs);
        this.operations.updateStepData(newStepData);
        this.handleDialogClose();
    };

    handleTriggerDataOnChange = (triggerData: TriggerData) => {
        this.setState({triggerData});
    }

    determineDialogMaxWidth = () => {
        const {stepData} = this.props.stepEditDialog;
        if (!stepData) return 'md';
        if (stepData.data.type === StepType.TRIGGER) return 'sm';
        return 'md';
    };

    render() {
        const {classes, stepEditDialog} = this.props;
        const {open, stepData} = stepEditDialog;
        const {attributes, code, outputs, triggerData} = this.state;
        if (!stepData) return <div/>;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.handleDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                    maxWidth={this.determineDialogMaxWidth()}
                    fullWidth={true}
                >
                    <StepAttributePane
                        attributes={attributes}
                        onUpdated={this.handleAttributesUpdated}
                    />
                    <DialogContent>
                        {stepData.data.type === StepType.TRIGGER &&
                        <TriggerPane
                            data={triggerData}
                            onChange={this.handleTriggerDataOnChange}
                        />
                        }
                        {stepData.data.type === StepType.CODE_BLOCK &&
                        <div>
                            <CodeBlockPane
                                attributes={attributes}
                                code={code}
                                onUpdated={this.handleCodeUpdated}
                            />
                            <StepConditionPane
                                outputs={outputs}
                                onUpdated={this.handleOutputsUpdated}
                            />
                        </div>
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose}>Close</Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={this.handleUpdateButtonClick}
                        >
                            Update
                        </Button>
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
