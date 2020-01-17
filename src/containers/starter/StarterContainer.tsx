// containers/starter/StarterContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import ActionView from "./ActionView";
import CreateProjectDialog from "./CreateProjectDialog";
import Grid from '@material-ui/core/Grid';

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    projectsContainer: {
        width: '100%',
        height: '100%',
    },
    grid: {
        height: '100%'
    },
    table: {
        width: '100%',
        height: '100vh',
        border: 0,
        cellSpacing: 0,
        cellPadding: 0,
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },
    tdLeft: {
        width: '50%',
        height: '100%',
        borderRight: '1px solid lightgrey'
    },
    tdRight: {
        width: '50%',
        height: '100%',
    },
    tr: {
        border: 0,
        borderCollapse: 'collapse',
    }
});

export interface Props extends WithStyles<typeof styles> {

}

function StarterContainer(props: Props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <table className={classes.table}>
                <tbody>
                <tr>
                    <td valign={"top"} className={classes.tdLeft}>
                        <ActionView/>
                    </td>
                    <td valign={"top"} className={classes.tdRight}>
                        <div className={classes.projectsContainer}>

                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <CreateProjectDialog/>
        </div>
    )
}

export default withStyles(styles)(StarterContainer);