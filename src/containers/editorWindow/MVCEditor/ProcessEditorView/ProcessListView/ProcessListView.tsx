//

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import DialogForm, {Params, Callback} from "src/components/DialogForm";
import {CreateProcessParamsDef} from "./definition";
import Fab from '@material-ui/core/Fab';

const styles = createStyles({
    root: {

    },
    paperContainer: {
        margin: 20,
        padding: 20,
    },
    headerTable: {
        width: '100%',
        marginBottom: 20
    },
    textRight: {
        textAlign: 'right',
    },
});

export interface Props extends WithStyles<typeof styles>{

}

class ProcessListView extends React.Component<Props, object> {
    state = {
        createDialogOpen: false
    };

    componentDidMount(): void {

    }

    handleCreateDialogOpen = () => {
        this.setState({createDialogOpen: true});
    };

    handleCreateDialogClose = () => {
        this.setState({createDialogOpen: false});
    };

    handleCreateProcessSubmit = async (params: Params, callback: Callback) => {
        const name = params.name as string;

        callback.close();
    };

    render() {
        const {classes} = this.props;
        const {createDialogOpen} = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paperContainer}>
                    <table className={classes.headerTable}>
                        <tbody>
                        <tr>
                            <td>
                                <Typography variant={"h6"}>Process List</Typography>
                            </td>
                            <td className={classes.textRight}>
                                <Fab
                                    onClick={this.handleCreateDialogOpen}
                                    color={"primary"}
                                    size={"small"}
                                >
                                    <AddIcon/>
                                </Fab>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div>

                    </div>
                </Paper>

                <DialogForm
                    open={createDialogOpen}
                    onClose={this.handleCreateDialogClose}
                    title={"New Process"}
                    submitButtonTitle={"Create Process"}
                    forms={CreateProcessParamsDef}
                    onSubmit={this.handleCreateProcessSubmit}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessListView));
