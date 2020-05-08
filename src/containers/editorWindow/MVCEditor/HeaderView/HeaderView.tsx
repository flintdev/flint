// src/containers/editorWindow/MVCEditor/HeaderView/HeaderView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, EditorState, NavigationState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {ProjectManager} from "../../../../controllers/project/projectManager";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {theme, themeColor} from "../../../../constants";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {MVC, MVCViews} from "../../../../constants/editor";
import WebIcon from '@material-ui/icons/Web';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {HeaderViewConfig} from "../../../../constants/styles";
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CodeIcon from '@material-ui/icons/Code';
import {ToastType} from "../../../../components/interface";
import * as componentsActions from "../../../../redux/modules/components/actions";
import {SourceFileGenerator as UISourceFileGenerator} from "../../../../controllers/ui/sourceFileGenerator";
import {SourceFileGenerator as ProcessSourceFileGenerator} from "../../../../controllers/process/sourceFileGenerator";
import {MainProcessCommunicator} from "../../../../controllers/mainProcessCommunicator";
import {UIDataManager} from "../../../../controllers/ui/uiDataManager";
import Tooltip from "@material-ui/core/Tooltip";
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NotificationListView from "./NotificationListView";
import Badge from "@material-ui/core/Badge";
import {Notification} from "../../../../interface";
import WidgetUpdateDialog from "./WidgetUpdateDialog";
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import HistoryIcon from '@material-ui/icons/History';

const styles = createStyles({
    root: {},
    paper: {
        height: HeaderViewConfig.Height,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 0,
        marginLeft: -1,
        marginRight: -1
    },
    table: {
        width: '100%',
        height: HeaderViewConfig.Height,
    },
    tdLeft: {},
    tdRight: {
        textAlign: 'right',
    },
    projectTitle: {
        color: themeColor.dimgrey,
        fontSize: 16,
        fontWeight: 'bold',
        display: 'inline-block',
    },
    projectDir: {
        color: themeColor.grey,
        fontSize: 14,
        display: 'inline-block',
    },
    projectSelect: {
        marginRight: 20,
        marginTop: 0,
    },
    viewSelect: {},
    toggleButtonActive: {
        color: themeColor.white,
        backgroundColor: themeColor.primary,
    },
    projectIcon: {
        marginTop: -3,
    },
    actionIconButtonGreen: {
        color: HeaderViewConfig.ActionIconColorGreen,
        marginRight: 10,
    },
    actionIconButtonBlue: {
        color: HeaderViewConfig.ActionIconColorBlue,
        marginRight: 10,
    },
    actionIconButtonGrey: {
        color: themeColor.grey,
        marginRight: 10,
    },
    fabRun: {
        marginRight: 10,
        width: HeaderViewConfig.FabButtonRadius,
        height: HeaderViewConfig.FabButtonRadius,
        backgroundColor: HeaderViewConfig.ActionIconColorGreen,
        color: themeColor.white,
        '&:hover': {
            backgroundColor: HeaderViewConfig.ActionIconColorGreenDark,
        }
    },
    IconButtonNotification: {
        marginRight: 10,
        width: HeaderViewConfig.FabButtonRadius,
        height: HeaderViewConfig.FabButtonRadius,
        border: '1px solid grey',
    },
    fabCode: {
        marginRight: 10,
        width: HeaderViewConfig.FabButtonRadius,
        height: HeaderViewConfig.FabButtonRadius,
    },
    viewButtonDefault: {
        color: themeColor.dimgrey,
        backgroundColor: HeaderViewConfig.ViewButtonBgColor,
    },
});

const ViewIconMap = {
    [MVC.Model]: <AccountTreeOutlinedIcon/>,
    [MVC.View]: <WebIcon/>,
    [MVC.Controller]: <ControlCameraIcon/>,
};

export interface Props extends WithStyles<typeof styles>, NavigationState, ConfigState {
    setCurrentView: (value: string) => void,
    toastOpen: (toastType: ToastType, message: string) => void,
    increaseMark: () => void,
    beforeGeneratingCode: () => Promise<void>,
    notificationPopoverOpen: (anchorEl: HTMLButtonElement) => void,
    addNotification: (notification: Notification) => void,
    settingsDialogOpen: () => void,
}

