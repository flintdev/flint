// redux/state.ts
import {MVC} from "../constants/editor";
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";

export interface EditorState {
    projectDir: string,
    currentPageIndex: number,
    mvcEditor: MVCEditorState,
    modelEditor: ModelEditorState,
}

export interface MVCEditorState {
    currentView: string,
}

export interface ModelEditorState {
    modelList: Array<string>,
    modelSelected: string | undefined,
    editorData: EditorData | undefined,
    defaultEditorData: EditorData | undefined,
    schemaData: SchemaData | undefined,
}

export interface StoreState {
    starter: {
        createProjectDialog: object
    },
    editor: EditorState,
}

export const initState: StoreState = {
    starter: {
        createProjectDialog: {
            open: false
        }
    },
    editor: {
        projectDir: '',
        currentPageIndex: 0,
        mvcEditor: {
            currentView: MVC.Model,
        },
        modelEditor: {
            modelList: [],
            modelSelected: undefined,
            editorData: undefined,
            defaultEditorData: undefined,
            schemaData: undefined,
        }
    },
};