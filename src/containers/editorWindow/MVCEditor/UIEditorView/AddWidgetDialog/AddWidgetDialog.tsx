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
import DialogActions from "@material-ui/core/DialogActions";
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {WidgetManager} from "../../../../../controllers/ui/widgetManager";

const styles = createStyles({
    root: {

    },
});

export interface Props extends WithStyles<typeof styles>, UIEditorState {
    widgetOnSelect: (data: ComponentData) => void,
    addWidgetDialogClose: () => void,
}

class AddWidgetDialog extends React.Component<Props, object> {
    state = {

    };
    widgetManager = new WidgetManager();
    componentDidMount(): void {

    }

    onEnter = () => {

    };

    handleWidgetSelect = (name: string) => () => {
        const data = this.widgetManager.getWidgetData(name);
        this.props.widgetOnSelect(data);
        this.props.addWidgetDialogClose();
    };

    render() {
        const {classes, addWidgetDialog} = this.props;
        const {open} = addWidgetDialog;
        const widgetNames = this.widgetManager.getWidgetNameList();
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.addWidgetDialogClose}
                    onEnter={this.onEnter}
                    fullWidth
                    disableEnforceFocus={true}
                >
                    <List>
                        {widgetNames.map((name, i) => {
                            return (
                                <ListItem
                                    key={i}
                                    button
                                    onClick={this.handleWidgetSelect(name)}
                                >
                                    <ListItemText primary={name}/>
                                </ListItem>
                            )
                        })}
                    </List>
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddWidgetDialog));
