// redux/state.ts

export interface StoreState {
    starter: object
}

export const initState = {
    starter: {
        createProjectDialog: {
            open: false
        }
    },
};