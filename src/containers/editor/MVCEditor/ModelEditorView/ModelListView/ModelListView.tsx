// src/containers/editor/MVCEditor/ModelEditorView/ModelListView/ModelListView.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import RadioIcon from '@material-ui/icons/Radio';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {LOADING_STATUS, themeColor} from "../../../../../constants";
import IconButton from "@material-ui/core/IconButton";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import DialogForm from "../../../../../components/DialogForm";
import {Callback, Params} from "../../../../../components/DialogForm/DialogForm";
import {CreateModelParamsDef} from "./definition";
import {ModelManager} from "../../../../../controllers/model/modelManager";

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
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
    },
    table: {
        width: '100%',
    },
    tdIcon: {
        textAlign: 'center',
        width: 30,
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

export interface Props extends WithStyles<typeof styles>, EditorState{
    setModelList: (modelList: string[]) => void,
}

class ModelListView extends React.Component<Props, object> {
    state = {
        createDialogOpen: false,
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
        this.handleCreateDialogOpen();
    };

    handleCreateModelSubmit = async (params: Params, callback: Callback) => {
        const name: string = params.name as string;
        await this.modelManager.createModel(name);
        await this.reloadModelList();
        callback.close();
    };

    reloadModelList = async () => {
        const {projectDir} = this.props;
        this.setState({loadingStatus: LOADING_STATUS.LOADING});
        const modelList = await new ModelManager(projectDir).getModelList();
        this.props.setModelList(modelList);
        this.setState({loadingStatus: LOADING_STATUS.COMPLETE});
    };

    handleCreateDialogOpen = () => {
        this.setState({createDialogOpen: true});
    };

    handleCreateDialogClose = () => {
        this.setState({createDialogOpen: false});
    };

    render() {
        const {classes} = this.props;
        const {modelList, modelSelected} = this.props.modelEditor;
        const {createDialogOpen, loadingStatus} = this.state;
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
                            <Paper className={classes.paper} key={i}>
                                <table className={classes.table}>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <Typography
                                                variant={"subtitle1"}
                                            >
                                                {modelName}
                                            </Typography>
                                        </td>
                                        <td className={classes.tdIcon}>
                                            {modelSelected === modelName ?
                                                <CheckCircleIcon className={classes.iconActive}/>
                                                :
                                                <RadioIcon className={classes.icon}/>
                                            }
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </Paper>
                        )
                    })}

                    <DialogForm
                        open={createDialogOpen}
                        onClose={this.handleCreateDialogClose}
                        title={"New Model"}
                        submitButtonTitle={"Create"}
                        forms={CreateModelParamsDef}
                        onSubmit={this.handleCreateModelSubmit}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        setModelList: (modelList: string[]) => dispatch((actions.setModelList(modelList))),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelListView));
