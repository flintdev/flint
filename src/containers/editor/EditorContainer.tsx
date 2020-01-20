// src/containers/editor/EditorContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles, ThemeProvider} from '@material-ui/core/styles';
import NavigationSidebar from "./NavigationSidebar";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Page} from "../../constants/editor";
import MVCEditor from "./MVCEditor";
import {theme} from "../../constants";
import {MainProcessCommunicator} from "../../controllers/mainProcessCommunicator";
import {LocalStorageManager} from "../../controllers/localStoreManager";

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
        height: '100%',
        backgroundColor: 'white',
    },
    table: {
        width: '100%',
        height: '100vh',
        border: 0,
        cellSpacing: 0,
        cellPadding: 0,
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },
    tdLeft: {
        width: 60,
        borderRight: '1px solid #ddd',
    }
});

export interface Props extends WithStyles<typeof styles> {
    currentPageIndex: number,
    setProjectDir: (projectDir: string) => void,
}

class EditorContainer extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {
        const projectDir = new LocalStorageManager().getProjectDir();
        if (!!projectDir) this.props.setProjectDir(projectDir);
        new MainProcessCommunicator().receiveProjectDir()
            .then((projectDir: string) => {
                new LocalStorageManager().setProjectDir(projectDir);
                this.props.setProjectDir(projectDir);
            });
    }

    render() {
        const {classes, currentPageIndex} = this.props;
        return (
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft} valign={"top"}>
                                <NavigationSidebar/>
                            </td>
                            <td valign={"top"}>
                                <div className={classes.contentContainer}>
                                    {currentPageIndex === Page.Editor && <MVCEditor/>}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </ThemeProvider>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        setProjectDir: (projectDir: string) => dispatch(actions.setProjectDir(projectDir)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorContainer));
