// src/components/Toast/Toast.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import * as actions from 'src/redux/modules/components/actions';
import {ComponentsState, StoreState} from "../../redux/state";

const styles = createStyles({
    root: {

    },
});


export interface Props extends WithStyles<typeof styles>, ComponentsState {
    toastClose: () => void,
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={3} {...props} />;
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
        this.props.toastClose();
    };

    render() {
        const {classes, toast} = this.props;
        const {open, type, message} = toast;
        return (
            <div className={classes.root}>
                <Snackbar
                    open={open}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={3000}
                    onClose={this.props.toastClose}
                >
                    <Alert onClose={this.handleClose} severity={type}>
                        {message}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.components;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.ComponentsAction>) => {
    return {
        toastClose: () => dispatch(actions.toastClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Toast));
