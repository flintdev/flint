// src/containers/editorWindow/MVCEditor/HeaderView/RevisionListView/RevisionListView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ConfigState, NavigationState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import * as componentsActions from "src/redux/modules/components/actions";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import HistoryIcon from '@material-ui/icons/History';
import {MainProcessCommunicator} from "../../../../../controllers/mainProcessCommunicator";
import {DatetimeHelper} from "../../../../../controllers/utils/datetimeHelper";
import {ConfirmationDialogSubmitFunc} from "../../../../../components/interface";

const styles = createStyles({
    root: {

    },
    paper: {
        padding: 0,
        overflow: 'auto',
        maxHeight: '50vh',
    },
    emptyText: {
        color: 'grey',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    list: {
        overflow: 'auto'
    },
});

export interface Props extends WithStyles<typeof styles>, NavigationState, ConfigState {
    revisionPopoverClose: () => void,
    openConfirmationDialog: (type: string, title: string, description?: string, submitLabel?: string, onSubmit?: ConfirmationDialogSubmitFunc) => void,

}

interface State {
    revisions: any[],
}

class RevisionListView extends React.Component<Props, object> {
    state: State = {
        revisions: [],
    };
    mainProcessCommunicator = new MainProcessCommunicator();
    datetimeHelper = new DatetimeHelper();
    componentDidMount(): void {

    }

    onEnter = async () => {
        const {projectDir} = this.props;
        const commits = await this.mainProcessCommunicator.gitLog(projectDir);
        const revisions = commits.map(commit => {
            return {
                id: commit.oid,
                time: this.datetimeHelper.getDatetimeString(commit.commit.message),
            }
        });
        this.setState({revisions});
    };

    handleRevisionClick = (revision: any) => () => {
        const {projectDir} = this.props;
        this.props.revisionPopoverClose();
        this.props.openConfirmationDialog(
            'warning',
            'Are you sure to rollback to the previous revision?',
            `Revision saved time: ${revision.time}. Please note: all revisions records after this revision will be cleaned up.`,
            'Rollback',
            () => {
                this.mainProcessCommunicator.gitReset(projectDir, revision.id)
                    .then(r => {
                        location.reload();
                    });
            }
        )
    };

    render() {
        const {classes, revisionPopoverAnchorEl} = this.props;
        const {revisions} = this.state;
        return (
            <div className={classes.root}>
                <Popover
                    open={Boolean(revisionPopoverAnchorEl)}
                    anchorEl={revisionPopoverAnchorEl}
                    onClose={this.props.revisionPopoverClose}
                    onEnter={this.onEnter}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Paper className={classes.paper}>
                        {(!revisions || revisions.length === 0) &&
                        <Typography variant={"subtitle1"} className={classes.emptyText}>No new notifications</Typography>
                        }
                        <List>
                            {revisions.map((revision, i) => {
                                return (
                                    <ListItem button key={i} onClick={this.handleRevisionClick(revision)}>
                                        <ListItemIcon>
                                            <HistoryIcon/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={revision.time}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Paper>
                </Popover>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.navigation, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction|componentsActions.ComponentsAction>) => {
    return {
        revisionPopoverClose: () => dispatch(actions.navigation.revisionPopoverClose()),
        openConfirmationDialog: (type: string, title: string, description?: string, submitLabel?: string, onSubmit?: ConfirmationDialogSubmitFunc) => dispatch(componentsActions.openConfirmationDialog(type, title, description, submitLabel, onSubmit)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RevisionListView));
