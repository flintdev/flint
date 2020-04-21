// src/containers/editorWindow/MVCEditor/UIEditorView/AddLibraryDialog/AddLibraryDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {StoreState, UIEditorState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {PluginData} from "../../../../../interface";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {MainProcessCommunicator} from "../../../../../controllers/mainProcessCommunicator";

const styles = createStyles({
    root: {

    },
    paperItem: {
        border: '1px solid grey',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10,
    },
    table: {
        width: '100%'
    },
    grey: {
        color: 'grey'
    }
});

export interface Props extends WithStyles<typeof styles>, UIEditorState {
    addLibraryDialogClose: () => void,
}

interface State {
    allPlugins: PluginData[],
    installedPluginMap: any
    showActions: boolean,
}

class AddLibraryDialog extends React.Component<Props, object> {
    state: State = {
        allPlugins: [],
        installedPluginMap: {},
        showActions: false
    };

    componentDidMount(): void {

    }

    onEnter = async () => {
        const {plugins, installedPlugins} = await new MainProcessCommunicator().fetchAllPlugins();
        let installedPluginMap: any = {};
        installedPlugins.forEach((plugin: PluginData) => {
            installedPluginMap[plugin.id] = true;
        });
        this.setState({allPlugins: plugins, installedPluginMap});
    };

    handleRelaunchClick = async () => {
        await new MainProcessCommunicator().relaunchEditorWindow();
    };

    handleRemovePluginClick = (plugin: PluginData) => async () => {

    };

    handleInstallPluginClick = (plugin: PluginData) => async () => {

    };

    render() {
        const {classes, addLibraryDialog} = this.props;
        const {open} = addLibraryDialog;
        const {allPlugins, installedPluginMap, showActions} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.addLibraryDialogClose}
                    onEnter={this.onEnter}
                    fullWidth={true}
                    disableEnforceFocus={true}
                >
                    <DialogContent>
                        {allPlugins.map((plugin, i) => {
                            const installed: boolean = !!installedPluginMap[plugin.id] ? installedPluginMap[plugin.id] : false;
                            return (
                                <Paper className={classes.paperItem}>
                                    <table className={classes.table}>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Typography variant={"subtitle2"}>{plugin.name}</Typography>
                                                <Typography variant={"body2"} className={classes.grey}>{plugin.description}</Typography>
                                            </td>
                                            <td align={"right"}>
                                                {installed &&
                                                <Button
                                                    size={"small"}
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    onClick={this.handleRemovePluginClick(plugin)}
                                                >
                                                    Remove
                                                </Button>
                                                }
                                                {!installed &&
                                                <Button
                                                    size={"small"}
                                                    variant={"outlined"}
                                                    onClick={this.handleInstallPluginClick(plugin)}
                                                >
                                                    Install
                                                </Button>
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Paper>
                            )
                        })}
                    </DialogContent>
                    {showActions &&
                    <DialogActions>
                        <Button variant={"outlined"} onClick={this.props.addLibraryDialogClose}>Later</Button>
                        <Button variant={"contained"} color={"primary"} onClick={this.handleRelaunchClick}>Relaunch</Button>
                    </DialogActions>
                    }
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.uiEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        addLibraryDialogClose: () => dispatch(actions.uiEditor.addLibraryDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddLibraryDialog));
