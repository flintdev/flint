// src/containers/editor/MVCEditor/MVCEditor.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {MVC, MVCViews} from "../../../constants/editor";
import ModelEditor from '@flintdev/model-editor';
import {editorDataSample1} from './exampleData';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HeaderView from "./HeaderView/HeaderView";

const styles = createStyles({
    root: {},
    content: {
       margin: 20,
    },
});

export interface Props extends WithStyles<typeof styles> {

}

const TabIcon = {
    [MVC.Model]: <AccountTreeIcon/>,
    [MVC.View]: <ViewQuiltIcon/>,
    [MVC.Controller]: <ControlCameraIcon/>,
};

class MVCEditor extends React.Component<Props, object> {
    state = {
        currentTabIndex: 0
    };

    componentDidMount(): void {

    }

    handleTabChange = (event: React.ChangeEvent, index: number) => {
        this.setState({currentTabIndex: index});
    };

    render() {
        const {classes} = this.props;
        const {currentTabIndex} = this.state;
        return (
            <div className={classes.root}>
                <HeaderView/>
                <div className={classes.content}>
                    {currentTabIndex === 0 &&
                    <ModelEditor
                        modelName="TestModel"
                        editorData={editorDataSample1}
                        onSaved={(schemaData: object, editorData: object) => {
                        }}
                    />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MVCEditor));
