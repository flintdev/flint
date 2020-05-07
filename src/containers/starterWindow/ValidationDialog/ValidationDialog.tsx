// src/containers/starterWindow/ValidationDialog/ValidationDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {StoreState, ValidationDialogState} from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import {UIDataManager} from "../../../controllers/ui/uiDataManager";
import {MainProcessCommunicator} from "../../../controllers/mainProcessCommunicator";
import {PluginData} from "../../../interface";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = createStyles({
    root: {

    },
    center : {
        textAlign: "center"
    },
    paperItem: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        border: '1px solid grey',
    },
    tableItem: {
        width: '100%'
    },
    grey: {
        color: 'grey'
    },
});

export interface Props extends WithStyles<typeof styles>, ValidationDialogState {
    validationDialogClose: () => void,
}

interface State {
    status: 'initialized' | 'validating' | 'need_install_plugins' | 'installing_plugins' | 'plugins_installed',
    uninstalledPlugins: PluginData[],

}

class ValidationDialog extends React.Component<Props, object> {
    state: State = {
        status: "initialized",
        uninstalledPlugins: [],
    };
    mainProcessCommunicator = new MainProcessCommunicator();
    componentDidMount(): void {

    }

    onEnter = async () => {
        this.setState({status: 'validating'});
        const {projectDirSelected} = this.props;
        const pluginIdList = await new UIDataManager(projectDirSelected).getDependentPlugins();
        const uninstalledPlugins: PluginData[] = await this.mainProcessCommunicator.getUninstalledDependentPlugins(pluginIdList);
        if (uninstalledPlugins.length === 0) {
            this.props.validationDialogClose();
            await this.mainProcessCommunicator.switchFromStarterToEditorWindow(projectDirSelected);
        } else {
            this.setState({
                status: "need_install_plugins",
                uninstalledPlugins
            });
        }
    };

    handleInstallPluginsClick = async () => {
        const {projectDirSelected} = this.props;
        const {uninstalledPlugins} = this.state;
        this.setState({status: 'installing_plugins'});
        for (const plugin of uninstalledPlugins) {
            await this.mainProcessCommunicator.installPlugin(plugin);
        }
        this.setState({
            status: 'plugins_installed',
        });
        await this.mainProcessCommunicator.switchFromStarterToEditorWindow(projectDirSelected);
    };

    render() {
        const {classes, open} = this.props;
        const {status, uninstalledPlugins} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.validationDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                >
                    <DialogContent>
                        {status === "validating" &&
                        <div className={classes.center}>
                            <CircularProgress color="primary"/>
                            <br/>
                            <Typography variant={"body2"}>Validating...</Typography>
                        </div>
                        }
                        {(status === "need_install_plugins" || status === "installing_plugins" || status === "plugins_installed") &&
                        <div>
                            {uninstalledPlugins.map((plugin, i) => {
                                return (
                                    <Paper className={classes.paperItem} key={i}>
                                        <table className={classes.tableItem}>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Typography variant={"subtitle1"}>{plugin.name}</Typography>
                                                </td>
                                                <td align={"right"}>
                                                    <Typography variant={"subtitle1"} className={classes.grey}>{plugin.currentVersion}</Typography>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </Paper>
                                )
                            })}
                            <br/>
                        </div>
                        }
                    </DialogContent>
                    <DialogActions>
                        {status === "need_install_plugins" &&
                        <Button variant={"contained"} color={"primary"} onClick={this.handleInstallPluginsClick}>Install Plugins</Button>
                        }
                        {status === "installing_plugins" &&
                        <Button variant={"contained"} color={"primary"} disabled={true}>Installing...</Button>
                        }
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter.validationDialog;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {
        validationDialogClose: () => dispatch(actions.validationDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ValidationDialog));
