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
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {DialogFormData, DialogFormSubmitFunc} from "../../../../../components/interface";

const styles = createStyles({
    root: {
        height: '100%',
        overflowY: 'scroll',
        paddingTop: 5,
    },
    headerTable: {
        width: '100%',
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
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState, ConfigState {
    setProcessList: (processList: string[]) => void,
    selectProcess: (value: string) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
}

class ProcessListView extends React.Component<Props, object> {
    state = {
        createDialogOpen: false,
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

    handleListItemClick = (processName: string) => () => {
        this.props.selectProcess(processName);
    };

    handleDeleteProcessClick = (processName: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        await this.processManager.deleteProcess(processName);
        await this.reloadProcessList();
    };

    render() {
        const {classes, processList, processSelected} = this.props;
        const {createDialogOpen} = this.state;
        return (
            <div className={classes.root}>
                <table className={classes.headerTable}>
                    <tbody>
                    <tr>
                        <td className={classes.tdLeft}>
                            <Typography variant={"subtitle1"}>Processes</Typography>
                        </td>
                        <td className={classes.tdRight}>
                            <IconButton
                                onClick={this.handleCreateDialogOpen}
                                color={"primary"}
                            >
                                <AddIcon/>
                            </IconButton>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <List>
                    {processList.map((process, i) => {
                        return (
                            <ListItem
                                key={i}
                                dense={true}
                                button={true}
                                selected={process===processSelected}
                                onClick={this.handleListItemClick(process)}
                            >
                                <ListItemText primary={process}/>
                                <IconButton
                                    size={"small"}
                                    onClick={this.handleDeleteProcessClick(process)}
                                >
                                    <DeleteOutlineIcon fontSize={"inherit"} className={classes.deleteIcon}/>
                                </IconButton>
                            </ListItem>
                        )
                    })}
                </List>
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
        selectProcess: (value: string) => dispatch((actions.processEditor.selectProcess(value))),
        openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => dispatch(componentsActions.openDialogForm(initValues, data, onSubmit)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessListView));
