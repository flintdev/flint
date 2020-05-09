// src/components/ConfirmationDialog/ConfirmationDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ComponentsState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/components/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Alert, AlertTitle} from "@material-ui/lab";
import Button from "@material-ui/core/Button";

const styles = createStyles({
    root: {
        
    },
});

export interface Props extends WithStyles<typeof styles>, ComponentsState {
    closeConfirmationDialog: () => void,
}

class ConfirmationDialog extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    handleSubmitClick = () => {
        const {onSubmit} = this.props.confirmationDialog;
        if (!!onSubmit) onSubmit();
        this.props.closeConfirmationDialog();
    };

    render() {
        const {classes, confirmationDialog} = this.props;
        const {open, title, type, submitLabel, description} = confirmationDialog;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.closeConfirmationDialog}
                    fullWidth={true}
                    disableEnforceFocus={true}
                >
                    <DialogContent>
                        <Alert severity={type as any}>
                            <AlertTitle>{title}</AlertTitle>
                            {description}
                        </Alert>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.closeConfirmationDialog}>Close</Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={this.handleSubmitClick}
                        >
                            {!!submitLabel ? submitLabel : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.components;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.ComponentsAction>) => {
    return {
        closeConfirmationDialog: () => dispatch(actions.closeConfirmationDialog()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ConfirmationDialog));
