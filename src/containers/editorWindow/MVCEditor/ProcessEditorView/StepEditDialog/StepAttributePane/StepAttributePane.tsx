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
import Grid from '@material-ui/core/Grid';
import {TextField} from "@material-ui/core";

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
    },
    buttonContainer: {
        textAlign: 'right',
    },

});

export interface Props extends WithStyles<typeof styles>, ProcessEditorState {
    attributes: StepAttributes,
    onUpdated: (attributes: StepAttributes) => void,
}

class StepAttributePane extends React.Component<Props, object> {
    state = {
        editing: false,
        editingAttributes: this.props.attributes,
    };

    componentDidMount(): void {
        this.setState({editing: false});
    }

    handleEditButtonClick = () => {
        this.setState({
            editing: true,
            editingAttributes: this.props.attributes,
        });
    };

    handleCancelButtonClick = () => {
        this.setState({
            editing: false
        });
    };

    handleUpdateButtonClick = () => {
        const {editingAttributes} = this.state;
        this.setState({
            editing: false,
            attributes: editingAttributes,
        });
        this.props.onUpdated(editingAttributes);
    };

    handleStepNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let {editingAttributes} = this.state;
        editingAttributes.name = event.target.value;
        this.setState({editingAttributes});
    };

    render() {
        const {classes, attributes} = this.props;
        const {editing, editingAttributes} = this.state;
        if (!attributes) return <div/>;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper} square={true}>
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
                    {editing &&
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    value={editingAttributes.name}
                                    label={"Step Name"}
                                    onChange={this.handleStepNameChange}
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <div className={classes.buttonContainer}>
                                    <Button variant={"contained"} onClick={this.handleUpdateButtonClick}>Update</Button>
                                    <Button onClick={this.handleCancelButtonClick}>Cancel</Button>
                                </div>
                            </Grid>
                        </Grid>

                    </div>
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
