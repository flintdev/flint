// src/containers/editor/EditorContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {Layout} from 'antd';
import NavigationSidebar from "./NavigationSidebar";

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
        height: '100vh'
    }
});

export interface Props extends WithStyles<typeof styles> {

}

class EditorContainer extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes} = this.props;
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

                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default withStyles(styles)(EditorContainer);
