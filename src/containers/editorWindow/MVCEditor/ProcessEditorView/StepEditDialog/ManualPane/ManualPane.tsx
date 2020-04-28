// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/ManualPane/ManualPane.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ConfigState, ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {ManualData, TriggerEventType} from "../../../../../../interface";
import {ModelManager} from "../../../../../../controllers/model/modelManager";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import StepOutputsPane from "../StepOutputsPane";
import {Output} from "../../../../../../controllers/process/processDataHandler";

const styles = createStyles({
    root: {

    },
    form: {
        marginTop: 10,
        marginBottom: 10,
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    data: ManualData,
    onChange: (data: ManualData) => void,
}

interface State {
    modelList: string[],
}

const EventTypeList = [TriggerEventType.ADDED, TriggerEventType.MODIFIED, TriggerEventType.DELETED];

class ManualPane extends React.Component<Props, object> {
    state: State = {
        modelList: [],
    };

    componentDidMount(): void {
        this.initAction().then(r => {});
    }

    initAction = async () => {
        const {projectDir} = this.props;
        const modelList = await new ModelManager(projectDir).getModelList();
        this.setState({modelList});
    };

    handleFormChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        let {data} = this.props;
        this.props.onChange({...data, [key]: value});
    };

    getFormValue = (key: string, data: any) => {
        if (!data[key]) return "";
        return data[key];
    };

    handleOutputsUpdated = (outputs: Output[]) => {
        const {data} = this.props;
        this.props.onChange({...data, outputs});
    };

    render() {
        const {classes, data} = this.props;
        const {modelList} = this.state;
        return (
            <div className={classes.root}>
                <TextField
                    className={classes.form}
                    label={"Model"}
                    value={this.getFormValue('model', data)}
                    onChange={this.handleFormChange('model')}
                    fullWidth
                    select
                    variant={"outlined"}
                    size={"small"}
                >
                    {modelList.map((model, i) => {
                        return (
                            <MenuItem value={model} key={i}>{model}</MenuItem>
                        )
                    })}
                </TextField>

                <TextField
                    className={classes.form}
                    label={"Event Type"}
                    value={this.getFormValue('eventType', data)}
                    onChange={this.handleFormChange('eventType')}
                    fullWidth
                    select
                    variant={"outlined"}
                    size={"small"}
                >
                    {EventTypeList.map((eventType, i) => {
                        return (
                            <MenuItem value={eventType} key={i}>{eventType}</MenuItem>
                        )
                    })}
                </TextField>

                <StepOutputsPane
                    outputs={!!data.outputs ? data.outputs : []}
                    onUpdated={this.handleOutputsUpdated}
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

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ManualPane));
