//

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {ConfigState, StoreState, UIEditorState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import UIEditor from "@flintdev/ui-editor";
import {ActionData, ComponentData, StateUpdaterData} from "@flintdev/ui-editor/dist/interface";
import {ActionOperationType, StateUpdaterOperationType} from "@flintdev/ui-editor/dist/constants";
import {getWidgetConfiguration, getWidget} from '@flintdev/material-widgets';
import AddWidgetDialog from "./AddWidgetDialog/AddWidgetDialog";
import {UIData, UIDataManager} from "../../../../controllers/ui/uiDataManager";
import * as componentsActions from "src/redux/modules/components/actions";
import {ToastType} from "../../../../components/interface";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    content: {
        marginTop: 2,
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
});

export interface Props extends WithStyles<typeof styles>, UIEditorState, ConfigState {
    addWidgetDialogOpen: () => void,
    toastOpen: (toastType: ToastType, message: string) => void,
}

interface State {
    actions: ActionData[],
    stateUpdaters: StateUpdaterData[],
    initialState: string,
    components: ComponentData[],
}

class UIEditorView extends React.Component<Props, object> {
    state: State = {
        actions: [],
        stateUpdaters: [],
        initialState: '',
        components: [],
    };
    operations: any = {};
    uiDataManager: UIDataManager;
    componentDidMount(): void {
        this.uiDataManager = new UIDataManager(this.props.projectDir);
        this.initActions().then(r => {});
    }

    initActions = async () => {
        await this.uiDataManager.checkAndCreateUIDir();
        const data: UIData = await this.uiDataManager.getUIData();
        this.setState({...data});
        const {components} = data;
        this.operations.updateComponents(components);
    };

    handleAddComponentClick = () => {
        this.props.addWidgetDialogOpen();
    };

    handleActionUpdate = (type: string, data: ActionData) => {
        let {actions} = this.state;
        if (type === ActionOperationType.Update) {
            const index = actions.findIndex(action => action.name === data.name);
            if (index > -1) {
                actions[index] = data;
                this.setState({actions});
            }
        } else if (type === ActionOperationType.Add) {
            actions.push(data);
            this.setState({actions});
        } else if (type === ActionOperationType.Delete) {
            const index = actions.findIndex(action => action.name === data.name);
            if (index > -1) {
                actions.splice(index, 1);
                this.setState({actions});
            }
        }
    };

    handleStateUpdatersOnUpdate = (type: string, data: StateUpdaterData) => {
        let {stateUpdaters} = this.state;
        if (type === StateUpdaterOperationType.Update) {
            const index = stateUpdaters.findIndex(updater => updater.name === data.name);
            if (index > -1) {
                stateUpdaters[index] = data;
                this.setState({stateUpdaters});
            }
        } else if (type === StateUpdaterOperationType.Add) {
            stateUpdaters.push(data);
            this.setState({stateUpdaters});
        } else if (type === StateUpdaterOperationType.Delete) {
            const index = stateUpdaters.findIndex(updater => updater.name === data.name);
            if (index > -1) {
                stateUpdaters.splice(index, 1);
                this.setState({stateUpdaters});
            }
        }
    };

    handleInitialStateChange = (value: string) => {
        this.setState({initialState: value});
    };

    handleComponentsOnUpdate = (components: ComponentData[]) => {
        this.setState({components});
    };

    handleComponentOnSelect = (componentData: ComponentData) => {

    };

    saveButtonClick = async () => {
        const data: UIData = {...this.state};
        await this.uiDataManager.saveUIData(data);
        this.props.toastOpen('success', 'UI data is saved successfully');
    };

    handleWidgetOnSelect = (data: ComponentData) => {
        this.operations.addComponent(data);
    };

    render() {
        const {classes} = this.props;
        const {actions, stateUpdaters, initialState, components} = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <UIEditor
                        operations={this.operations}
                        initialState={initialState}
                        stateUpdaters={stateUpdaters}
                        initialStateOnChange={this.handleInitialStateChange}
                        stateUpdaterOnUpdate={this.handleStateUpdatersOnUpdate}
                        actions={actions}
                        actionOnUpdate={this.handleActionUpdate}
                        components={components}
                        componentsOnUpdate={this.handleComponentsOnUpdate}
                        componentOnSelect={this.handleComponentOnSelect}
                        addComponentOnClick={this.handleAddComponentClick}
                        saveOnClick={this.saveButtonClick}
                        handler={{
                            getWidgetConfig: getWidgetConfiguration,
                            getWidget: getWidget
                        }}
                    />

                    <AddWidgetDialog
                        widgetOnSelect={this.handleWidgetOnSelect}
                    />

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor.uiEditor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction|componentsActions.ComponentsAction>) => {
    return {
        addWidgetDialogOpen: () => dispatch(actions.uiEditor.addWidgetDialogOpen()),
        toastOpen: (toastType: ToastType, message: string) => dispatch(componentsActions.toastOpen(toastType, message)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UIEditorView));
