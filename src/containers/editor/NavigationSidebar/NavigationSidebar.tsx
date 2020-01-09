// src/containers/editor/NavigationSidebar/NavigationSidebar.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Page, NavigationPages} from "../../../constants/editor";
import {Icon} from 'antd';
import {themeColor} from "../../../constants";

const styles = createStyles({
    root: {
        textAlign: 'center'
    },
    tabItem: {
        height: 60,
        width: '100%',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabItemActive: {
        height: 60,
        width: '100%',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: `4px solid ${themeColor.primary}`,
        borderRight: `4px solid white`,
    },
    icon: {
        fontSize: 22
    },
    iconActive: {
        fontSize: 22,
        color: themeColor.primary,
    }
});

export interface Props extends WithStyles<typeof styles> {
    currentPageIndex: number,
    setCurrentPage?: (pageIndex: number) => void,
}

const ItemIcon = (props: Props) => {
    const {classes, currentPageIndex} = props;
    return {
        [Page.Editor]: <Icon type={"home"} className={currentPageIndex === 0 ? classes.iconActive : classes.icon}/>,
        [Page.Files]: <Icon type={"copy"} className={currentPageIndex === 1 ? classes.iconActive : classes.icon}/>,
        [Page.Plugins]: <Icon type={"appstore"} className={currentPageIndex === 2 ? classes.iconActive : classes.icon}/>,
        [Page.Delivery]: <Icon type={"deployment-unit"} className={currentPageIndex === 3 ? classes.iconActive : classes.icon}/>,
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
