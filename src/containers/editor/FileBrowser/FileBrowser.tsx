// src/containers/editor/FileBrowser/FileBrowser.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {FilesState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/files/actions";
import {SourceFileManager} from "../../../controllers/files/sourceFileManager";
import Splitter from 'm-react-splitters';
import 'm-react-splitters/lib/splitters.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FileTreeView from "./FileTreeView/FileTreeView";

const styles = createStyles({
    root: {
        display: 'flex',
        flexFlow: "column",
        height: "100%",
    },
    fileTreeContainer: {
        backgroundColor: '#f5f5f5'
    },
    headerPaper: {
        borderRadius: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 2,
    },
});

export interface Props extends WithStyles<typeof styles>, FilesState {
    setProjectDir: (projectDir: string) => void,

}

class FileBrowser extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {
        const projectDir = localStorage.projectDir;
        this.props.setProjectDir(projectDir);
        this.initActions(projectDir).then(() => {});
    }

    initActions = async (projectDir: string) => {
        const treeData = await new SourceFileManager(projectDir).getTreeData();
        console.log(treeData);
    };

    render() {
        const {classes, projectDir} = this.props;
        if (!projectDir) return (<div/>);
        return (
            <div className={classes.root}>
                <Paper className={classes.headerPaper}>
                    <Typography variant={"subtitle1"}>{projectDir}</Typography>
                </Paper>
                <Splitter
                    position="vertical"
                    primaryPaneMaxWidth="50%"
                    primaryPaneMinWidth="10%"
                    primaryPaneWidth="300px"
                    postPoned={false}
                >
                    <div className={classes.fileTreeContainer}>
                        <FileTreeView/>
                    </div>
                    <div>

                    </div>
                </Splitter>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.files;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.FilesAction>) => {
    return {
        setProjectDir: (projectDir: string) => dispatch(actions.setProjectDir(projectDir))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileBrowser));
