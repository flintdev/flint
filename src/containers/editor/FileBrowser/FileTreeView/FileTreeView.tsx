// src/containers/editor/FileBrowser/FileTreeView/FileTreeView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {FilesState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/files/actions";
import {ProjectManager} from "../../../../controllers/project/projectManager";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {FileTreeNode} from "../../../../interface";

const styles = createStyles({
    root: {},
});

export interface Props extends WithStyles<typeof styles>, FilesState {

}

class FileTreeView extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    recurToRenderTreeNode = (node: FileTreeNode) => {
        return (
            <React.Fragment key={node.path}>
                {(!node.children || node.children.length === 0) &&
                <TreeItem nodeId={node.path} label={node.name}/>
                }
                {!!node.children && node.children.length > 0 &&
                <TreeItem
                    nodeId={node.path}
                    label={node.name}
                >
                    {node.children.map(node => this.recurToRenderTreeNode(node))}
                </TreeItem>
                }
            </React.Fragment>
        )
    };

    getDefaultExpandedNodes = () => {
        const {projectDir} = this.props;
        return [
            projectDir,
            `${projectDir}/src`,
            `${projectDir}/src/models`,
        ]
    };

    render() {
        const {classes, treeData, projectDir} = this.props;
        const projectName = new ProjectManager(projectDir).getProjectName();
        if (!treeData) return (<div/>);
        return (
            <div className={classes.root}>
                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpandIcon={<ChevronRightIcon/>}
                    defaultExpanded={this.getDefaultExpandedNodes()}
                >
                    <TreeItem
                        nodeId={projectDir}
                        label={projectName}
                    >
                        {treeData.map(node => this.recurToRenderTreeNode(node))}
                    </TreeItem>
                </TreeView>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.files;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.FilesAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileTreeView));
