// src/containers/editorWindow/MVCEditor/UIEditorView/AddWidgetDialog/AddWidgetDialog.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {StoreState, UIEditorState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {ComponentData} from "@flintdev/ui-editor/dist/interface";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {WidgetManager} from "../../../../../controllers/ui/widgetManager";
import {PluginData} from "../../../../../interface";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {MainProcessCommunicator} from "../../../../../controllers/mainProcessCommunicator";

const styles = createStyles({
    root: {

    },
    tableHeader: {
        width: '100%'
    },
    form: {
        minWidth: 200
    }
});

export interface Props extends WithStyles<typeof styles>, UIEditorState {
    widgetOnSelect: (data: ComponentData) => void,
    addWidgetDialogClose: () => void,
    addLibraryDialogOpen: () => void,
}

interface State {
    installedPlugins: PluginData[],
    allPlugins: PluginData[],
    pluginIdSelected: string,
}

class AddWidgetDialog extends React.Component<Props, object> {
    state: State = {
        installedPlugins: [],
        allPlugins: [],
        pluginIdSelected: '',
    };
    widgetManager = new WidgetManager();
    componentDidMount(): void {

    }

    onEnter = async () => {
        const plugins: any = await new MainProcessCommunicator().getInstalledPlugins();
        this.setState({installedPlugins: plugins});
        let {pluginIdSelected} = this.state;
        if (pluginIdSelected === "") {
            pluginIdSelected = plugins[0].id;
            this.setState({pluginIdSelected});
        }
    };

    handleWidgetSelect = (name: string) => () => {
        const data = this.widgetManager.getWidgetData(name);
        this.props.widgetOnSelect(data);
        this.props.addWidgetDialogClose();
    };
    
    handlePluginSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            pluginIdSelected: event.target.value,
        });
    };

    handleAddLibraryClick = () => {
        this.props.addLibraryDialogOpen();
    };

    render() {
        const {classes, addWidgetDialog} = this.props;
        const {open} = addWidgetDialog;
        const {installedPlugins, allPlugins, pluginIdSelected} = this.state;
        const widgetNames = this.widgetManager.getWidgetNameList(pluginIdSelected);
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.addWidgetDialogClose}
                    onEnter={this.onEnter}
                    fullWidth
                    transitionDuration={0}
                    disableEnforceFocus={true}
                >
                    <DialogTitle>
                        <table className={classes.tableHeader}>
                            <tbody>
                            <tr>
                                <td>
                                    <TextField
                                        className={classes.form}
                                        value={pluginIdSelected}
                                        onChange={this.handlePluginSelect}
                                        label={"Component Library"}
                                        select
                                        variant={"outlined"}
                                        size={"small"}
                                    >
                                        {installedPlugins.map((plugin, i) => {
                                            return (
                                                <MenuItem key={i} value={plugin.id}>{plugin.name}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                </td>
                                <td align={"right"}>
                                    <Button color={"primary"} onClick={this.handleAddLibraryClick}>Add Library</Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </DialogTitle>
                    <DialogContent>
                        {!!pluginIdSelected && pluginIdSelected !== "" &&
                        <List>
                            {widgetNames.map((name, i) => {
                                return (
                                    <ListItem
                                        key={i}
                                        button
                                        onClick={this.handleWidgetSelect(name)}
                                    >
                                        <ListItemText primary={name.split('::')[1]}/>
                                    </ListItem>
                                )
                            })}
                        </List>
                        }
                    </DialogContent>
                    
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.uiEditor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        addWidgetDialogClose: () => dispatch(actions.uiEditor.addWidgetDialogClose()),
        addLibraryDialogOpen: () => dispatch(actions.uiEditor.addLibraryDialogOpen()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddWidgetDialog));
