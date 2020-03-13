// src/containers/editorWindow/FileBrowser/CodeEditor/CodeEditor.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {FilesState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/files/actions";
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-tomorrow";

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%',
    },
});

export interface Props extends WithStyles<typeof styles>, FilesState{

}

class CodeEditor extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    getModeByFile = (path: string): string => {
        const tempList = path.split('.');
        const postfix: string = tempList[tempList.length - 1];
        switch (postfix) {
            case 'yaml':
                return 'yaml';
            case 'yml':
                return 'yaml';
            case 'json':
                return 'json';
            case 'go':
                return 'golang';
            default:
                return 'plain_text';
        }
    };

    render() {
        const {classes, nodeSelected, fileContent} = this.props;
        if (!fileContent) return <div/>;
        return (
            <div className={classes.root}>
                <AceEditor
                    mode={this.getModeByFile(nodeSelected.path)}
                    theme={"tomorrow"}
                    fontSize={14}
                    value={fileContent}
                    showGutter={true}
                    highlightActiveLine={true}
                    style={{width: '100%', height: '100%'}}
                    readOnly={true}
                    setOptions={{
                        showLineNumbers: true,
                        useWorker: false
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.files;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.FilesAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodeEditor));
