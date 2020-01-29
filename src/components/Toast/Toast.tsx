// src/components/Toast/Toast.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert  from '@material-ui/lab/Alert';

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>{
    open: boolean,
    onClose: () => void,
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
}

class Toast extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        this.props.onClose();
    };

    render() {
        const {classes, open, onClose, type, message} = this.props;
        return (
            <div className={classes.root}>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={onClose}>
                    <Alert onClose={this.handleClose} severity={type}>
                        {message}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default withStyles(styles)(Toast);
