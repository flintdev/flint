// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepOutputsPane/StepOutputsPane.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {themeColor} from "../../../../../../constants";
import {Output, OutputCondition} from "src/controllers/process/processDataHandler";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Chip from "@material-ui/core/Chip";
import {green} from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {DialogFormData, DialogFormSubmitFunc} from "../../../../../../components/interface";
import * as componentsActions from "../../../../../../redux/modules/components/actions";
import {OutputParamsDef} from "./formDefinition";

const styles = createStyles({
    root: {

    },
    paper: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    headerTable: {
        width: '100%',
        marginBottom: 10,
    },
    form: {
    },
    grey: {
        color: themeColor.grey
    },
    chipAlways: {
        backgroundColor: green[500],
        color: 'white',
    }
});

export interface Props extends WithStyles<typeof styles>{
    outputs: Output[],
    onUpdated: (outputs: Output[]) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
}

class StepOutputsPane extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    getConditionCell = (condition?: OutputCondition) => {
        const {classes} = this.props;
        const chipAlways = (
            <Chip label={"Always"} className={classes.chipAlways}/>
        );
        if (!condition) return chipAlways;
        const {key, operator, value} = condition;
        if (operator === 'always') return chipAlways;
        return (
            <Chip label={`${key} ${operator} ${value}`} variant={"outlined"}/>
        )
    };

    handleEditButtonClick = (output: Output, index: number) => () => {
        this.props.openDialogForm(
            {
                name: output.name,
                key: output.condition.key,
                operator: output.condition.operator,
                value: output.condition.value,
            },
            {
                forms: OutputParamsDef,
                title: "Edit Output",
                submitLabel: "Update"
            },
            (values) => {
                const {name, key, value, operator} = values;
                const output: Output = {name, condition: {key, value, operator}};
                let {outputs} = this.props;
                outputs[index] = output;
                this.props.onUpdated([...outputs]);
            }
        );
    };

    handleDeleteButtonClick = (index: number) => () => {
        let {outputs} = this.props;
        outputs.splice(index, 1);
        this.props.onUpdated([...outputs]);
    };

    handleAddClick = () => {
        this.props.openDialogForm(
            {},
            {
                forms: OutputParamsDef,
                title: "Add Output",
                submitLabel: "Add"
            },
            (values) => {
                const {name, key, value, operator} = values;
                const output: Output = {name, condition: {key, value, operator}};
                const {outputs} = this.props;
                this.props.onUpdated([...outputs, output]);
            }
        );
    };

    render() {
        const {classes, outputs} = this.props;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <table className={classes.headerTable}>
                        <tbody>
                        <tr>
                            <td>
                                <Typography variant={"subtitle1"}>Outputs</Typography>
                            </td>
                            <td align={"right"}>
                                <Button variant={"outlined"} onClick={this.handleAddClick}><AddIcon/>&nbsp;Add</Button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Condition</TableCell>
                                        <TableCell align={"right"}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outputs.map((output, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>{output.name}</TableCell>
                                                <TableCell>{this.getConditionCell(output.condition)}</TableCell>
                                                <TableCell align={"right"}>
                                                    <IconButton
                                                        size={"small"}
                                                        color={"primary"}
                                                        onClick={this.handleEditButtonClick(output, i)}
                                                    >
                                                        <EditIcon fontSize={"small"}/>
                                                    </IconButton>
                                                    <IconButton
                                                        size={"small"}
                                                        color={"secondary"}
                                                        onClick={this.handleDeleteButtonClick(i)}
                                                    >
                                                        <DeleteOutlineIcon fontSize={"small"}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.processEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction | componentsActions.ComponentsAction>) => {
    return {
        openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => dispatch(componentsActions.openDialogForm(initValues, data, onSubmit)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepOutputsPane));
