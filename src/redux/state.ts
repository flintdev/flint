// redux/state.ts

export interface EditorState {
    projectDir: string,
    currentPageIndex: number
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
    }
};