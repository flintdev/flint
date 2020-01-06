// redux/state.ts

export interface StoreState {
    starter: {
        createProjectDialog: object
    },
    config: {
        projectDir: string,
    },
}

export const initState = {
    starter: {
        createProjectDialog: {
            open: false
        }
    },
    config: {
        projectDir: '',
    }
};