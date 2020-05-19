// src/containers/editorWindow/MVCEditor/ModelEditorView/BlockEditDialog/BlockEditDialog.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ModelEditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';

const styles = createStyles({
    root: {},
    paper: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    content: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 10,
    },
    textField: {
        width: '100%'
    },
    tableContainer: {
        width: 'auto',
        padding: 10,
    },
    actionsContainer: {
        textAlign: 'right',
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    }
});

export interface Props extends WithStyles<typeof styles>, ModelEditorState {
    operations: any;
    blockEditDialogClose: () => void,
}

interface State {
    blockNameInput: string,
    items: any[],
    editingIndex: number,
}

class BlockEditDialog extends React.Component<Props, object> {
    state: State = {
        blockNameInput: '',
        items: [],
        editingIndex: -1,
    };

    componentDidMount(): void {

    }

    onEnter = () => {
        const {blockData} = this.props.blockEditDialog;
        const name = !!blockData && !!blockData.name ? blockData.name : "";
        const items = !!blockData && !!blockData.items ? blockData.items: [];
        this.setState({
            blockNameInput: name,
            items
        });
    };

    handleBlockNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            blockNameInput: event.target.value,
        });
    };

    handleAddFieldClick = () => {
        let {items} = this.state;
        items.push({
            id: this.props.operations.getUUID(),
            name: '',
            dataType: 'string',
            required: true,
            indexed: false,
        });
        this.setState({items: [...items], editingIndex: items.length - 1});
    };

    handleDeleteItemClick = (index: number) => () => {
        let items = this.state.items;
        items.splice(index, 1);
        this.setState({items: [...items]});
    };

    handleEditItemClick = (index: number) => () => {

    };

    handleSubmitClick = () => {
        let {blockData} = this.props.blockEditDialog;
        const {blockNameInput, items} = this.state;
        items.push({id: this.props.operations.getUUID(), name: "test1", dataType: 'string', required: true});
        blockData = {...blockData, name: blockNameInput, items};
        console.log('block data', blockData);
        this.props.operations.updateBlockData(blockData);
        this.props.blockEditDialogClose();
    };

    render() {
        const {classes, blockEditDialog} = this.props;
        const {blockNameInput, items, editingIndex} = this.state;
        const {open, blockData} = blockEditDialog;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.blockEditDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                    transitionDuration={0}
                    fullWidth={true}
                >
                    <Paper className={classes.paper} square={true}>
                        <TextField
                            className={classes.textField}
                            variant={"filled"}
                            size={"small"}
                            label={"Block Name"}
                            value={blockNameInput}
                            onChange={this.handleBlockNameChange}
                        />
                    </Paper>
                    <div className={classes.content}>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table padding={"none"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Field Name</TableCell>
                                        <TableCell>Data Type</TableCell>
                                        <TableCell align={"center"}>Required?</TableCell>
                                        <TableCell align={"center"}>Indexed?</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size={"small"}
                                                        label={item.dataType}
                                                    />
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    {!!item.required ? 'Y' : 'N'}
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    {!!item.indexed ? 'Y' : 'N'}
                                                </TableCell>
                                                <TableCell align={"right"}>
                                                    <IconButton
                                                        size={"small"}
                                                        color={"primary"}
                                                        onClick={this.handleEditItemClick(i)}
                                                    >
                                                        <EditIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        size={"small"}
                                                        onClick={this.handleDeleteItemClick(i)}
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
                                        <TableCell colSpan={4} align={"center"}>
                                            <Button
                                                color={"primary"}
                                                size={"small"}
                                                onClick={this.handleAddFieldClick}
                                            >
                                                <AddIcon/>&nbsp;Add Field
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={classes.actionsContainer}>
                        <Button
                            onClick={this.props.blockEditDialogClose}
                        >
                            Close
                        </Button>&nbsp;&nbsp;
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={this.handleSubmitClick}
                        >
                            Update
                        </Button>
                    </div>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.modelEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        blockEditDialogClose: () => dispatch(actions.modelEditor.blockEditDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BlockEditDialog));