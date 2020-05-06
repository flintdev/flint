// redux/state.ts
import {MVC} from "../constants/editor";
import {EditorData, SchemaData} from "@flintdev/model-editor/dist/interface";
import {FileTreeNode, Notification} from "../interface";
import {DialogFormData, DialogFormSubmitFunc, ToastType} from "../components/interface";

export interface EditorState {
    navigation: NavigationState,
    modelEditor: ModelEditorState,
    processEditor: ProcessEditorState,
    uiEditor: UIEditorState,
    settings: SettingsState,
}

export interface SettingsState {
    open: boolean
}

export interface ComponentsState {
    toast: {
        open: boolean,
        type: ToastType,
        message: string,
    },
    dialogForm: {
        open: boolean,
        initValues: any,
        data: DialogFormData,
        onSubmit?: DialogFormSubmitFunc
    }
}

export interface ConfigState {
    projectDir: string,
    currentPageIndex: number,
}

export interface NavigationState {
    currentView: string,
    notificationPopoverAnchorEl: any,
    notifications: Notification[],
    widgetUpdateDialog: {
        open: boolean
    }
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

export interface ProcessEditorState {
    processList: string[],
    processSelected: string | undefined,
    editorData: any | undefined,
    stepEditDialog: {
        open: boolean,
        stepData: any | undefined
    }
}

export interface UIEditorState {
    addWidgetDialog: {
        open: boolean
    },
    addLibraryDialog: {
        open: boolean,
    }
    _mark: number
}

export interface FilesState {
    projectDir: string,
    treeData: FileTreeNode[],
    nodeSelected: FileTreeNode,
    fileContent: string|null,
}

interface CreateProjectDialog {
    open: boolean
}

interface ValidationDialog {
    open: boolean
}

export interface StoreState {
    starter: {
        createProjectDialog: CreateProjectDialog,
        validationDialog: ValidationDialog
    },
    config: ConfigState,
    editor: EditorState,
    files: FilesState,
    components: ComponentsState,
}

export const initState: StoreState = {
    starter: {
        createProjectDialog: {
            open: false
        },
        validationDialog: {
            open: false
        }
    },
    config: {
        projectDir: '',
        currentPageIndex: 0,
    },
    editor: {
        navigation: {
            currentView: MVC.View,
            notificationPopoverAnchorEl: null,
            notifications: [],
            widgetUpdateDialog: {
                open: false
            }
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
        },
        processEditor: {
            processList: [],
            processSelected: undefined,
            editorData: undefined,
            stepEditDialog: {
                open: false,
                stepData: undefined
            }
        },
        uiEditor: {
            addWidgetDialog: {
                open: false,
            },
            addLibraryDialog: {
                open: false
            },
            _mark: 0
        },
        settings: {
            open: false,
        }
    },
    files: {
        projectDir: '',
        treeData: undefined,
        nodeSelected: undefined,
        fileContent: '',
    },
    components: {
        toast: {
            open: false,
            type: 'info',
            message: ''
        },
        dialogForm: {
            open: false,
            initValues: {},
            data: {
                forms: [],
                title: "",
            }
        }
    }
};