// src/containers/starterWindow/ProjectListView/ProjectListView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {StarterState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";
import {ProjectManager} from "../../../controllers/project/projectManager";
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = createStyles({
    root: {
        overflow: 'auto'
    },
    list: {
        overflow: 'auto'
    }
});

export interface Props extends WithStyles<typeof styles>, StarterState {
    setRecentProjects: (projects: any[]) => void;
}

class ProjectListView extends React.Component<Props, object> {

    componentDidMount(): void {
        const projects = ProjectManager.GetRecentProjects();
        this.props.setRecentProjects(projects);
    }

    handleListItemClick = (project: any) => () => {
        const projectDir = project.path;
    };

    handleDeleteProjectClick = (project: any) => () => {
        const projectDir = project.path;
    };

    render() {
        const {classes} = this.props;
        const {recentProjects} = this.props;
        return (
            <div className={classes.root}>
                <List
                    className={classes.list}
                    subheader={
                        <ListSubheader component="div">
                            Recent Projects
                        </ListSubheader>
                    }
                >
                    {recentProjects.map((project, i) => {
                        return (
                            <ListItem
                                key={i}
                                button
                                onClick={this.handleListItemClick(project)}
                            >
                                <ListItemText primary={project.name} secondary={project.path}/>
                                <IconButton
                                    size={"small"}
                                    onClick={this.handleDeleteProjectClick(project)}
                                >
                                    <CloseIcon fontSize={"small"} style={{color: 'grey'}}/>
                                </IconButton>
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {
        setRecentProjects: (projects: any[]) => dispatch(actions.setRecentProjects(projects)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProjectListView));
