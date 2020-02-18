// 

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import ProcessListView from "./ProcessListView";

const styles = createStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
    },
    content: {
        marginTop: 2,
        flexGrow: 1,
    },
    table: {
        width: '100%',
        height: '100%',
        border: 0,
        cellSpacing: 0,
        cellPadding: 0,
        borderSpacing: 0,
        borderCollapse: 'collapse',
    },
    tdLeft: {
        width: 240,
        borderRight: '1px solid #ddd',
    },
    tdRight: {
        height: '100%',
        display: 'flex',
        flexFlow: "column",
    },
});

export interface Props extends WithStyles<typeof styles>{

}

class ProcessEditorView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <table className={classes.table}>
                        <tbody>
                        <tr>
                            <td className={classes.tdLeft} valign={"top"}>
                                <ProcessListView/>
                            </td>
                            <td className={classes.tdRight} valign={"top"}>

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProcessEditorView));
