// src/containers/editor/EditorContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {Layout} from 'antd';
import NavigationSidebar from "./NavigationSidebar";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Page} from "../../constants/editor";
import MVCEditor from "./MVCEditor";
const {Header, Footer, Sider, Content} = Layout;

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    sider: {
        height: '100vh',
        borderRight: '1px solid #ddd'
    },
    contentContainer: {
        height: '100vh',
        backgroundColor: 'white',
    }
});

export interface Props extends WithStyles<typeof styles> {
    currentPageIndex: number,
}

class EditorContainer extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes, currentPageIndex} = this.props;
        return (
            <div className={classes.root}>
                <Layout>
                    <Sider
                        className={classes.sider}
                        width={60}
                        theme={"light"}
                    >
                        <NavigationSidebar/>
                    </Sider>
                    <Layout>
                        <Content>
                            <div className={classes.contentContainer}>
                                {currentPageIndex === Page.Editor && <MVCEditor/>}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {


    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorContainer));
