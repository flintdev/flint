// src/components/DialogForm/DialogForm.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from '@material-ui/core/Button';
import {LOADING_STATUS} from "../../constants";
import {TextField} from "@material-ui/core";
import {ComponentsState, StoreState} from "../../redux/state";
import {Dispatch} from "redux";
import * as actions from "../../redux/modules/components/actions";
import {connect} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";

const styles = createStyles({
    root: {

    },
    form: {
        marginBottom: 10,
    }
});


export interface Props extends WithStyles<typeof styles>, ComponentsState {
    closeDialogForm: () => void
}

interface State {
    values: any,
}

class DialogForm extends React.Component<Props, object> {
    state: State = {
        values: {},
    };

    componentDidMount(): void {

    }

    onEnter = () => {
        const {initValues} = this.props.dialogForm;
        this.setState({values: initValues});
    };

    handleSubmitButtonClick = () => {
        const {values} = this.state;
        const {onSubmit} = this.props.dialogForm;
        if (!!onSubmit) onSubmit(values);
        this.props.closeDialogForm();
    };

    handleFormChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let {values} = this.state;
        values[key] = value;
        this.setState({values});
    };
    
    getParamValueByKey = (key: string, defaultValue: any) => {
        const {values} = this.state;
        let value = values[key];
        if (!!value) return value;
        if (!!defaultValue) return defaultValue;
        return '';
    };

    render() {
        const {classes, dialogForm} = this.props;
        const {open, data} = dialogForm;
        const {forms, title, description, submitLabel, cancelLabel} = data;
        return (
            <div className={classes.root}>
                <Dialog
                    open={open}
                    onClose={this.props.closeDialogForm}
                    onEnter={this.onEnter}
                    fullWidth={true}
                >
                    {!!title &&
                    <DialogTitle>{title}</DialogTitle>
                    }
                    <DialogContent>
                        {!!description &&
                        <DialogContentText>{description}</DialogContentText>
                        }
                        {forms.map((form, i) => {
                            const {type, key, label, placeholder, helperText, required, defaultValue, dataType, autofocus, options} = form;
                            const value = this.getParamValueByKey(key, defaultValue);
                            return (
                                <div key={i}>
                                    {type === "input" && 
                                    <TextField
                                        className={classes.form}
                                        fullWidth
                                        value={value}
                                        label={label}
                                        required={!!required}
                                        helperText={helperText}
                                        placeholder={placeholder}
                                        type={dataType}
                                        autoFocus={!!autofocus}
                                        onChange={this.handleFormChange(key)}
                                    />
                                    }
                                    {type === "select" &&
                                    <TextField
                                        className={classes.form}
                                        fullWidth
                                        value={value}
                                        label={label}
                                        required={!!required}
                                        helperText={helperText}
                                        placeholder={placeholder}
                                        type={dataType}
                                        autoFocus={!!autofocus}
                                        select
                                        onChange={this.handleFormChange(key)}
                                    >
                                        {!!options && options.map((option, i) => {
                                            return (
                                                <MenuItem key={i} value={option}>{option}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                    }
                                </div>
                            )
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.props.closeDialogForm}
                        >
                            {!!cancelLabel ? cancelLabel : 'Close'}
                        </Button>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={this.handleSubmitButtonClick}
                        >
                            {!!submitLabel ? submitLabel : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState) => {
    return state.components;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.ComponentsAction>) => {
    return {
        closeDialogForm: () => dispatch(actions.closeDialogForm()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DialogForm));
