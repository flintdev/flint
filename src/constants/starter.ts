//

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
    }
};