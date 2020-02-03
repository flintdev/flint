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
import {FileTreeNode} from "../../../interface";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {ProjectManager} from "../../../controllers/project/projectManager";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Chip from '@material-ui/core/Chip';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import {themeColor} from "../../../constants";

const styles = createStyles({
    root: {
        display: 'flex',
        flexFlow: "column",
        height: "100%",
    },
    fileTreeContainer: {
        height: '100%',
        backgroundColor: '#f5f5f5',
        overflow: 'scroll'
    },
    headerPaper: {
        borderRadius: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 2,
    },
    splitView: {
        flexGrow: 1,
        display: 'flex',
        flexFlow: "column",
    },
    icon: {
        color: themeColor.grey,
    },
});

export interface Props extends WithStyles<typeof styles>, FilesState {
    setProjectDir: (projectDir: string) => void,
    setTreeData: (treeData: FileTreeNode[]) => void,
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
        this.props.setTreeData(treeData);
    };

    splitFilePath = (path: string) => {
        const {projectDir} = this.props;
        const projectName = new ProjectManager(projectDir).getProjectName();
        const tempList = path.replace(projectDir, projectName).split('/');
        return tempList;
    };

    getFileIcon = (files: string[], nodeSelected: FileTreeNode, index: number) => {
        const {classes} = this.props;
        if (!nodeSelected) return <FolderIcon className={classes.icon}/>;
        else if (nodeSelected.type === 'dir') return <FolderIcon className={classes.icon}/>;
        else if (files.length === index + 1) return <DescriptionOutlinedIcon className={classes.icon}/>;
        else return <FolderIcon className={classes.icon}/>;
    };

    render() {
        const {classes, projectDir, nodeSelected} = this.props;
        if (!projectDir) return (<div/>);
        const files = !!nodeSelected ? this.splitFilePath(nodeSelected.path): this.splitFilePath(projectDir);
        return (
            <div className={classes.root}>
                <Paper className={classes.headerPaper}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize={"small"}/>}>
                        {files.map((file, i) => {
                            return (
                                <Chip
                                    key={i}
                                    size={"small"}
                                    label={file}
                                    icon={this.getFileIcon(files, nodeSelected, i)}
                                />
                            )
                        })}
                    </Breadcrumbs>
                </Paper>
                <div className={classes.splitView}>
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

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.files;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.FilesAction>) => {
    return {
        setProjectDir: (projectDir: string) => dispatch(actions.setProjectDir(projectDir)),
        setTreeData: (treeData: FileTreeNode[]) => dispatch(actions.setTreeData(treeData)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileBrowser));
