// src/containers/editorWindow/MVCEditor/ProcessEditorView/ProcessInfoView/ProcessInfoView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ConfigState, ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Button from "@material-ui/core/Button";
import {ProcessManager} from "../../../../../controllers/process/processManager";
import {SourceFileGenerator} from "../../../../../controllers/process/sourceFileGenerator";

const styles = createStyles({
    root: {

    },
    actionButton: {
        margin: 10,
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    processEditorDialogOpen: () => void,
}

class ProcessInfoView extends React.Component<Props, object> {
    state = {

    };
    processManager: ProcessManager;
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.processManager = new ProcessManager(projectDir);
    }

    handleOpenEditorClick = () => {
        this.props.processEditorDialogOpen();
    };

    handleSyncSourceButtonClick = async () => {
        const {processSelected, projectDir} = this.props;
        const editorData = await this.processManager.getEditorData(processSelected);
        await new SourceFileGenerator(processSelected, editorData, projectDir).generate();
    };

    render() {
        const {classes, processSelected} = this.props;
        if (!processSelected) return <div/>;
        return (
            <div className={classes.root}>
                <Button
                    onClick={this.handleOpenEditorClick}
                    variant={"contained"}
                    className={classes.actionButton}
                >
                    Open Editor
                </Button>
                <Button
                    variant={"outlined"}
                    className={classes.actionButton}
                    onClick={this.handleSyncSourceButtonClick}
                >
                    Sync Source Files
                </Button>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.processEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        processEditorDialogOpen: () => dispatch(actions.processEditor.processEditorDialogOpen()),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessInfoView));
