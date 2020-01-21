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

const styles = createStyles({
    root: {},
    paper: {
        paddingLeft: 10,
        paddingRight: 10,
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
});

export interface Props extends WithStyles<typeof styles>, EditorState {

}

class HeaderView extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes, projectDir} = this.props;
        const projectName = new ProjectManager(projectDir).getProjectName();
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft}>
                                <TextField
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
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HeaderView));
