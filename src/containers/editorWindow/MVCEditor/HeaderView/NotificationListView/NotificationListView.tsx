// src/containers/editorWindow/MVCEditor/HeaderView/NotificationListView/NotificationListView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {NavigationState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {NotificationType, Notification} from "../../../../../interface";
import Avatar from "@material-ui/core/Avatar";
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import {green} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";

const styles = createStyles({
    root: {
        
    },
    paper: {
        padding: 0,
    },
    emptyText: {
        color: 'grey',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    }
});

export interface Props extends WithStyles<typeof styles>, NavigationState {
    notificationPopoverClose: () => void,
    widgetUpdateDialogOpen: () => void,
}

class NotificationListView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    getNotificationIcon = (type: NotificationType) => {
        if (type === "widget-update") {
            return (
                <Avatar style={{color: 'white', 'backgroundColor': green[500]}}>
                    <NewReleasesIcon/>
                </Avatar>
            );
        }
        else return <NotificationsNoneIcon/>
    };

    handleNotificationItemClick = (notification: Notification) => () => {
        if (notification.type === "widget-update") {
            this.props.widgetUpdateDialogOpen();
        }
    };

    render() {
        const {classes, notificationPopoverAnchorEl, notifications} = this.props;
        return (
            <div className={classes.root}>
                <Popover
                    open={Boolean(notificationPopoverAnchorEl)}
                    anchorEl={notificationPopoverAnchorEl}
                    onClose={this.props.notificationPopoverClose}
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
                        {(!notifications || notifications.length === 0) &&
                        <Typography variant={"subtitle1"} className={classes.emptyText}>No new notifications</Typography>
                        }
                        <List>
                            {notifications.map((notification, i) => {
                                return (
                                    <ListItem button key={i} onClick={this.handleNotificationItemClick(notification)}>
                                        <ListItemIcon>
                                            {this.getNotificationIcon(notification.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={notification.title}
                                            secondary={notification.subtitle}
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
    return state.editor.navigation;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        notificationPopoverClose: () => dispatch(actions.navigation.notificationPopoverClose()),
        widgetUpdateDialogOpen: () => dispatch(actions.navigation.widgetUpdateDialogOpen()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NotificationListView));
