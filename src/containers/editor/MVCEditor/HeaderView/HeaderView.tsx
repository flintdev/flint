//

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {ProjectManager} from "../../../../controllers/project/projectManager";
import Typography from '@material-ui/core/Typography';

const styles = createStyles({
    root: {

    },
    table: {
        width: '100%',
    },
    tdLeft: {
    },
    tdRight: {
        textAlign: 'right',
    }
});

export interface Props extends WithStyles<typeof styles>, EditorState {

}

class HeaderView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    render() {
        const {classes, projectDir} = this.props;
        console.log(projectDir);
        const projectName = new ProjectManager(projectDir).getProjectName();
        return (
            <div className={classes.root}>
                <table className={classes.table}>
                    <tbody>
                    <tr>
                        <td className={classes.tdLeft}>
                            <Typography variant={"subtitle1"}>{projectName}</Typography>
                            <Typography variant={"body1"}>{projectDir}</Typography>
                        </td>
                        <td className={classes.tdRight}>

                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HeaderView));
