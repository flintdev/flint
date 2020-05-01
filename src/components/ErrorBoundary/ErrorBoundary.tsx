// src/components/ErrorBoundary/ErrorBoundary.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {Alert, AlertTitle} from "@material-ui/lab";
import Button from '@material-ui/core/Button';

const styles = createStyles({
    root: {
        marginTop: 20,
        marginRight: 100,
        marginLeft: 100,
    },
});

export interface Props extends WithStyles<typeof styles>{

}

class ErrorBoundary extends React.Component<Props, object> {
    state = {
        hasError: false,
        errorMessage: '',
    };

    componentDidMount(): void {

    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            errorMessage: error.message
        };
    }

    handleReloadClick = () => {
        location.reload();
    };

    render() {
        const {classes} = this.props;
        if (this.state.hasError) {
            return (
                <div className={classes.root}>
                    <Alert severity={"error"}>
                        <AlertTitle>{"Uncaught error occurs"}</AlertTitle>
                        {this.state.errorMessage}
                    </Alert>
                    <br/>
                    <Button variant={"contained"} onClick={this.handleReloadClick}>Reload App</Button>
                </div>
            )
        }
        return this.props.children;
    }
}

export default withStyles(styles)(ErrorBoundary);
