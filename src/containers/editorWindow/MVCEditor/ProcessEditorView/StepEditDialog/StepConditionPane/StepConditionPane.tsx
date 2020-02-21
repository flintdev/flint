// src/containers/editorWindow/MVCEditor/ProcessEditorView/StepEditDialog/StepConditionPane/StepConditionPane.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Output} from "src/controllers/process/processDataHandler";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { themeColor } from 'src/constants';

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
    form: {
    },
    grey: {
        color: themeColor.grey
    }
});

export interface Props extends WithStyles<typeof styles> {
    outputs: Output[],
    onUpdated: (outputs: Output[]) => void,
}

class StepConditionPane extends React.Component<Props, object> {
    state = {
        editingIndex: -1,
        name: '',
        key: '',
        operator: '',
        value: '',
    };

    componentDidMount(): void {

    }

    handleValueChange = (param: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({[param]: event.target.value});
    };

    handleEditButtonClick = (output: Output, index: number) => () => {
        this.setState({
            editingIndex: index,
            name: output.name,
            key: output.condition.key,
            operator: output.condition.operator,
            value: output.condition.value,
        });
    };

    handleUpdateButtonClick = (index: number) => () => {
        let {outputs} = this.props;
        const {name, key, operator, value} = this.state;
        outputs[index] = {
            name,
            condition: {key, operator, value}
        };
        this.props.onUpdated(outputs);
        this.setState({
            editingIndex: -1,
        });
    };

    handleDeleteButtonClick = (index: number) => () => {
        let {outputs} = this.props;
        outputs.splice(index, 1);
        this.props.onUpdated(outputs);
        this.forceUpdate();
    };

    handleCancelButtonClick = () => {
        this.setState({
            editingIndex: -1,
        })
    };

    renderTableRow = (output: Output, index: number) => {
        return (
            <TableRow key={index}>
                <TableCell>{output.name}</TableCell>
                <TableCell>{output.condition.key}</TableCell>
                <TableCell>{output.condition.operator}</TableCell>
                <TableCell>{output.condition.value}</TableCell>
                <TableCell align={"right"}>
                    <IconButton
                        size={"small"}
                        color={"primary"}
                        onClick={this.handleEditButtonClick(output, index)}>
                        <EditIcon fontSize={"small"}/>
                    </IconButton>
                    <IconButton
                        size={"small"}
                        color={"secondary"}
                        onClick={this.handleDeleteButtonClick(index)}
                    >
                        <DeleteOutlineIcon fontSize={"small"}/>
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    };

    renderEditingTableRow = (output: Output, index: number) => {
        const {classes} = this.props;
        const {name, key, operator, value} = this.state;
        return (
            <TableRow key={index}>
                <TableCell>
                    <TextField
                        className={classes.form}
                        variant={"outlined"}
                        size={"small"}
                        value={name}
                        onChange={this.handleValueChange('name')}
                        fullWidth={true}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        className={classes.form}
                        variant={"outlined"}
                        size={"small"}
                        value={key}
                        onChange={this.handleValueChange('key')}
                        fullWidth={true}
                    />
                </TableCell>
                <TableCell>
                    <FormControl
                        fullWidth={true}
                        className={classes.form}
                        variant={"outlined"}
                        size={"small"}
                    >
                        <Select
                            value={operator}
                            onChange={this.handleValueChange('operator')}
                        >
                            <MenuItem value={"always"}>{"always"}</MenuItem>
                            <MenuItem value={"equals"}>{"equals"}</MenuItem>
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <TextField
                        className={classes.form}
                        variant={"outlined"}
                        size={"small"}
                        value={value}
                        onChange={this.handleValueChange('value')}
                        fullWidth={true}
                    />
                </TableCell>
                <TableCell align={"right"}>
                    <Button
                        size={"small"}
                        color={"primary"}
                        variant={"contained"}
                        onClick={this.handleUpdateButtonClick(index)}
                    >
                        <CheckCircleIcon fontSize={"small"}/>&nbsp;Update
                    </Button>&nbsp;
                    <Button
                        size={"small"}
                        variant={"outlined"}
                        onClick={this.handleCancelButtonClick}
                    >
                        Cancel
                    </Button>
                </TableCell>
            </TableRow>
        )
    };

    render() {
        const {classes, outputs} = this.props;
        const {editingIndex} = this.state;
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <table className={classes.headerTable}>
                        <tbody>
                        <tr>
                            <td>
                                <Typography variant={"subtitle1"}>Conditions</Typography>
                            </td>
                            <td align={"right"}>
                                <Button variant={"outlined"}>Add</Button>
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
                                        <TableCell>Key</TableCell>
                                        <TableCell>Operator</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell align={"right"}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outputs.map((output, i) => {
                                        return editingIndex === i ?
                                            this.renderEditingTableRow(output, i) :
                                            this.renderTableRow(output, i);
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

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StepConditionPane));
