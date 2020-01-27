// src/components/DialogForm/DialogForm.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>{
    open: boolean,
    onClose: () => void,
    title: string,

}

class DialogForm extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    onEnter = () => {

    };

    render() {
        const {classes, open, onClose} = this.props;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={onClose}
                    onEnter={this.onEnter}
                >

                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(DialogForm);
