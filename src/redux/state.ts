// redux/state.ts
import {MVC} from "../constants/editor";
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";
import {FileTreeNode} from "../interface";

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
    currentRevision: {
        editor: number | undefined,
        source: number | undefined,
    }
}

export interface FilesState {
    projectDir: string,
    treeData: FileTreeNode[],
    nodeSelected: FileTreeNode,
    fileContent: string|null,
}

export interface StoreState {
    starter: {
        createProjectDialog: object
    },
    editor: EditorState,
    files: FilesState,
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
            currentRevision: {
                editor: undefined,
                source: undefined
            }
        }
    },
    files: {
        projectDir: '',
        treeData: undefined,
        nodeSelected: undefined,
        fileContent: '',
    }
};