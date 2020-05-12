// src/containers/editorWindow/MVCEditor/ModelEditorView/ModelEditorView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, EditorState, ModelEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import * as componentsActions from 'src/redux/modules/components/actions';
import ModelListView from "./ModelListView";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import Chip from "@material-ui/core/Chip";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Grid from '@material-ui/core/Grid';
import TreeEditor from "./TreeEditor";
import SchemaView from "./SchemaView";
import {ModelManager} from "../../../../controllers/model/modelManager";
import ConfirmPopover from "../../../../components/ConfirmPopover";
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import {themeColor} from "../../../../constants";
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import orange from "@material-ui/core/colors/orange";
import SyncIcon from '@material-ui/icons/Sync';
import {ToastType} from "../../../../components/interface";
import {ModelEditorCanvas} from "@flintdev/model-editor-canvas";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    content: {
        marginTop: 2,
        flexGrow: 1,
    },
    table: {
        width: '100%',
        height: '100%',
        border: 0,
        cellSpacing: 0,
        cellPadding: 0,
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },
    tdLeft: {
        width: 240,
        borderRight: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
    },
    tdRight: {
        height: '100%',
        display: 'flex',
        flexFlow: "column",
    },
    headerViewContainer: {
        borderBottom: '1px solid #ddd',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerTable: {},

    textRight: {
        textAlign: 'right',
    },
    headerTitle: {
        flex: 1,
    },
    chip: {
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    chipUnselected: {
        borderRadius: 8,
        fontSize: 16,
        color: 'grey'
    },
    actionButton: {
        marginLeft: 20,
    },
    bodyViewContainer: {
        flexGrow: 1,
        display: 'flex',
        flexFlow: "column",
    },
    grid: {
        flexGrow: 1
    },
    gridItem: {
        flexGrow: 1,
        display: 'flex',
        flexFlow: "column",
    },
    emptyViewContainer: {
        height: '100%',
        textAlign: 'center',
    },
    emptyViewIcon: {
        color: themeColor.lightgrey,
        fontSize: 100,
    },
    innerContainer: {
        position: "relative",
        top: "50%",
        left: "50%",
        transform: 'translate(-50%, -50%)',
    },
    emptyViewText: {
        color: themeColor.lightgrey,
    },
    syncButton: {
        marginRight: 50,
        backgroundColor: orange[700],
        color: themeColor.white,
        height: 36,
        '&:hover': {
            backgroundColor: orange[900],

        }
    }
});

export interface Props extends WithStyles<typeof styles>, ModelEditorState, ConfigState {
    deleteModel: (modelName: string) => void,
    setCurrentRevision: (editor: number, source: number) => void,
    toastOpen: (toastType: ToastType, message: string) => void,
}

interface State {
    anchorEl: undefined | HTMLButtonElement
}

class ModelEditorView extends React.Component<Props, object> {
    state: State = {
        anchorEl: undefined
    };
    modelManager: ModelManager;
    operations: any = {};
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.modelManager = new ModelManager(projectDir);
    }

    handleConfirmDeletePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleConfirmDeletePopoverClose = () => {
        this.setState({anchorEl: undefined});
    };

    handleToastOpen = () => {
        const {modelSelected} = this.props;
        const message = `${modelSelected} is saved successfully`;
        this.props.toastOpen('success', message);
    };

    handleSaveButtonClick = async () => {
        const {projectDir, modelSelected, editorData} = this.props;
        if (!modelSelected) return;
        await new ModelManager(projectDir).saveEditorData(modelSelected, editorData);
        const revision = await this.modelManager.getRevision(modelSelected);
        this.props.setCurrentRevision(revision.editor, revision.source);
        this.handleToastOpen();
    };

    handleDeleteButtonClick = async () => {
        const {modelSelected} = this.props;
        await this.modelManager.deleteModel(modelSelected);
        this.handleConfirmDeletePopoverClose();
        this.props.deleteModel(modelSelected);
    };

    handleSyncSourceButtonClick = async () => {
        const {modelSelected, schemaData} = this.props;
        await this.modelManager.generateSourceFiles(modelSelected, schemaData);
        const revision = await this.modelManager.getRevision(modelSelected);
        this.props.setCurrentRevision(revision.editor, revision.source);
    };

    onSaved = (editorData: any) => {

    };

    onBlockDbClick = (blockData: any) => {

    };

    onSchemaBtnClick = () => {

    };

    render() {
        const {classes, modelSelected, currentRevision, editorData} = this.props;
        const {anchorEl} = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft} valign={"top"}>
                                <ModelListView/>
                            </td>
                            <td className={classes.tdRight} valign={"top"}>
                                {!modelSelected &&
                                <div className={classes.emptyViewContainer}>
                                    <div className={classes.innerContainer}>
                                        <AccountTreeOutlinedIcon className={classes.emptyViewIcon}/>
                                        <br/>
                                        <Typography
                                            variant={"h6"}
                                            className={classes.emptyViewText}
                                        >
                                            No Data Model Selected
                                        </Typography>
                                    </div>
                                </div>
                                }
                                {!!modelSelected &&
                                <React.Fragment>
                                    {/* Header View */}
                                    <div className={classes.headerViewContainer}>
                                        <table className={classes.table}>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <div className={classes.headerTitle}>
                                                        <Chip
                                                            variant={"outlined"}
                                                            label={modelSelected}
                                                            color={"primary"}
                                                            className={classes.chip}
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes.textRight}>
                                                    <React.Fragment>
                                                        {currentRevision.editor !== currentRevision.source &&
                                                        <Fab
                                                            variant={"extended"}
                                                            className={classes.syncButton}
                                                            onClick={this.handleSyncSourceButtonClick}
                                                        >
                                                            <SyncIcon/>&nbsp;
                                                            Sync Source Files
                                                        </Fab>
                                                        }
                                                        <Button
                                                            variant={"outlined"}
                                                            color={"secondary"}
                                                            className={classes.actionButton}
                                                            onClick={this.handleConfirmDeletePopoverOpen}
                                                        >
                                                            <DeleteOutlineIcon/>&nbsp;Delete
                                                        </Button>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            className={classes.actionButton}
                                                            onClick={this.handleSaveButtonClick}
                                                        >
                                                            <SaveIcon/>&nbsp;Save
                                                        </Button>
                                                    </React.Fragment>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Body view */}
                                    <div className={classes.bodyViewContainer}>
                                        <ModelEditorCanvas
                                            operations={this.operations}
                                            editorData={editorData}
                                            onSaved={this.onSaved}
                                            onBlockDbClick={this.onBlockDbClick}
                                            onSchemaBtnClick={this.onSchemaBtnClick}
                                        />
                                    </div>
                                </React.Fragment>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <ConfirmPopover
                    anchorEl={anchorEl}
                    onClose={this.handleConfirmDeletePopoverClose}
                    confirmButtonTitle={"Delete"}
                    color={"secondary"}
                    message={`Are you sure to delete ${modelSelected}?`}
                    onConfirm={this.handleDeleteButtonClick}
                />

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.modelEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction|componentsActions.ComponentsAction>) => {
    return {
        deleteModel: (modelName: string) => dispatch(actions.modelEditor.deleteModel(modelName)),
        setCurrentRevision: (editor: number, source: number) => dispatch(actions.modelEditor.setCurrentRevision(editor, source)),
        toastOpen: (toastType: ToastType, message: string) => dispatch(componentsActions.toastOpen(toastType, message)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelEditorView));
