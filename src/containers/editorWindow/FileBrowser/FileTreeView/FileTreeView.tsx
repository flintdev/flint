// src/containers/editorWindow/FileBrowser/FileTreeView/FileTreeView.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles, makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {FilesState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/files/actions";
import {ProjectManager} from "../../../../controllers/project/projectManager";
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {FileTreeNode} from "../../../../interface";
import FolderIcon from '@material-ui/icons/Folder';
import {themeColor} from "../../../../constants";
import {SvgIconProps} from '@material-ui/core/SvgIcon';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import Typography from '@material-ui/core/Typography';
import {SourceFileManager} from "../../../../controllers/files/sourceFileManager";

const styles = createStyles({
    root: {},
    expandIcon: {
        color: themeColor.dimgrey
    },

});

const useTreeItemStyles = makeStyles(createStyles({
    labelIcon: {
        color: themeColor.grey
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
    },
    labelText: {
        marginLeft: 5,
    },
    emptySpan: {
        marginRight: 25,
    }
}));

export interface Props extends WithStyles<typeof styles>, FilesState {
    selectNode: (node: FileTreeNode) => void,
    setFileContent: (value: string|null) => void,

}

interface NodeLabelProps {
    labelIcon: React.ElementType<SvgIconProps>,
    labelText: string,
    type?: 'dir' | 'file'
}

function NodeLabel(props: NodeLabelProps) {
    const {labelIcon: LabelIcon, labelText, type} = props;
    const classes = useTreeItemStyles(props);
    return (
        <div className={classes.labelRoot}>
            {type === 'file' && <span className={classes.emptySpan}/>}
            <LabelIcon className={classes.labelIcon}/>
            <Typography
                variant={"body1"}
                className={classes.labelText}
                display={"inline"}
                noWrap={true}
            >
                {labelText}
            </Typography>
        </div>
    )
}

class FileTreeView extends React.Component<Props, object> {
    state = {};
    sourceFileManager: SourceFileManager;
    componentDidMount(): void {
        const {projectDir} = this.props;
        this.sourceFileManager = new SourceFileManager(projectDir);
    }

    handleNodeSelect = (node: FileTreeNode) => async (event: React.MouseEvent) => {
        event.stopPropagation();
        this.props.selectNode(node);
        if (node.type === "file") {
            const fileContent = await this.sourceFileManager.getFileContent(node.path);
            this.props.setFileContent(fileContent);
        }
    };

    recurToRenderTreeNode = (node: FileTreeNode) => {
        return (
            <React.Fragment key={node.path}>
                {(!node.children || node.children.length === 0) &&
                <TreeItem
                    nodeId={node.path}
                    label={
                        <NodeLabel
                            labelIcon={DescriptionOutlinedIcon}
                            labelText={node.name}
                            type={"file"}
                        />
                    }
                    onClick={this.handleNodeSelect(node)}
                />
                }
                {!!node.children && node.children.length > 0 &&
                <TreeItem
                    nodeId={node.path}
                    label={
                        <NodeLabel
                            labelIcon={FolderIcon}
                            labelText={node.name}
                        />
                    }
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
            `${projectDir}/src/controllers`,
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
                    defaultCollapseIcon={<ArrowDropDownIcon className={classes.expandIcon}/>}
                    defaultExpandIcon={<ArrowRightIcon className={classes.expandIcon}/>}
                    defaultExpanded={this.getDefaultExpandedNodes()}
                >
                    <TreeItem
                        nodeId={projectDir}
                        label={
                            <NodeLabel
                                labelIcon={FolderIcon}
                                labelText={projectName}
                            />
                        }
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
    return {
        selectNode: (node: FileTreeNode) => dispatch(actions.selectNode(node)),
        setFileContent: (value: string|null) => dispatch(actions.setFileContent(value)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileTreeView));
