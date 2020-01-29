// src/containers/editor/MVCEditor/ModelEditorView/SchemaView/SchemaView.tsx

import * as React from 'react';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { StoreState } from "src/redux/state";
import * as actions from "src/redux/modules/editor/actions";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CodeIcon from '@material-ui/icons/Code';
import Avatar from "@material-ui/core/Avatar";

const styles = createStyles({
    root: {
        padding: 20,
        flexGrow: 1
    },
    card: {
        height: '100%'
    },
});

export interface Props extends WithStyles<typeof styles>{

}

class SchemaView extends React.Component<Props, object> {
    state = {

    };

    componentDidMount(): void {

    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={<Avatar><CodeIcon/></Avatar>}
                        title={`Schema Viewer`}
                        subheader={`OpenAPI schema of data model`}
                    />
                    <CardContent>

                    </CardContent>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SchemaView));
