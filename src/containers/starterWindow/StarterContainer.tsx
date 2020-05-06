// containers/starterWindow/StarterContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles, ThemeProvider} from '@material-ui/core/styles';
import ActionView from "./ActionView";
import CreateProjectDialog from "./CreateProjectDialog";
import {theme} from "../../constants";
import ValidationDialog from "./ValidationDialog/ValidationDialog";

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
        <ThemeProvider theme={theme}>
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
                <ValidationDialog/>
            </div>
        </ThemeProvider>
    )
}

export default withStyles(styles)(StarterContainer);