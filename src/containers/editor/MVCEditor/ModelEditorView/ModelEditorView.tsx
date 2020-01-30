// src/containers/editor/MVCEditor/ModelEditorView/ModelEditorView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import ModelListView from "./ModelListView";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import Chip from "@material-ui/core/Chip";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Grid from '@material-ui/core/Grid';
import TreeEditor from "./TreeEditor";
import SchemaView from "./SchemaView";
import {ModelManager} from "../../../../controllers/model/modelManager";
import Toast from "../../../../components/Toast";
import {ToastType} from "../../../../components/Toast/Toast";
import ConfirmPopover from "../../../../components/ConfirmPopover";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    content: {
        marginTop: 2,
        // marginLeft: 1,
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
    }
});

export interface Props extends WithStyles<typeof styles>, EditorState {

}

interface State {
    toastOpen: boolean,
    toastType: ToastType,
    toastMessage: string,
    anchorEl: undefined | HTMLButtonElement
}

class ModelEditorView extends React.Component<Props, object> {
    state: State = {
        toastOpen: false,
        toastType: 'success',
        toastMessage: '',
        anchorEl: undefined
    };

    componentDidMount(): void {

    }

    handleConfirmDeletePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleConfirmDeletePopoverClose = () => {
        this.setState({anchorEl: undefined});
    };

    handleToastOpen = () => {
        const {modelSelected} = this.props.modelEditor;
        this.setState({
            toastOpen: true,
            toastType: 'success',
            toastMessage: `${modelSelected} is saved successfully`,
        });
    };

    handleToastClose = () => {
        this.setState({
            toastOpen: false,
        });
    };

    handleSaveButtonClick = async () => {
        const {projectDir, modelEditor} = this.props;
        const {modelSelected, editorData, schemaData} = modelEditor;
        if (!modelSelected) return;
        await new ModelManager(projectDir).saveEditorData(modelSelected, editorData);
        this.handleToastOpen();
    };

    handleDeleteButtonClick = () => {

    };

    render() {
        const {classes, projectDir, modelEditor} = this.props;
        const {toastOpen, toastType, toastMessage} = this.state;
        const {modelSelected} = modelEditor;
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
                                {/* Header View */}
                                <div className={classes.headerViewContainer}>
                                    <table className={classes.table}>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <div className={classes.headerTitle}>
                                                    {!modelSelected &&
                                                    <Chip variant={"outlined"} label={"model unselected"}
                                                          className={classes.chipUnselected}/>}
                                                    {!!modelSelected &&
                                                    <Chip variant={"outlined"} label={modelSelected} color={"primary"}
                                                          className={classes.chip}/>}
                                                </div>
                                            </td>
                                            <td className={classes.textRight}>
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
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* Body view */}
                                <div className={classes.bodyViewContainer}>
                                    <Grid container spacing={0} className={classes.grid}>
                                        <Grid item xs={6} className={classes.gridItem}>
                                            <TreeEditor/>
                                        </Grid>
                                        <Grid item xs={6} className={classes.gridItem}>
                                            <SchemaView/>
                                        </Grid>
                                    </Grid>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <Toast
                    open={toastOpen}
                    onClose={this.handleToastClose}
                    type={toastType}
                    message={toastMessage}
                />

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
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModelEditorView));
