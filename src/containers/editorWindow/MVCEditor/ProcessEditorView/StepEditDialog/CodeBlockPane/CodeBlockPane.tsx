// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/CodeBlockPane/CodeBlockPane.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Paper from '@material-ui/core/Paper';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow";
import {TemplateMap} from "./templates/templateMap";
import {StepAttributes, StepType} from "../interface";

const styles = createStyles({
    root: {

    },
    paper: {
        padding: 10,
    },
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    attributes: StepAttributes,
    code: string,
    onUpdated: (code: string) => void,
}

class CodeBlockPane extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {
    }

    handleCodeChange = (value: string) => {
        this.props.onUpdated(value);
    };

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<object>, snapshot?: any): void {
        if (prevProps.attributes !== this.props.attributes) {
            this.setDefaultCode();
        }
    }

    setDefaultCode = () => {
        const {code, attributes, processSelected} = this.props;
        const {type, name} = attributes;
        if (!code || code === "") {
            let defaultCode;
            switch (type) {
                case StepType.CODE_BLOCK:
                    defaultCode = TemplateMap[type](name);
                    break;
                case StepType.TRIGGER:
                    defaultCode = TemplateMap[type](processSelected);
                    break;
                default:
                    defaultCode = "";
                    break;
            }
            this.handleCodeChange(defaultCode);
        }
    };

    render() {
        const {classes, code} = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <AceEditor
                        mode="python"
                        theme="tomorrow"
                        fontSize={14}
                        onChange={this.handleCodeChange}
                        value={code}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        style={{width: '100%'}}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 4,
                            useWorker: false
                        }}
                    />
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodeBlockPane));
