// containers/starter/StarterContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import ActionView from "./ActionView";

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%'
    }
});

export interface Props extends WithStyles<typeof styles>{

}

function StarterContainer(props: Props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <ActionView/>
        </div>
    )
}

export default withStyles(styles)(StarterContainer);