// containers/starter/ActionView/ActionView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/styles';

import logoImg from 'resources/img/logo-md.png';

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%',
    },
    logoImg: {
        width: 100,
        height: 100
    },
    logoContainer: {
        width: '100%',
        textAlign: 'center',
    }
});

export interface Props extends WithStyles<typeof styles>{

}

class ActionView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.logoContainer}>
                    <img src={logoImg} className={classes.logoImg} alt={""}/>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ActionView);