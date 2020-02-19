// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepAttributePane/StepAttributePane.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ProcessEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {StepAttributes} from "../interface";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {themeColor} from "../../../../../../constants";

const styles = createStyles({
    root: {},
    paper: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    table: {
        width: '100%',
    },
    title: {},
    subtitle: {
        color: themeColor.grey
    }
});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    attributes: StepAttributes,
    onUpdated: (attributes: StepAttributes) => void,
}

class StepAttributePane extends React.Component<Props, object> {
    state = {
        editing: false,
        attributes: this.props.attributes,
        editingAttributes: this.props.attributes,
    };

    componentDidMount(): void {
        this.setState({editing: false});
    }

    handleEditButtonClick = () => {
        this.setState({
            editing: true,
            editingAttributes: this.state.attributes,
        });
    };

    render() {
        const {classes} = this.props;
        const {editing, attributes, editingAttributes} = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    {!editing &&
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td>
                                <Typography variant={"subtitle1"} className={classes.title}>{attributes.name}</Typography>
                                <Typography variant={"subtitle2"} className={classes.subtitle}>{attributes.type}</Typography>
                            </td>
                            <td align={"right"}>
                                <Button
                                    variant={"outlined"}
                                    size={"small"}
                                    onClick={this.handleEditButtonClick}
                                >
                                    Edit
                                </Button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    }
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepAttributePane));
