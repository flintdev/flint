// src/containers/starterWindow/CreateProjectDialog/ParamForm.tsx

import * as React from 'react';
import {withStyles, WithStyles, createStyles} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import {FSHelper} from "../../../controllers/utils/fsHelper";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const styles = createStyles({
    root: {},
});

export interface Props extends WithStyles<typeof styles> {
    onChange: (params: object) => void,
}

class ParamForm extends React.Component<Props, object> {
    state = {
        location: '',
    };

    componentDidMount(): void {
        const defaultLocation = new FSHelper().getDefaultPath();
        const params = {location: defaultLocation};
        this.setState({...params});
        this.handleFormChange(params);
    }

    handleFormChange = (params: object) => {
        this.props.onChange(params);
    };

    private handleLocationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const location = event.target.value;
        const params = {location};
        this.setState({...params});
        this.handleFormChange(params);
    };

    render() {
        const {classes} = this.props;
        const {location} = this.state;
        return (
            <div className={classes.root}>
                <TextField
                    fullWidth
                    label="Project Location"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FolderOpenIcon/>
                            </InputAdornment>
                        ),
                    }}
                    value={location}
                    onChange={this.handleLocationInputChange}
                />
            </div>
        )
    }
}

export default withStyles(styles)(ParamForm);
