// containers/starter/ActionView/ActionView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';
import logoImg from 'resources/img/logo-md.png';
import { Button } from 'antd';
import {StarterConfig} from "../../../constants/starter";
import { Typography } from 'antd';

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%',
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

}

class ActionView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    handleCreateButtonClick = () => {

    };

    handleOpenButtonClick = () => {

    };

    handleCheckoutButtonClick = () =>{

    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.logoContainer}>
                    <img src={logoImg} className={classes.logoImg} alt={""}/><br/>
                    <Typography.Text className={classes.titleText}>{StarterConfig.ActionView.title}</Typography.Text><br/>
                    <Typography.Text className={classes.descriptionText}>{StarterConfig.ActionView.description}</Typography.Text>
                </div>
                <div className={classes.actionsContainer}>
                    <Button icon={"plus"} size={"large"} className={classes.actionButton}>{StarterConfig.ActionView.action.create}</Button><br/>
                    <Button icon={"folder-open"} size={"large"} className={classes.actionButton}>{StarterConfig.ActionView.action.open}</Button><br/>
                    <Button icon={"download"} size={"large"} className={classes.actionButton}>{StarterConfig.ActionView.action.checkout}</Button><br/>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ActionView);