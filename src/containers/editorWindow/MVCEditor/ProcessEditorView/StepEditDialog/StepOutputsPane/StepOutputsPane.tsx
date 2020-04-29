// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepOutputsPane/StepOutputsPane.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {themeColor} from "../../../../../../constants";
import {Output, OutputCondition} from "src/controllers/process/processDataHandler";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {AlwaysOutputs} from "../../../../../../constants/editor";

const styles = createStyles({
    root: {},
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
    form: {},
    grey: {
        color: themeColor.grey
    },
    chipAlways: {
        backgroundColor: green[500],
        color: 'white',
    },
    selectionContainer: {
        textAlign: 'center'
    }
});

export interface Props extends WithStyles<typeof styles> {
    outputs: Output[],
    onUpdated: (outputs: Output[]) => void,
    openDialogForm: (initValues: any, data: DialogFormData, onSubmit: DialogFormSubmitFunc) => void,
}

interface State {
    selection: string,
    tempOutputs?: Output[]
}

class StepOutputsPane extends React.Component<Props, object> {
    state: State = {
        selection: 'always',
    };

    componentDidMount(): void {
        const {outputs} = this.props;
        if (outputs.length === 1 && outputs[0]?.condition?.operator === 'always') {
            this.setState({
                selection: 'always',
            });
            this.props.onUpdated([...AlwaysOutputs]);
        } else {
            this.setState({
                selection: 'conditional'
            });
        }
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

    handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selection = event.target.value;
        this.setState({selection});
        const {outputs} = this.props;
        if (selection === 'always') {
            if (outputs.length > 0) {
                this.setState({tempOutputs: outputs});
            }
            this.props.onUpdated([...AlwaysOutputs]);
        } else {
            const {tempOutputs} = this.state;
            if (!!tempOutputs && tempOutputs.length > 0) {
                this.setState({tempOutputs: undefined});
                this.props.onUpdated([...tempOutputs]);
            } else {
                this.props.onUpdated([]);
            }
        }
    }

    render() {
        const {classes, outputs} = this.props;
        const {selection} = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.selectionContainer}>
                    <RadioGroup
                        row
                        name="selection"
                        value={selection}
                        onChange={this.handleRadioChange}
                    >
                        <FormControlLabel value="always" control={<Radio color={"primary"}/>} label="Always"/>
                        <FormControlLabel value="conditional" control={<Radio color={"secondary"}/>} label="Conditional"/>
                    </RadioGroup>
                </div>
                {selection === 'conditional' &&
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
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} align={"center"}>
                                    <Button
                                        variant={"text"}
                                        color={"primary"}
                                        onClick={this.handleAddClick}
                                        size={"small"}
                                    ><AddIcon/>&nbsp;Add Output</Button>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                }
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
