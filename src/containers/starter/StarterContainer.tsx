// containers/starter/StarterContainer.tsx

import * as React from 'react';
import { withStyles } from '@material-ui/styles';

const styles = {
    root: {
        width: '100%',
        height: '100%'
    }
};

interface Props {
    classes: {
        root: string
    }
}

function StarterContainer(props: Props) {
    const {classes} = props;
    return (
        <div className={classes.root}>

        </div>
    )
}

export default withStyles(styles)(StarterContainer);