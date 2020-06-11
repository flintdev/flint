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
import {LOADING_STATUS, themeColor} from "../../../../../constants";
import IconButton from "@material-ui/core/IconButton";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import {CreateModelParamsDef} from "./definition";
import {ModelManager} from "../../../../../controllers/model/modelManager";
import {ConfirmationDialogSubmitFunc, DialogFormData, DialogFormSubmitFunc} from "../../../../../components/interface";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
    paperActive: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 15,
        marginBottom: 15,
        padding: 10,
        cursor: 'pointer',
        border: `3px solid ${themeColor.primary}`
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
    },
    textActive: {
        fontWeight: 'bold',
    },
});

export interface Props extends WithStyles<typeof styles>, ModelEditorState, ConfigState {
    setModelList: (modelList: string[]) => void,
    selectModel: (value: string) => void,
    setEditorData: (editorData: any) => void,
    deleteModel: (modelName: string) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
    openConfirmationDialog: (type: string, title: string, description?: string, submitLabel?: string, onSubmit?: ConfirmationDialogSubmitFunc) => void,
}

interface State {
    loadingStatus: LOADING_STATUS,
    menuAnchorEl?: Element,
    modelNameSelected: string
}

class ModelListView extends React.Component<Props, object> {
    state: State = {
        loadingStatus: LOADING_STATUS.NOT_STARTED,
        menuAnchorEl: undefined,
        modelNameSelected: ''
    };
    modelManager: ModelManager;

    componentDidMount(): void {
        this.initActions().then(r => {
        });
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
                    const editorData = this.modelManager.getInitialEditorData(name);
                    console.log('initial editor data', editorData);
                    await this.modelManager.saveEditorData(name, editorData);
                };
                action().then(r => {
                });
            }
        );
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
        console.log('model box clicked - editor data', editorData);
        // order of the 2 actions is important.
        this.props.setEditorData(editorData);
        this.props.selectModel(modelName);
    };

    handleModelMoreButtonClick = (modelName: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        this.setState({
            modelNameSelected: modelName,
            menuAnchorEl: event.currentTarget
        })
    };

    handleRemoveModelClick = async () => {
        this.handleMenuClose();
        const {modelNameSelected} = this.state;
        this.props.openConfirmationDialog(
            'warning',
            'Remove Model',
            `Are you sure to remove Model ${modelNameSelected}?`,
            'REMOVE',
            () => {
                this.modelManager.deleteModel(modelNameSelected).then(r => {
                    this.props.deleteModel(modelNameSelected);
                })
            }
        )
    };

    handleMenuClose = () => {
        this.setState({
            menuAnchorEl: undefined
        })
    };

    render() {
        const {classes} = this.props;
        const {modelList, modelSelected} = this.props;
        const {loadingStatus, menuAnchorEl, modelNameSelected} = this.state;
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
                                className={modelName === modelSelected ? classes.paperActive : classes.paper}
                                key={i}
                                onClick={this.handleModelBoxClick(modelName)}
                            >
                                <table className={classes.table}>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <Typography
                                                className={modelName === modelSelected ? classes.textActive : undefined}
                                                variant={"subtitle1"}
                                                color={modelName === modelSelected ? "primary" : "initial"}
                                            >
                                                {modelName}
                                            </Typography>
                                        </td>
                                        <td className={classes.tdIcon}>
                                            <IconButton
                                                size={"small"}
                                                onClick={this.handleModelMoreButtonClick(modelName)}
                                            >
                                                <MoreVertIcon/>
                                            </IconButton>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </Paper>
                        )
                    })}
                </div>

                <Menu
                    anchorEl={menuAnchorEl}
                    keepMounted
                    open={Boolean(menuAnchorEl)}
                    onClose={this.handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem dense={true} onClick={this.handleRemoveModelClick}>Remove</MenuItem>
                </Menu>
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
        setEditorData: (editorData: any) => dispatch(actions.modelEditor.setEditorData(editorData)),
        deleteModel: (modelName: string) => dispatch(actions.modelEditor.deleteModel(modelName)),
        openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => dispatch(componentsActions.openDialogForm(initValues, data, onSubmit)),
        openConfirmationDialog: (type: string, title: string, description?: string, submitLabel?: string, onSubmit?: ConfirmationDialogSubmitFunc) => dispatch(componentsActions.openConfirmationDialog(type, title, description, submitLabel, onSubmit)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelListView));
