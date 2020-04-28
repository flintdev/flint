// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepEditDialog.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import {Output, ProcessDataHandler} from "../../../../../controllers/process/processDataHandler";
import StepAttributePane from "./StepAttributePane/StepAttributePane";
import {StepAttributes, StepType} from "./interface";
import CodeBlockPane from "./CodeBlockPane";
import TriggerPane from "./TriggerPane/TriggerPane";
import {ManualData, TriggerData, TriggerEventType} from "../../../../../interface";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import StepOutputsPane from "./StepOutputsPane";
import ManualPane from "./ManualPane";


const styles = createStyles({
    root: {},
    content: {
        marginTop: 10
    }
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
    manualData: any,
    tabIndex: number
}

class StepEditDialog extends React.Component<Props, object> {
    state: State = {
        attributes: null,
        code: '',
        outputs: [],
        triggerData: {},
        manualData: {},
        tabIndex: 0
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
        let {attributes, code, outputs} = this.parseStepData();
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
        } else if (stepData.data.type === StepType.MANUAL) {
            let manualData: ManualData;
            if (!code || code === "") {
                manualData = {model: '', eventType: TriggerEventType.MODIFIED, outputs: []};
            } else {
                manualData = JSON.parse(code);
                outputs = manualData.outputs;
            }
            this.setState({attributes, code, outputs, manualData});
        }
    };

    handleTabChange = (event: any, index: number) => {
        this.setState({tabIndex: index});
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
        let {attributes, code, outputs, triggerData, manualData} = this.state;
        const {stepData} = this.props.stepEditDialog;
        if (stepData.data.type === StepType.TRIGGER) {
            code = JSON.stringify(triggerData);
        } else if (stepData.data.type === StepType.MANUAL) {
            code = JSON.stringify(manualData);
            outputs = manualData.outputs;
        }
        const newStepData = new ProcessDataHandler().updateStepData(stepData, attributes, code, outputs);
        this.operations.updateStepData(newStepData);
        this.handleDialogClose();
    };

    handleTriggerDataOnChange = (triggerData: TriggerData) => {
        this.setState({triggerData});
    }

    handleManualDataOnChange = (manualData: ManualData) => {
        this.setState({manualData});
    };

    determineDialogMaxWidth = () => {
        const {stepData} = this.props.stepEditDialog;
        if (!stepData) return 'md';
        if (stepData.data.type === StepType.TRIGGER) return 'sm';
        if (stepData.data.type === StepType.MANUAL) return 'sm';
        return 'md';
    };

    render() {
        const {classes, stepEditDialog} = this.props;
        const {open, stepData} = stepEditDialog;
        const {attributes, code, outputs, triggerData, manualData, tabIndex} = this.state;
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
                    transitionDuration={0}
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
                        {stepData.data.type === StepType.MANUAL &&
                        <ManualPane
                            data={manualData}
                            onChange={this.handleManualDataOnChange}
                        />
                        }
                        {stepData.data.type === StepType.CODE_BLOCK &&
                        <div>
                            <Paper>
                                <Tabs
                                    value={tabIndex}
                                    onChange={this.handleTabChange}
                                    centered={true}
                                    indicatorColor={"primary"}
                                    textColor={"primary"}
                                >
                                    <Tab label={"Code Block"}/>
                                    <Tab label={"Outputs"}/>
                                </Tabs>
                            </Paper>
                            <div className={classes.content}>
                                {tabIndex === 0 &&
                                <CodeBlockPane
                                    attributes={attributes}
                                    code={code}
                                    onUpdated={this.handleCodeUpdated}
                                />
                                }
                                {tabIndex === 1 &&
                                <StepOutputsPane
                                    outputs={outputs}
                                    onUpdated={this.handleOutputsUpdated}
                                />
                                }
                            </div>
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
