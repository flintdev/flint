// src/containers/starterWindow/ValidationDialog/ValidationDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {StoreState, ValidationDialogState} from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";

const styles = createStyles({
    root: {

    },
    center : {
        textAlign: "center"
    }
});

export interface Props extends WithStyles<typeof styles>, ValidationDialogState {
    validationDialogClose: () => void,
}

interface State {
    status: 'initialized' | 'validating' | 'pass' | 'failed' | 'need_install_plugins' | 'plugins_installed';
}

class ValidationDialog extends React.Component<Props, object> {
    state: State = {
        status: "initialized"
    };

    componentDidMount(): void {

    }

    onEnter = async () => {
        this.setState({status: 'validating'});
        const {projectDirSelected} = this.props;

    };

    render() {
        const {classes, open} = this.props;
        const {status} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.validationDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                >
                    <DialogContent>
                        {status === "validating" &&
                        <div className={classes.center}>
                            <CircularProgress color="primary"/>
                            <br/>
                            <Typography variant={"body2"}>Validating...</Typography>
                        </div>
                        }
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter.validationDialog;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {
        validationDialogClose: () => dispatch(actions.validationDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ValidationDialog));
