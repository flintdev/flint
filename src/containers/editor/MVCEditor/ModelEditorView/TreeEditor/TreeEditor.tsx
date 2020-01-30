// src/containers/editor/MVCEditor/ModelEditorView/TreeEditor/TreeEditor.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {LOADING_STATUS} from "../../../../../constants";
import ModelEditor from "@flintdev/model-editor";
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";
import {ModelManager} from "../../../../../controllers/model/modelManager";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const styles = createStyles({
    root: {
        padding: 20,
        flexGrow: 1
    },
    card: {
        height: '100%',
        display: 'flex',
        flexFlow: 'column'
    },
    cardContent: {
        overflow: 'scroll',
        flexGrow: 1
    },
});

export interface Props extends WithStyles<typeof styles>, EditorState {
    setEditorData: (editorData: EditorData) => void,
    setSchemaData: (schemaData: SchemaData) => void,
    setDefaultEditorData: (editorData: EditorData) => void,
}

interface State {
    loadingStatus: LOADING_STATUS,
}

class TreeEditor extends React.Component<Props, object> {
    state: State = {
        loadingStatus: LOADING_STATUS.NOT_STARTED,
    };
    modelManager: ModelManager;

    componentDidMount(): void {
        this.initActions().then(() => {});
    }

    initActions = async () => {
        const {projectDir, modelEditor} = this.props;
        const {modelSelected} = modelEditor;
        this.modelManager = new ModelManager(projectDir);
        this.setState({loadingStatus: LOADING_STATUS.LOADING});
        const editorData = await this.modelManager.getEditorData(modelSelected);
        this.props.setEditorData(editorData);
        this.props.setDefaultEditorData(editorData);
        this.setState({loadingStatus: LOADING_STATUS.COMPLETE});
    };

    handleModelEditorUpdated = (schemaData: SchemaData, editorData: EditorData) => {
        this.props.setEditorData(editorData);
        this.props.setSchemaData(schemaData);
    };

    render() {
        const {classes, modelEditor} = this.props;
        const {modelSelected, editorData, defaultEditorData} = modelEditor;
        const {loadingStatus} = this.state;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={<Avatar><AccountTreeIcon/></Avatar>}
                        title={<Typography variant={"subtitle1"}>Tree Editor</Typography> }
                        subheader={'Define the schema structure of data model'}
                    />
                    <CardContent className={classes.cardContent}>
                        {!!modelSelected && loadingStatus === LOADING_STATUS.COMPLETE &&
                        <ModelEditor
                            modelName={modelSelected}
                            editorData={defaultEditorData}
                            onUpdated={this.handleModelEditorUpdated}
                        />
                        }
                    </CardContent>
                </Card>

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        setEditorData: (editorData: EditorData) => dispatch(actions.setEditorData(editorData)),
        setDefaultEditorData: (editorData: EditorData) => dispatch(actions.setDefaultEditorData(editorData)),
        setSchemaData: (schemaData: SchemaData) => dispatch(actions.setSchemaData(schemaData)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TreeEditor));
