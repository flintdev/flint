// containers/starter/StarterContainer.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import ActionView from "./ActionView";
import { Row, Col } from 'antd';

const styles = createStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    projectsContainer: {
        borderLeft: '1px solid lightgrey',
        height: '100vh'
    }
});

export interface Props extends WithStyles<typeof styles>{

}

function StarterContainer(props: Props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <Row>
                <Col span={12}>
                    <ActionView/>
                </Col>
                <Col span={12}>
                    <div className={classes.projectsContainer}>

                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default withStyles(styles)(StarterContainer);