class HeaderView extends React.Component<Props, object> {
    state = {};
    uiSourceFileGenerator: UISourceFileGenerator;
    processSourceFileGenerator: ProcessSourceFileGenerator;
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.uiSourceFileGenerator = new UISourceFileGenerator(projectDir);
        this.processSourceFileGenerator = new ProcessSourceFileGenerator(projectDir);
        new MainProcessCommunicator().addNewPluginsListener((plugins => {
            const notification: Notification = {
                type: "widget-update",
                title: `${plugins.length} widget(s) have new updates`,
                subtitle: plugins.map(plugin => plugin.name).join(', ')
            }
            let duplicated = false;
            for (const item of this.props.notifications) {
                if (item.type === "widget-update") {
                    duplicated = true;
                    break;
                }
            }
            if (!duplicated) this.props.addNotification(notification);
            localStorage.setItem('pluginsWithUpdate', JSON.stringify(plugins));
        }));
    }

    handleViewButtonClick = (value: string) => (event: React.MouseEvent<HTMLElement>) => {
        if (!!value) this.props.setCurrentView(value);
    };

    handleGenerateCode = async () => {
        await this.props.beforeGeneratingCode();
        await this.uiSourceFileGenerator.generate();
        await this.processSourceFileGenerator.generate();
        this.props.toastOpen('success', 'Source code is generated successfully');
    };

    handleRunClick = async () => {
        const {projectDir} = this.props;
        const dir = `${projectDir}/src/ui`;
        const uiData = await new UIDataManager(projectDir).getUIData();
        const localStorage = uiData?.settings?.localStorage;
        const localStorageItems = !!localStorage ? localStorage : [];
        await new MainProcessCommunicator().startDebugging(dir, localStorageItems);
    };

    handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.notificationPopoverOpen(event.currentTarget);
    };

    handleConfigButtonClick = () => {
        this.props.settingsDialogOpen();
    };

    handleHistoryClick = () => {

    };

    renderHistoryButton = () => {
        const {classes} = this.props;
        return (
            <IconButton
                size={"small"}
                className={classes.IconButtonNotification}
                onClick={this.handleHistoryClick}
            >
                <HistoryIcon/>
            </IconButton>
        )
    };

    renderNotificationButton = () => {
        const {classes, notifications} = this.props;
        const hasNotifications = !!notifications && notifications.length > 0;
        return (
            <IconButton
                size={"small"}
                className={classes.IconButtonNotification}
                onClick={this.handleNotificationClick}
            >
                {hasNotifications &&
                <Badge badgeContent={notifications.length} color={"secondary"}>
                    <NotificationsNoneIcon/>
                </Badge>
                }
                {!hasNotifications && <NotificationsNoneIcon/>}
            </IconButton>
        )
    };

    renderConfigButton = () => {
        const {classes} = this.props;
        return (
            <IconButton
                size={"small"}
                className={classes.IconButtonNotification}
                onClick={this.handleConfigButtonClick}
            >
                <BuildOutlinedIcon/>
            </IconButton>
        )
    };

    render() {
        const {classes, projectDir, currentView} = this.props;
        const projectName = new ProjectManager(projectDir).getProjectName();
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft} valign={"middle"}>
                                <TextField
                                    className={classes.projectSelect}
                                    select
                                    value={projectName}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FolderOpenIcon fontSize={"small"} className={classes.projectIcon}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value={projectName}>{projectName}</MenuItem>
                                </TextField>

                                <ButtonGroup
                                    className={classes.viewSelect}
                                    variant={"contained"}
                                    size={"small"}
                                >
                                    {MVCViews.map((view, i) => {
                                        return (
                                            <Button
                                                className={currentView === view.key ? null : classes.viewButtonDefault}
                                                color={currentView === view.key ? 'primary' : 'default'}
                                                key={i}
                                                onClick={this.handleViewButtonClick(view.key)}
                                            >
                                                {ViewIconMap[view.key]}&nbsp;
                                                {view.name}
                                            </Button>
                                        )
                                    })}
                                </ButtonGroup>

                            </td>
                            <td className={classes.tdRight}>
                                <Tooltip title={"Run & Open Debug Window"}>
                                    <Fab size={"small"} className={classes.fabRun} onClick={this.handleRunClick}>
                                        <PlayArrowIcon/>
                                    </Fab>
                                </Tooltip>
                                <Tooltip title={"Generate Source Code"}>
                                    <Fab
                                        size={"small"}
                                        className={classes.fabCode}
                                        onClick={this.handleGenerateCode}
                                        color={"primary"}
                                    >
                                        <CodeIcon/>
                                    </Fab>
                                </Tooltip>
                                <Tooltip title={"Revision History"}>
                                    {this.renderHistoryButton()}
                                </Tooltip>
                                <Tooltip title={"Configuration"}>
                                    {this.renderConfigButton()}
                                </Tooltip>
                                <Tooltip title={"Notifications"}>
                                    {this.renderNotificationButton()}
                                </Tooltip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Paper>

                <NotificationListView/>
                <WidgetUpdateDialog/>

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.navigation, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction | componentsActions.ComponentsAction>) => {
    return {
        setCurrentView: (value: string) => dispatch(actions.navigation.setCurrentView(value)),
        toastOpen: (toastType: ToastType, message: string) => dispatch(componentsActions.toastOpen(toastType, message)),
        increaseMark: () => dispatch(actions.uiEditor.increaseMark()),
        notificationPopoverOpen: (anchorEl: HTMLButtonElement) => dispatch(actions.navigation.notificationPopoverOpen(anchorEl)),
        addNotification: (notification: Notification) => dispatch(actions.navigation.addNotification(notification)),
        settingsDialogOpen: () => dispatch(actions.settings.settingsDialogOpen()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HeaderView));
