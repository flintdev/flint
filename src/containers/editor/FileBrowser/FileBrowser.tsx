// src/containers/editor/FileBrowser/FileBrowser.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {FilesState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/files/actions";
import {SourceFileManager} from "../../../controllers/files/sourceFileManager";

const styles = createStyles({
    root: {

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
        return (
            <div className={classes.root}>

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
