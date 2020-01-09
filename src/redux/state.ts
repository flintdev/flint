// redux/state.ts

export interface StoreState {
    starter: {
        createProjectDialog: object
    },
    config: {
        projectDir: string,
    },
    editor: {
        currentPageIndex: number
    }
}

export const initState = {
    starter: {
        createProjectDialog: {
            open: false
        }
    },
    config: {
        projectDir: '',
    },
    editor: {
        currentPageIndex: 0,
    }
};