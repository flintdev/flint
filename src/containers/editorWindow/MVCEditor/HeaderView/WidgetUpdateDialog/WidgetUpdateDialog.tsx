// src/containers/editorWindow/MVCEditor/HeaderView/WidgetUpdateDialog/WidgetUpdateDialog.tsx

import * as React from 'react';
import {createStyles, WithStyles, withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {NavigationState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {LOADING_STATUS} from "../../../../../constants";
import {PluginData} from "../../../../../interface";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import {green, red} from "@material-ui/core/colors";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {MainProcessCommunicator} from "../../../../../controllers/mainProcessCommunicator";
import ErrorIcon from '@material-ui/icons/Error';

const styles = createStyles({
    root: {},
    table: {
        width: '100%'
    },
    paperItem: {
        border: '1px solid grey',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
    },
    chipComplete: {
        backgroundColor: green[500],
        color: 'white'
    },
    chipError: {
        backgroundColor: red[500],
        color: 'white'
    }
});

export interface Props extends WithStyles<typeof styles>, NavigationState {
    widgetUpdateDialogClose: () => void,
}

interface State {
    loadingStatus: LOADING_STATUS,
    plugins: PluginData[],
    installStatusMap: {
        [key: string]: LOADING_STATUS
    }
}

class WidgetUpdateDialog extends React.Component<Props, object> {
    state: State = {
        loadingStatus: LOADING_STATUS.NOT_STARTED,
        plugins: [],
        installStatusMap: {}
    };

    componentDidMount(): void {

    }

    onEnter = async () => {
        this.setState({
            loadingStatus: LOADING_STATUS.LOADING,
            plugins: [],
            installStatusMap: {}
        })
        try {
            const plugins = JSON.parse(localStorage.getItem('pluginsWithUpdate'));
            this.setState({
                loadingStatus: LOADING_STATUS.COMPLETE,
                plugins,
            });
        } catch (err) {
            console.log(err);
            this.setState({
                loadingStatus: LOADING_STATUS.FAILED
            });
        }
    };

    handleUpdateClick = (plugin: PluginData) => async () => {
        let {installStatusMap} = this.state;
        installStatusMap[plugin.id] = LOADING_STATUS.LOADING;
        this.setState({installStatusMap});
        try {
            const status: any = await new MainProcessCommunicator().installPlugin(plugin);
            let {installStatusMap} = this.state;
            installStatusMap[plugin.id] = status;
            this.setState({installStatusMap});
        } catch (err) {
            console.log('err', err);
        }
    };

    handleRelaunchClick = () => {
        new MainProcessCommunicator().relaunchEditorWindow();
    };

    determineToDisplayActions = (): boolean => {
        const {installStatusMap} = this.state;
        if (!installStatusMap) return false;
        if (Object.keys(installStatusMap).length === 0) return false;
        for (let key in Object.keys(installStatusMap)) {
            if (installStatusMap[key] === LOADING_STATUS.COMPLETE) return true;
        }
        return false;
    };

    render() {
        const {classes, widgetUpdateDialog} = this.props;
        const {open} = widgetUpdateDialog;
        const {plugins, loadingStatus, installStatusMap} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.widgetUpdateDialogClose}
                    onEnter={this.onEnter}
                    fullWidth={true}
                    disableEnforceFocus={true}
                >
                    <DialogContent>
                        {plugins.map((plugin, i) => {
                            return (
                                <Paper className={classes.paperItem} key={i}>
                                    <table className={classes.table}>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Typography variant={"subtitle1"}>{plugin.name}</Typography>
                                                <Typography variant={"body2"} style={{color: 'grey'}}>{plugin.description}</Typography>
                                            </td>
                                            <td>
                                                <Typography variant={"body2"} style={{color: 'dimgrey'}}>{`${plugin.currentVersion} -> ${plugin.newVersion}`}</Typography>
                                            </td>
                                            <td align={"right"}>
                                                {!installStatusMap[plugin.id] &&
                                                <Button
                                                    size={"small"} variant={"contained"} color={"primary"}
                                                    onClick={this.handleUpdateClick(plugin)}
                                                >update</Button>
                                                }
                                                {!!installStatusMap[plugin.id] && installStatusMap[plugin.id] === LOADING_STATUS.LOADING &&
                                                <Button size={"small"} variant={"contained"} color={"primary"} disabled>Updating...</Button>
                                                }
                                                {!!installStatusMap[plugin.id] && installStatusMap[plugin.id] === LOADING_STATUS.COMPLETE &&
                                                <Chip icon={<CheckCircleIcon style={{color: 'white'}}/>} className={classes.chipComplete} label={"INSTALLED"}/>
                                                }
                                                {!!installStatusMap[plugin.id] && installStatusMap[plugin.id] === LOADING_STATUS.FAILED &&
                                                <Chip icon={<ErrorIcon style={{color: 'white'}}/>} className={classes.chipError} label={"Error"}/>
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Paper>
                            )
                        })}
                    </DialogContent>
                    {this.determineToDisplayActions() &&
                    <DialogActions>
                        <Button variant={"outlined"} onClick={this.props.widgetUpdateDialogClose}>Later</Button>
                        <Button variant={"contained"} color={"primary"} onClick={this.handleRelaunchClick}>Relaunch to Apply</Button>
                    </DialogActions>
                    }
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.navigation;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        widgetUpdateDialogClose: () => dispatch(actions.navigation.widgetUpdateDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(WidgetUpdateDialog));
