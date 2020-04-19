// src/containers/editorWindow/MVCEditor/ProcessEditorView/stepOptions.tsx

import * as React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';

export const stepOptions = [
    {
        "type": "Code Block",
        "group": "Standard",
        "category": "Automation",
        "icon": <CodeIcon/>
    },
    {
        "type": "End",
        "group": "Standard",
        "category": "Automation",
        "icon": <RadioButtonCheckedIcon/>
    },
    {
        "type": "Hub",
        "group": "Standard",
        "category": "Automation",
        "icon": <AccountTreeOutlinedIcon/>
    },
    {
        "type": "Manual",
        "group": "Standard",
        "category": "Manual",
        "icon": <AssignmentTurnedInTwoToneIcon />
    },
    {
        "type": "Trigger",
        "group": "Standard",
        "category": "Automation",
        "icon": <AddCircleTwoToneIcon />
    },
    {
        "type": "Gmail",
        "group": "Third-party",
        "category": "Notification",
        "icon": <EmailTwoToneIcon />
    }
];