// src/containers/starter/CreateProjectDialog/ParamForm.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';

const styles = createStyles({
    root: {},
});

export interface Props extends WithStyles<typeof styles>, FormComponentProps {

}

class ParamForm extends React.Component<Props, object> {
    state = {};

    componentDidMount(): void {

    }

    render() {
        const {classes, form} = this.props;
        return (
            <div className={classes.root}>
                <Form layout={"vertical"}>
                    <Form.Item label={"Location"}>
                        {form.getFieldDecorator('location', {
                            rules: [{
                                required: true,
                                message: 'Please input valid location of new project'
                            }],
                        })(<Input/>)}
                    </Form.Item>
                </Form>
            </div>
        )
    }
}


export default withStyles(styles)(Form.create({name: 'new_project_form'})(ParamForm));
