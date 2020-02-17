// containers/starterWindow/ActionView/ActionView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import logoImg from 'resources/img/logo-md.png';
import {StarterConfig} from "../../../constants/starter";
import { connect } from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "../../../redux/state";
import * as actions from "../../../redux/modules/starter/actions";
import {MainProcessCommunicator} from "../../../controllers/mainProcessCommunicator";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = createStyles({
    root: {
        width: '100%',
    },
    logoImg: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    logoContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 30,
    },
    actionsContainer: {
        textAlign: 'center'
    },
    actionButton: {
        marginTop: 10,
        marginBottom: 10,
        width: 300,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    descriptionText: {
        color: 'grey',
        fontSize: 16
    }
});

export interface Props extends WithStyles<typeof styles>{
    createProjectDialogOpen?: () => void,
}

class ActionView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    handleCreateButtonClick = () => {
        this.props.createProjectDialogOpen();
    };

    handleOpenButtonClick = () => {
        const communicator = new MainProcessCommunicator();
        communicator.selectDirectory()
            .then((filePath: string) => {
                console.log(filePath);
                communicator.switchFromStarterToEditorWindow(filePath)
                    .then(() => {

                    });
            })
            .catch(err => {

            });
    };

    handleCheckoutButtonClick = () =>{

    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.logoContainer}>
                    <img src={logoImg} className={classes.logoImg} alt={""}/><br/>
                    <Typography className={classes.titleText}>{StarterConfig.ActionView.title}</Typography><br/>
                    <Typography className={classes.descriptionText}>{StarterConfig.ActionView.description}</Typography>
                </div>
                <div className={classes.actionsContainer}>
                    <Button
                        variant={"outlined"}
                        className={classes.actionButton}
                        onClick={this.handleCreateButtonClick}
                    >
                        {StarterConfig.ActionView.action.create}
                    </Button><br/>
                    <Button
                        variant={"outlined"}
                        className={classes.actionButton}
                        onClick={this.handleOpenButtonClick}
                    >
                        {StarterConfig.ActionView.action.open}
                    </Button><br/>
                    <Button
                        variant={"outlined"}
                        className={classes.actionButton}
                    >
                        {StarterConfig.ActionView.action.checkout}
                    </Button><br/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {
        createProjectDialogOpen: () => dispatch(actions.createProjectDialogOpen()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ActionView));

