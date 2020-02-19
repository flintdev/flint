// src/containers/editorWindow/MVCEditor/ProcessEditorView/stepOptions.tsx

import * as React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import NewReleasesTwoToneIcon from '@material-ui/icons/NewReleasesTwoTone';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

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
        "type": "Approve/Reject",
        "group": "Standard",
        "category": "Automation",
        "icon": <AssignmentTurnedInTwoToneIcon />
    },
    {
        "type": "Object Add",
        "group": "Standard",
        "category": "Trigger",
        "icon": <AddCircleTwoToneIcon />
    },
    {
        "type": "Object Update",
        "group": "Standard",
        "category": "Trigger",
        "icon": <NewReleasesTwoToneIcon />
    },
    {
        "type": "Object Delete",
        "group": "Standard",
        "category": "Trigger",
        "icon": <HighlightOffTwoToneIcon />
    },
    {
        "type": "Gmail",
        "group": "Third-party",
        "category": "Notification",
        "icon": <EmailTwoToneIcon />
    }
];