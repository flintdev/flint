// src/containers/editor/MVCEditor/ModelEditorView/ModelListView/ModelListView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {EditorState, ModelEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import RadioIcon from '@material-ui/icons/Radio';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {themeColor} from "../../../../../constants";
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

}

class ModelListView extends React.Component<Props, object> {
    state = {
        createDialogOpen: false,
    };

    modelManager: ModelManager;
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.modelManager = new ModelManager(projectDir);
        this.modelManager.checkAndCreateModelDir();
    }

    handleCreateModelButtonClick = () => {
        this.handleCreateDialogOpen();
    };

    handleCreateModelSubmit = (params: Params, callback: Callback) => {
        console.log(params);
        callback.close();
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
        const {createDialogOpen} = this.state;
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
                    {modelList.map((modelName, i) => {
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

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelListView));
