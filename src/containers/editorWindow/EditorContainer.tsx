// src/containers/editorWindow/EditorContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles, ThemeProvider} from '@material-ui/core/styles';
import NavigationSidebar from "./NavigationSidebar";
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {ConfigState, EditorState, StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/config/actions";
import {Page} from "../../constants/editor";
import MVCEditor from "./MVCEditor";
import {BackgroundColor, theme, themeColor} from "../../constants";
import {MainProcessCommunicator} from "../../controllers/mainProcessCommunicator";
import {LocalStorageManager} from "../../controllers/localStoreManager";
import {NavigationSidebarConfig} from "../../constants/styles";
import FileBrowser from "./FileBrowser";
import Toast from "../../components/Toast";
import DialogForm from "../../components/DialogForm";

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: BackgroundColor.Editor,
        display: 'flex'
    },
    sider: {
        height: '100vh',
        borderRight: '1px solid #ddd',
        backgroundColor: themeColor.white
    },
    contentContainer: {
        height: '100%',
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
        width: NavigationSidebarConfig.Width,
        borderRight: '1px solid #ddd',
        backgroundColor: themeColor.white
    }
});

export interface Props extends WithStyles<typeof styles>, EditorState, ConfigState {
    setProjectDir?: (projectDir: string) => void,
}

class EditorContainer extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {
        this.initActions().then(r => {});
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<object>, snapshot?: any) {
        if (prevProps.projectDir !== this.props.projectDir) {
            this.forceUpdate();
        }
    }

    initActions = async () => {
        let projectDir = new LocalStorageManager().getProjectDir();
        if (!!projectDir) this.props.setProjectDir(projectDir);
        projectDir = await new MainProcessCommunicator().receiveProjectDir();
        new LocalStorageManager().setProjectDir(projectDir);
        this.props.setProjectDir(projectDir);
    };

    render() {
        const {classes, currentPageIndex, projectDir} = this.props;
        return (
            <ThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    {!!projectDir &&
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
                                        {currentPageIndex === Page.Files && <FileBrowser/>}
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <Toast/>
                        <DialogForm/>

                    </div>
                    }
                </ThemeProvider>
            </ThemeProvider>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return {...state.editor, ...state.config};
};

const mapDispatchToProps = (dispatch: Dispatch<actions.ConfigAction>) => {
    return {
        setProjectDir: (projectDir: string) => dispatch(actions.setProjectDir(projectDir)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditorContainer));
