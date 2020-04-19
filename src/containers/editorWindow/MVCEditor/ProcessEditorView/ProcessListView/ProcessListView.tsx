// src/containers/editorWindow/MVCEditor/ProcessEditorView/ProcessListView/ProcessListView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import * as componentsActions from 'src/redux/modules/components/actions';
import {CreateProcessParamsDef} from "./definition";
import {ProcessManager} from "../../../../../controllers/process/processManager";
import {LOADING_STATUS, themeColor} from "../../../../../constants";
import {DialogFormData, DialogFormSubmitFunc} from "../../../../../components/interface";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Container from '@material-ui/core/Container';

const styles = createStyles({
    root: {
        height: '100%',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexFlow: 'column',
    },
    headerTable: {
        width: '100%',
        marginBottom: 20,
    },
    tdLeft: {
        paddingLeft: 20,
    },
    tdRight: {
        textAlign: 'right',
        paddingRight: 20,
    },
    listItemSelected: {
        backgroundColor: themeColor.primary,
        color: themeColor.white,
    },
    deleteIcon: {
        color: themeColor.dimgrey,
    },
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        flexGrow: 1,
        display: 'flex',
        flexFlow: 'column',
    },
    paper: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 30,
        flexGrow: 1
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    setProcessList: (processList: string[]) => void,
    editProcess: (processName: string) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
}

class ProcessListView extends React.Component<Props, object> {
    state = {
        loadingStatus: LOADING_STATUS.NOT_STARTED,
    };
    processManager: ProcessManager;

    componentDidMount(): void {
        const {projectDir} = this.props;
        this.processManager = new ProcessManager(projectDir);
        this.initActions().then(r => {});
    }

    initActions = async () => {
        await this.processManager.checkAndCreateProcessDir();
        await this.reloadProcessList();
    };

    reloadProcessList = async () => {
        this.setState({loadingStatus: LOADING_STATUS.LOADING});
        const processList = await this.processManager.getProcessList();
        this.props.setProcessList(processList);
        this.setState({loadingStatus: LOADING_STATUS.COMPLETE});
    };

    handleCreateDialogOpen = () => {
        this.props.openDialogForm(
            {},
            {
                forms: CreateProcessParamsDef,
                title: "New Process",
                submitLabel: "Create Process"
            },
            (values) => {
                const action = async () => {
                    const name = values.name as string;
                    await this.processManager.createProcess(name);
                    await this.reloadProcessList();
                };
                action().then(r => {});
            }
        );
    };

    handleEditClick = (processName: string) => () => {
        this.props.editProcess(processName);
    };

    handleDeleteClick = (processName: string) => async () => {
        await this.processManager.deleteProcess(processName);
        await this.reloadProcessList();
    };

    render() {
        const {classes, processList} = this.props;
        return (
            <div className={classes.root}>
                <Container maxWidth={"xl"} className={classes.container}>
                    <Paper className={classes.paper}>
                        <table className={classes.headerTable}>
                            <tbody>
                            <tr>
                                <td className={classes.tdLeft}>
                                    <Typography variant={"h6"}>Process List</Typography>
                                </td>
                                <td className={classes.tdRight}>
                                    <Button
                                        onClick={this.handleCreateDialogOpen}
                                        color={"primary"}
                                        variant={"contained"}
                                    >
                                        <AddIcon/>&nbsp;New Process
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Process Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Tags</TableCell>
                                        <TableCell>Created Time</TableCell>
                                        <TableCell>Last Updated Time</TableCell>
                                        <TableCell align={"right"}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processList.map((processName, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>{processName}</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align={"right"}>
                                                    <Button
                                                        size={"small"}
                                                        variant={"outlined"}
                                                        color={"primary"}
                                                        onClick={this.handleEditClick(processName)}
                                                    >
                                                        <EditIcon/>&nbsp;Edit
                                                    </Button>&nbsp;&nbsp;
                                                    <IconButton
                                                        size={"small"}
                                                        color={"secondary"}
                                                        onClick={this.handleDeleteClick(processName)}
                                                    >
                                                        <DeleteOutlineIcon fontSize={"small"}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.processEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction | componentsActions.ComponentsAction>) => {
    return {
        setProcessList: (processList: string[]) => dispatch(actions.processEditor.setProcessList(processList)),
        editProcess: (processName: string) => dispatch(actions.processEditor.editProcess(processName)),
        openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => dispatch(componentsActions.openDialogForm(initValues, data, onSubmit)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessListView));
