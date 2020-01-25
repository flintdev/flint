import {EditorData} from "@flintdev/model-editor/dist/interface";


export const editorDataSample1: EditorData = {
    treeData: [
        {
            id: 'root-creator',
            name: 'creator',
            type: 'object',
            params: {},
            children: [
                {
                    id: 'root-creator-name',
                    name: 'name',
                    type: 'string',
                },
                {
                    id: 'root-creator-password',
                    name: 'password',
                    type: 'string',
                }
            ]
        },
        {
            id: 'root-time',
            name: 'time',
            type: 'string',
            params: {},
        },
        {
            id: 'root-records',
            name: 'records',
            type: 'array',
            params: {},
            children: [
                {
                    id: 'root-records-items',
                    name: 'items',
                    type: 'string',
                },
            ]
        }
    ]
};