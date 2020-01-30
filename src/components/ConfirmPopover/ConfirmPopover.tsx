// src/components/ConfirmPopover/ConfirmPopover.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = createStyles({
    root: {},
    paper: {
        padding: 10,
        width: 300,
    },
});

export interface Props extends WithStyles<typeof styles> {
    anchorEl: undefined | HTMLButtonElement,
    onClose: () => void,
    color?: "primary" | "secondary",
    message?: string,
    confirmButtonTitle?: string,
    cancelButtonTitle?: string,
    onConfirm: () => void,
}

interface State {

}

class ConfirmPopover extends React.Component<Props, object> {
    state: State = {
    };

    componentDidMount(): void {

    }

    handleConfirmButtonClick = () => {
        this.props.onConfirm();
    };

    render() {
        const {classes, anchorEl, onClose, color, message, confirmButtonTitle, cancelButtonTitle} = this.props;
        return (
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Paper className={classes.paper}>
                    <Typography variant={"subtitle1"}>
                        {message}
                    </Typography>
                    <br/>
                    <Button
                        variant={"contained"}
                        color={!!color ? color : 'primary'}
                        onClick={this.handleConfirmButtonClick}
                    >
                        {!!confirmButtonTitle ? confirmButtonTitle : 'Confirm'}
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                        onClick={onClose}
                    >
                        {!!cancelButtonTitle ? cancelButtonTitle : 'Cancel'}
                    </Button>
                </Paper>
            </Popover>
        )
    }
}

export default withStyles(styles)(ConfirmPopover);
