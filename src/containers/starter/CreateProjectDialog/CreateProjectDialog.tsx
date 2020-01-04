// src/containers/starter/CreateProjectDialog/CreateProjectDialog.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/styles';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import {StoreState} from "src/redux/state";
import * as actions from "src/redux/modules/starter/actions";
import {Modal, Button} from 'antd';
import {LOADING_STATUS} from "../../../constants";
import ParamForm from "./ParamForm";
import {FormValues} from "./typings";
import {FSHelper} from "../../../controllers/utils/fsHelper";

const styles = createStyles({
    root: {},
});

export interface Props extends WithStyles<typeof styles> {
    open?: boolean,
    createProjectDialogClose?: () => void,
}

class CreateProjectDialog extends React.Component<Props, object> {
    state = {
        submitLoading: false,
    };

    formRef: any;

    componentDidMount(): void {

    }

    handleSubmitButtonClick = () => {
        const {form} = this.formRef.props;
        form.validateFields((err: any, values: FormValues) => {
            if (!!err) return;
            this.setState({submitLoading: true});
            const {location} = values;
            new FSHelper().createDirByPath(location)
                .then(() => {
                    this.setState({submitLoading: false});
                    this.props.createProjectDialogClose();
                })
                .catch(err => {
                    console.error('create dir by path', err)
                });
        });

    };

    saveFormRef = (formRef: any) => {
        this.formRef = formRef;
    };

    render() {
        const {classes, open} = this.props;
        const {submitLoading} = this.state;
        return (
            <div className={classes.root}>
                <Modal
                    title={"New Project"}
                    visible={open}
                    okText={"Create"}
                    onOk={this.handleSubmitButtonClick}
                    confirmLoading={submitLoading}
                    onCancel={this.props.createProjectDialogClose}
                >
                    <ParamForm
                        wrappedComponentRef={this.saveFormRef}
                    />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.starter.createProjectDialog;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.StarterAction>) => {
    return {
        createProjectDialogClose: () => dispatch(actions.createProjectDialogClose()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProjectDialog));
