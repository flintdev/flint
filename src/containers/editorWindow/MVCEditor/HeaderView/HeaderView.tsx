//

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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
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
import BugReportIcon from '@material-ui/icons/BugReport';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';
import HistoryIcon from '@material-ui/icons/History';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CodeIcon from '@material-ui/icons/Code';
import {ToastType} from "../../../../components/interface";
import * as componentsActions from "../../../../redux/modules/components/actions";
import {SourceFileGenerator as UISourceFileGenerator} from "../../../../controllers/ui/sourceFileGenerator";
import {MainProcessCommunicator} from "../../../../controllers/mainProcessCommunicator";
import {UIDataManager} from "../../../../controllers/ui/uiDataManager";

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
}

class HeaderView extends React.Component<Props, object> {
    state = {};
    uiSourceFileGenerator: UISourceFileGenerator;
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.uiSourceFileGenerator = new UISourceFileGenerator(projectDir);
    }

    handleViewButtonClick = (value: string) => (event: React.MouseEvent<HTMLElement>) => {
        if (!!value) this.props.setCurrentView(value);
    };

    handleGenerateCode = async () => {
        await this.uiSourceFileGenerator.generate();
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
                                <Fab size={"small"} className={classes.fabRun} onClick={this.handleRunClick}>
                                    <PlayArrowIcon/>
                                </Fab>
                                <IconButton size={"small"} className={classes.actionIconButtonGreen}>
                                    <BugReportIcon/>
                                </IconButton>

                                <IconButton size={"small"} className={classes.actionIconButtonGreen}>
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton size={"small"} className={classes.actionIconButtonBlue}>
                                    <CallReceivedIcon/>
                                </IconButton>
                                <IconButton size={"small"} className={classes.actionIconButtonGrey}>
                                    <HistoryIcon/>
                                </IconButton>
                                <IconButton size={"small"} className={classes.actionIconButtonGrey}>
                                    <SearchIcon/>
                                </IconButton>
                                <IconButton
                                    size={"small"}
                                    className={classes.actionIconButtonGrey}
                                    onClick={this.handleGenerateCode}
                                >
                                    <CodeIcon/>
                                </IconButton>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.navigation, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction|componentsActions.ComponentsAction>) => {
    return {
        setCurrentView: (value: string) => dispatch(actions.navigation.setCurrentView(value)),
        toastOpen: (toastType: ToastType, message: string) => dispatch(componentsActions.toastOpen(toastType, message)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HeaderView));
