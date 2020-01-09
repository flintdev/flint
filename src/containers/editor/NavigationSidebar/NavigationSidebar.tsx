// src/containers/editor/NavigationSidebar/NavigationSidebar.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import {Page, NavigationPages} from "../../../constants/editor";
import {Icon} from 'antd';

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
    icon: {
        fontSize: 20
    }
});

export interface Props extends WithStyles<typeof styles> {
    currentPageIndex: number,
    setCurrentPage?: (pageIndex: number) => void,
}

const ItemIcon = (props: Props) => {
    const {classes} = props;
    return {
        [Page.Editor]: <Icon type={"home"} className={classes.icon}/>,
        [Page.Files]: <Icon type={"copy"} className={classes.icon}/>,
        [Page.Plugins]: <Icon type={"appstore"} className={classes.icon}/>,
        [Page.Delivery]: <Icon type="deployment-unit" className={classes.icon}/>,
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
                            className={classes.tabItem}
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
