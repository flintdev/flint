// redux/state.ts
import {MVC} from "../constants/editor";

export interface EditorState {
    projectDir: string,
    currentPageIndex: number,
    mvcEditor: MVCEditorState,
}

export interface MVCEditorState {
    currentView: string,
}

export interface StoreState {
    starter: {
        createProjectDialog: object
    },
    editor: EditorState,
}

export const initState = {
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
        }
    },
};