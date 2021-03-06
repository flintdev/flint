// src/constants/starterWindow.ts

import {version} from "pjson";

export const StarterConfig = {
    ActionView: {
        title: 'Flint',
        description: `Version ${version}`,
        action: {
            create: 'Create New Project',
            open: 'Open Existing Project',
            checkout: 'Checkout from Github',
        }
    },
    CreateProjectDialog: {
        location: {
            errorMessage: 'Please input valid location of new project',
        }
    }
};