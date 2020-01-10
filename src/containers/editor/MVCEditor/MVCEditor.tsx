// src/containers/editor/MVCEditor/MVCEditor.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Tabs, Icon, Button} from 'antd';
import {MVC, MVCViews} from "../../../constants/editor";

const {TabPane} = Tabs;

const styles = createStyles({
    root: {
        paddingTop: 5,
    },
    tabContentContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
});

export interface Props extends WithStyles<typeof styles> {

}

const TabIcon = {
    [MVC.Model]: <Icon type={"table"}/>,
    [MVC.View]: <Icon type={"layout"}/>,
    [MVC.Controller]: <Icon type={"cluster"}/>,
};

class MVCEditor extends React.Component<Props, object> {
    state = {
        currentTabKey: MVC.Model
    };

    componentDidMount(): void {

    }

    handleTabChange = (key: string) => {
        this.setState({currentTabKey: key});
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Tabs
                    onChange={this.handleTabChange}
                    type={"card"}
                    tabBarGutter={10}
                    tabBarStyle={{paddingLeft: 10}}
                >
                    {MVCViews.map((view, i) => {
                        return (
                            <TabPane
                                tab={
                                    <span>
                                        {TabIcon[view.key]}
                                        {view.name}
                                    </span>
                                }
                                key={view.key}
                            >
                                <div className={classes.tabContentContainer}>
                                    {view.name}
                                </div>
                            </TabPane>
                        )
                    })}
                </Tabs>
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
