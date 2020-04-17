// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/TriggerPane/TriggerPane.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {TriggerData, TriggerEventType} from "../../../../../../interface";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {ModelManager} from "../../../../../../controllers/model/modelManager";
import {ConfigState, ProcessEditorState, StoreState} from "../../../../../../redux/state";
import {Dispatch} from "redux";
import * as actions from "../../../../../../redux/modules/editor/actions";
import {connect} from "react-redux";

const styles = createStyles({
    root: {

    },
    form: {
        marginTop: 10,
        marginBottom: 10,
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    data: TriggerData
    onChange: (data: TriggerData) => void,
}

interface State {
    modelList: string[],
}

const EventTypeList = [TriggerEventType.ADDED, TriggerEventType.MODIFIED, TriggerEventType.DELETED];

class TriggerPane extends React.Component<Props, object> {
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

    render() {
        const {classes} = this.props;
        const {data} = this.props;
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

                <TextField
                    className={classes.form}
                    label={"When"}
                    value={this.getFormValue('when', data)}
                    onChange={this.handleFormChange('when')}
                    fullWidth
                    variant={"outlined"}
                    size={"small"}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TriggerPane));

