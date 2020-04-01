// src/constants/index.ts

import {createMuiTheme} from "@material-ui/core/styles";

export const themeColor = {
    primary: '#416CED',
    secondary: '#ff4400',
    grey: 'grey',
    white: 'white',
    dimgrey: 'dimgrey',
    lightgrey: 'lightgrey',
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: themeColor.primary,
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            main: themeColor.secondary,
            // dark: will be calculated from palette.secondary.main,
        },
        contrastThreshold: 3,
    }
});

export const BackgroundColor = {
    Editor: '#FFF'
};

export enum LOADING_STATUS {
    NOT_STARTED,
    LOADING,
    COMPLETE,
    FAILED
}

export const CHANNEL = {
    OPEN_EDITOR_AND_CLOSE_STARTER: 'OPEN_EDITOR_AND_CLOSE_STARTER',
    SELECT_DIRECTORY: 'SELECT_DIRECTORY',
    SELECT_DIRECTORY_REPLY: 'SELECT_DIRECTORY_REPLY',
    SEND_PROJECT_DIR: 'SEND_PROJECT_DIR',
    CONSOLE: 'CONSOLE'
};