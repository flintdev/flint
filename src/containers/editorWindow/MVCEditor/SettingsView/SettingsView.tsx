// src/containers/editorWindow/MVCEditor/SettingsView/SettingsView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import {SettingsState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import WidgetsIcon from '@material-ui/icons/Widgets';
import LibraryPane from "./LibraryPane";

const styles = createStyles({
    root: {

    },
    paper: {

    },
    content: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
});

export interface Props extends WithStyles<typeof styles>, SettingsState {
    settingsDialogClose: () => void,
}

const Views = [{
    icon: <WidgetsIcon/>,
    label: 'Library',
}];

interface State {
    tabIndex: number
}
class SettingsView extends React.Component<Props, object> {
    state: State = {
        tabIndex: 0
    };

    componentDidMount(): void {

    }

    onEnter = () => {

    };

    handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        this.setState({tabIndex: newValue});
    }

    render() {
        const {classes, open} = this.props;
        const {tabIndex} = this.state;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.settingsDialogClose}
                    onEnter={this.onEnter}
                    disableEnforceFocus={true}
                    fullWidth={true}
                    transitionDuration={0}
                >
                    <Paper square className={classes.paper}>
                        <Tabs
                            value={tabIndex}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            {Views.map((item, i) => {
                                return (
                                    <Tab key={i} label={item.label} icon={item.icon}/>
                                )
                            })}
                        </Tabs>
                    </Paper>
                    <div className={classes.content}>
                        {tabIndex === 0 && <LibraryPane/>}
                    </div>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor.settings;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        settingsDialogClose: () => dispatch(actions.settings.settingsDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SettingsView));
