// 

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import ProcessEditor from '@flintdev/process-editor';
import {stepOptions} from "./stepOptions";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
});

export interface Props extends WithStyles<typeof styles>{

}

class ProcessEditorView extends React.Component<Props, object> {
    state = {

    };
    operations: object = {};

    componentDidMount(): void {

    }

    editorOnSaved = (processData: any, editorData: any) => {
        console.log(processData);
        console.log(editorData);
    };

    editorStepDbClick = (stepData: any) => {
        console.log(stepData);
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <ProcessEditor
                    operations={this.operations}
                    stepOptions={stepOptions}
                    editorData={undefined}
                    onSaved={this.editorOnSaved}
                    stepDbClick={this.editorStepDbClick}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
    
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessEditorView));
