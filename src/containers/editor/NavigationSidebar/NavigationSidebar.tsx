// src/containers/editor/NavigationSidebar/NavigationSidebar.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Page, NavigationPages} from "../../../constants/editor";
import {themeColor} from "../../../constants";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import AppsIcon from '@material-ui/icons/Apps';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import {NavigationSidebarConfig} from "../../../constants/styles";

const styles = createStyles({
    root: {
        textAlign: 'center',
        marginTop: -1,
    },
    tabItem: {
        height: 60,
        width: NavigationSidebarConfig.Width - 4,
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabItemActive: {
        height: 60,
        width: NavigationSidebarConfig.Width - 4,
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: `${4}px solid ${themeColor.primary}`,
        borderRight: `${4}px solid white`,
        marginLeft: -1,
    },
    icon: {
        fontSize: 24,
        marginRight: -2,
    },
    iconActive: {
        fontSize: 24,
        color: themeColor.primary,
        marginRight: 4,
    }
});

export interface Props extends WithStyles<typeof styles> {
    currentPageIndex: number,
    setCurrentPage?: (pageIndex: number) => void,
}

const ItemIcon = (props: Props) => {
    const {classes, currentPageIndex} = props;
    return {
        [Page.Editor]: <DashboardOutlinedIcon className={currentPageIndex === 0 ? classes.iconActive : classes.icon}/>,
        [Page.Files]: <FileCopyOutlinedIcon className={currentPageIndex === 1 ? classes.iconActive : classes.icon}/>,
        [Page.Plugins]: <AppsIcon className={currentPageIndex === 2 ? classes.iconActive : classes.icon}/>,
        [Page.Delivery]: <CloudUploadOutlinedIcon className={currentPageIndex === 3 ? classes.iconActive : classes.icon}/>,
    }
};

class NavigationSidebar extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    handleTabItemClick = (pageIndex: number) => () => {
        this.props.setCurrentPage(pageIndex);
    };

    render() {
        const {classes, currentPageIndex} = this.props;
        return (
            <div className={classes.root}>
                {NavigationPages.map((page, i) => {
                    return (
                        <div
                            className={currentPageIndex === i ? classes.tabItemActive : classes.tabItem}
                            key={i}
                            onClick={this.handleTabItemClick(i)}
                        >
                            {ItemIcon(this.props)[page.key]}
                        </div>
                    )
                })}

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.editor;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.EditorAction>) => {
    return {
        setCurrentPage: (pageIndex: number) => dispatch(actions.setCurrentPage(pageIndex)),

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NavigationSidebar));
