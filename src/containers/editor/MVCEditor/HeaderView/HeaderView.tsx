//

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {ProjectManager} from "../../../../controllers/project/projectManager";
import Typography from '@material-ui/core/Typography';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {themeColor} from "../../../../constants";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
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

const styles = createStyles({
    root: {},
    paper: {
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 0,
        marginLeft: -1,
        marginRight: -1
    },
    table: {
        width: '100%',
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
        marginTop: 4,
    },
    viewSelect: {},
    toggleButtonActive: {
        color: themeColor.white,
        backgroundColor: themeColor.primary,
    }
});

const ViewIconMap = {
    [MVC.Model]: <AccountTreeOutlinedIcon/>,
    [MVC.View]: <WebIcon/>,
    [MVC.Controller]: <ControlCameraIcon/>,
};

export interface Props extends WithStyles<typeof styles>, EditorState {
    setCurrentView: (value: string) => void,
}

class HeaderView extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    handleViewChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        if (!!value) this.props.setCurrentView(value);
    };

    render() {
        const {classes, projectDir, mvcEditor} = this.props;
        const {currentView} = mvcEditor;
        const projectName = new ProjectManager(projectDir).getProjectName();
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft}>
                                <TextField
                                    className={classes.projectSelect}
                                    select
                                    value={projectName}
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FolderOpenIcon fontSize={"small"}/>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value={projectName}>{projectName}</MenuItem>
                                </TextField>

                                <ToggleButtonGroup
                                    className={classes.viewSelect}
                                    value={currentView}
                                    exclusive
                                    size={"small"}
                                    onChange={this.handleViewChange}
                                >
                                    {MVCViews.map((view, i) => {
                                        return (
                                            <ToggleButton
                                                value={view.key}
                                                key={i}
                                            >
                                                {ViewIconMap[view.key]}&nbsp;
                                                {view.name}
                                            </ToggleButton>
                                        )
                                    })}
                                </ToggleButtonGroup>

                            </td>
                            <td className={classes.tdRight}>

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
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        setCurrentView: (value: string) => dispatch(actions.setCurrentView(value)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HeaderView));
