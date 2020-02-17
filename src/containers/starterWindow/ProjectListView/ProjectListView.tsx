// src/containers/starterWindow/ProjectListView/ProjectListView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>{

}

class ProjectListView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectListView));
