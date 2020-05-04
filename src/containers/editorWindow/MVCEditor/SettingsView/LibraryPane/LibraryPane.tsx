// src/containers/editorWindow/MVCEditor/SettingsView/ComponentsPane/ComponentsPane.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {green, red} from "@material-ui/core/colors";
import {LOADING_STATUS} from "../../../../../constants";
import {PluginData} from "../../../../../interface";
import {MainProcessCommunicator} from "../../../../../controllers/mainProcessCommunicator";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = createStyles({
    root: {},
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

export interface Props extends WithStyles<typeof styles> {

}

interface State {
    allPlugins: PluginData[],
    pluginStatusMap: any
    showActions: boolean,
}

class LibraryPane extends React.Component<Props, object> {
    state: State = {
        allPlugins: [],
        pluginStatusMap: {},
        showActions: false
    };

    componentDidMount(): void {
        this.initActions().then(r => {
        });
    }

    initActions = async () => {
        const {plugins, installedPlugins} = await new MainProcessCommunicator().fetchAllPlugins();
        let pluginStatusMap: any = {};
        installedPlugins.forEach((plugin: PluginData) => {
            pluginStatusMap[plugin.id] = LOADING_STATUS.COMPLETE;
        });
        this.setState({allPlugins: plugins, pluginStatusMap});
    };

    handleRelaunchClick = async () => {
        await new MainProcessCommunicator().relaunchEditorWindow();
    };

    handleRemovePluginClick = (plugin: PluginData) => async () => {
        await new MainProcessCommunicator().removePlugin(plugin);
        let {pluginStatusMap} = this.state;
        delete pluginStatusMap[plugin.id];
        this.setState({pluginStatusMap, showActions: true});
    };

    handleInstallPluginClick = (plugin: PluginData) => async () => {
        let {pluginStatusMap} = this.state;
        pluginStatusMap[plugin.id] = LOADING_STATUS.LOADING;
        this.setState({pluginStatusMap});
        const status = await new MainProcessCommunicator().installPlugin(plugin);
        pluginStatusMap[plugin.id] = status;
        this.setState({showActions: true, pluginStatusMap});
    };

    render() {
        const {classes} = this.props;
        const {allPlugins, pluginStatusMap, showActions} = this.state;
        return (
            <div className={classes.root}>
                {allPlugins.map((plugin, i) => {
                    const status = pluginStatusMap[plugin.id];
                    return (
                        <Paper className={classes.paperItem} key={i}>
                            <table className={classes.table}>
                                <tbody>
                                <tr>
                                    <td>
                                        <Typography variant={"subtitle2"}>{plugin.name}</Typography>
                                        <Typography variant={"body2"}
                                                    className={classes.grey}>{plugin.description}</Typography>
                                    </td>
                                    <td align={"right"}>
                                        {status === LOADING_STATUS.COMPLETE &&
                                        <Button
                                            size={"small"}
                                            variant={"contained"}
                                            color={"secondary"}
                                            onClick={this.handleRemovePluginClick(plugin)}
                                        >
                                            Remove
                                        </Button>
                                        }
                                        {status === LOADING_STATUS.LOADING &&
                                        <Button
                                            size={"small"}
                                            variant={"outlined"}
                                            disabled={true}
                                        >
                                            Installing...
                                        </Button>
                                        }
                                        {!status &&
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
                <br/>
                {showActions &&
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.handleRelaunchClick}
                >
                    Relaunch to apply
                </Button>
                }
            </div>
        )
    }
}

export default withStyles(styles)(LibraryPane);
