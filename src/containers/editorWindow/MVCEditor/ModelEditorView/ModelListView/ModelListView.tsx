// src/containers/editorWindow/MVCEditor/ModelEditorView/ModelListView/ModelListView.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, ModelEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import * as componentsActions from 'src/redux/modules/components/actions';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {LOADING_STATUS, themeColor} from "../../../../../constants";
import IconButton from "@material-ui/core/IconButton";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import {CreateModelParamsDef} from "./definition";
import {ModelManager} from "../../../../../controllers/model/modelManager";
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";
import {DialogFormData, DialogFormSubmitFunc} from "../../../../../components/interface";

const styles = createStyles({
    root: {
        height: '100%',
        overflowY: 'scroll',
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    modelListContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    paper: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 15,
        marginBottom: 15,
        padding: 10,
        cursor: 'pointer',
    },
    table: {
        width: '100%',
    },
    tdIcon: {
        textAlign: 'center',
        width: 30,
        paddingTop: 5,
    },
    iconActive: {
        color: themeColor.primary,
    },
    icon: {
        color: themeColor.grey,
    },
    textRight: {
        textAlign: 'right'
    }
});

export interface Props extends WithStyles<typeof styles>, ModelEditorState, ConfigState {
    setModelList: (modelList: string[]) => void,
    selectModel: (value: string) => void,
    setEditorData: (editorData: EditorData) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
}

class ModelListView extends React.Component<Props, object> {
    state = {
        loadingStatus: LOADING_STATUS.NOT_STARTED,
    };
    modelManager: ModelManager;

    componentDidMount(): void {
        this.initActions().then(r => {});
    }

    initActions = async () => {
        const {projectDir} = this.props;
        this.modelManager = new ModelManager(projectDir);
        await this.modelManager.checkAndCreateModelDir();
        await this.reloadModelList();
    };

    handleCreateModelButtonClick = () => {
        this.props.openDialogForm(
            {},
            {
                forms: CreateModelParamsDef,
                title: 'New Model',
                submitLabel: 'Create Model'
            },
            (values) => {
                const action = async () => {
                    const name: string = values.name as string;
                    await this.modelManager.createModel(name);
                    await this.reloadModelList();
                };
                action().then(r => {});
            });
    };

    reloadModelList = async () => {
        const {projectDir} = this.props;
        this.setState({loadingStatus: LOADING_STATUS.LOADING});
        const modelList = await new ModelManager(projectDir).getModelList();
        this.props.setModelList(modelList);
        this.setState({loadingStatus: LOADING_STATUS.COMPLETE});
    };

    handleModelBoxClick = (modelName: string) => async () => {
        this.props.setEditorData(undefined);
        const editorData = await this.modelManager.getEditorData(modelName);
        // order of the 2 actions is important.
        this.props.setEditorData(editorData);
        this.props.selectModel(modelName);
        const revision = await this.modelManager.getRevision(modelName);
    };

    render() {
        const {classes} = this.props;
        const {modelList, modelSelected} = this.props;
        const {loadingStatus} = this.state;
        return (
            <div className={classes.root}>
                <table className={classes.table}>
                    <tbody>
                    <tr>
                        <td>
                            <Typography variant={"subtitle1"}>Data Models</Typography>
                        </td>
                        <td className={classes.textRight} onClick={this.handleCreateModelButtonClick}>
                            <IconButton color={"primary"}>
                                <AddBoxOutlinedIcon/>
                            </IconButton>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className={classes.modelListContainer}>
                    {loadingStatus === LOADING_STATUS.COMPLETE && modelList.map((modelName, i) => {
                        return (
                            <Paper
                                className={classes.paper}
                                key={i}
                                onClick={this.handleModelBoxClick(modelName)}
                            >
                                <table className={classes.table}>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <Typography
                                                variant={"subtitle1"}
                                                color={modelName === modelSelected ? "primary": "initial"}
                                            >
                                                {modelName}
                                            </Typography>
                                        </td>
                                        <td className={classes.tdIcon}>
                                            {modelSelected === modelName ?
                                                <CheckCircleIcon className={classes.iconActive}/>
                                                :
                                                <RadioButtonUncheckedIcon className={classes.icon}/>
                                            }
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </Paper>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.modelEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction | componentsActions.ComponentsAction>) => {
    return {
        setModelList: (modelList: string[]) => dispatch(actions.modelEditor.setModelList(modelList)),
        selectModel: (value: string) => dispatch((actions.modelEditor.selectModel(value))),
        setEditorData: (editorData: EditorData) => dispatch(actions.modelEditor.setEditorData(editorData)),
        openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => dispatch(componentsActions.openDialogForm(initValues, data, onSubmit)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelListView));
