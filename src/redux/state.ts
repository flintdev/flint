// redux/state.ts

export interface StoreState {
    starter: {
        createProjectDialog: object
    }
}

export const initState = {
    starter: {
        createProjectDialog: {
            open: false
        }
    },
};