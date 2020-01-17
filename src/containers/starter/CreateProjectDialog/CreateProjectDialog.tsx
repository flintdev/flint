// src/containers/starter/CreateProjectDialog/CreateProjectDialog.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";
import * as configActions from 'src/redux/modules/config/actions';
import {FSHelper} from "../../../controllers/utils/fsHelper";
import {MainProcessCommunicator} from "../../../controllers/mainProcessCommunicator";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import ParamForm from "./ParamForm";

const styles = createStyles({
    root: {},
});

export interface Props extends WithStyles<typeof styles> {
    open?: boolean,
    createProjectDialogClose?: () => void,
    setProjectDir?: (value: string) => void,
}

class CreateProjectDialog extends React.Component<Props, object> {
    state = {
        submitLoading: false,
        params: {
            location: '',
        },
    };

    componentDidMount(): void {

    }

    onEnter = () => {

    };

    handleFormChange = (params: object) => {
        this.setState({params});
    };

    handleSubmitButtonClick = () => {
        this.setState({submitLoading: true});
        const {location} = this.state.params;
        new FSHelper().createDirByPath(location)
            .then(() => {
                this.setState({submitLoading: false});
                this.props.createProjectDialogClose();
                this.props.setProjectDir(location);
                new MainProcessCommunicator().switchFromStarterToEditorWindow()
                    .then(() => {

                    });
            })
            .catch(err => {
                console.error('create dir by path', err)
            });
    };

    render() {
        const {classes, open} = this.props;
        const {submitLoading} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.createProjectDialogClose}
                    onEnter={this.onEnter}
                    fullWidth
                >
                    <DialogTitle>New Project</DialogTitle>
                    <DialogContent>
                        <ParamForm onChange={this.handleFormChange}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.createProjectDialogClose}>Cancel</Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={this.handleSubmitButtonClick}
                            disabled={submitLoading}
                        >
                            {submitLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter.createProjectDialog;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction | configActions.ConfigAction>) => {
    return {
        createProjectDialogClose: () => dispatch(actions.createProjectDialogClose()),
        setProjectDir: (value: string) => dispatch(configActions.setProjectDir(value)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProjectDialog));
