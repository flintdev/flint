// redux/state.ts
import {MVC} from "../constants/editor";

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
    modelSelected: string | null,
    editorData: object | null,
    createModelDialog: {
        open: boolean,
    }
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
            modelSelected: null,
            editorData: null,
            createModelDialog: {
                open: false
            }
        }
    },
};