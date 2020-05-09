// src/controllers/mainProcessCommunicator.ts

import {ipcRenderer} from 'electron';
import {CHANNEL} from "../constants";
import {PluginData} from "../interface";

export enum Error {
    CANCELLED,
    INVALID_PROJECT_DIR
}

export type OnActiveFunc = () => void;

export class MainProcessCommunicator {

    switchFromStarterToEditorWindow = (projectDir: string) => {
        // open editorWindow window and close starterWindow window
        return new Promise((resolve, reject) => {
            ipcRenderer.send(CHANNEL.OPEN_EDITOR_AND_CLOSE_STARTER, projectDir);
            resolve();
        });
    };

    selectDirectory = () => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.SELECT_DIRECTORY_REPLY, (event: object, arg: Array<string>) => {
                const filePaths = arg;
                if (filePaths.length > 0) resolve(filePaths[0]);
                else reject(Error.CANCELLED);
            });
            ipcRenderer.send(CHANNEL.SELECT_DIRECTORY);
        });
    };

    installPlugin = (plugin: PluginData) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.INSTALL_PLUGIN_REPLY, (event, args) => {
                const {status} = args;
                resolve(status);
            })
            ipcRenderer.send(CHANNEL.INSTALL_PLUGIN, plugin);
        });
    };

    removePlugin = (plugin: PluginData) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.REMOVE_PLUGIN_REPLY, (event, args) => {
                resolve();
            })
            ipcRenderer.send(CHANNEL.REMOVE_PLUGIN, plugin);
        });
    };

    getUninstalledDependentPlugins = (pluginIdList: string[]): Promise<PluginData[]> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.GET_UNINSTALLED_DEPENDENT_PLUGINS_REPLY, ((event, args) => {
                const {plugins} = args;
                resolve(plugins);
            }));
            ipcRenderer.send(CHANNEL.GET_UNINSTALLED_DEPENDENT_PLUGINS, pluginIdList);
        });
    }

    getInstalledPlugins = () => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.GET_INSTALLED_PLUGIN_REPLY, ((event, args) => {
                const {plugins} = args;
                resolve(plugins);
            }));
            ipcRenderer.send(CHANNEL.GET_INSTALLED_PLUGIN);
        });
    };

    fetchAllPlugins = (): any => {
        // 1. fetch from remote plugin-registry
        // 2. save in local config.json
        // 3. read config.json
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.FETCH_ALL_PLUGINS_REPLY, ((event, args) => {
                resolve(args);
            }));
            ipcRenderer.send(CHANNEL.FETCH_ALL_PLUGINS);
        });
    };

    gitLog = (projectDir: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.GIT_LOG_REPLY, (event, args) => {
                const {commits} = args;
                resolve(commits);
            });
            ipcRenderer.send(CHANNEL.GIT_LOG, {projectDir});
        });
    };

    gitCommit = (projectDir: string) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.GIT_COMMIT_REPLY, (event, args) => {
                resolve();
            });
            ipcRenderer.send(CHANNEL.GIT_COMMIT, {projectDir});
        });
    };

    gitReset = (projectDir: string, commitId: string) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.GIT_RESET_REPLY, (event, args) => {
                resolve();
            });
            ipcRenderer.send(CHANNEL.GIT_RESET, {projectDir, commitId});
        });
    };

    relaunchEditorWindow = () => {
        ipcRenderer.send(CHANNEL.RELAUNCH_EDITOR_WINDOW);
    };

    receiveProjectDir = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once(CHANNEL.SEND_PROJECT_DIR, (event: object, arg: string) => {
                const projectDir = arg;
                if (!projectDir) reject(Error.INVALID_PROJECT_DIR);
                else resolve(projectDir);
            });
        });
    };

    initGlobalListeners = () => {
        ipcRenderer.on(CHANNEL.CONSOLE, ((event, args) => {

        }));
    };

    startDebugging = (dir: string, localStorageItems: any[]) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.send(CHANNEL.START_DEBUGGING, {dir, localStorageItems});
            resolve();
        });
    };

    waitingWindowBackToActive = (onActive: OnActiveFunc) => {
        ipcRenderer.once(CHANNEL.EDITOR_WINDOW_ON_ACTIVE, () => {
            onActive();
        })
    };

    addListenerForPreinstallPlugins = (statusUpdated: (args: any) => void) => {
        ipcRenderer.on(CHANNEL.PREINSTALL_PLUGINS, (event, args) => {
            statusUpdated(args);
        });
    }

    removeListenerForPreinstallPlugins = () => {
        ipcRenderer.removeListener(CHANNEL.PREINSTALL_PLUGINS, () => {});
    };

    addNewPluginsListener = (notificationsReceived: (plugins: PluginData[]) => void) => {
        ipcRenderer.on(CHANNEL.NEW_PLUGIN_UPDATES, (event, args) => {
            notificationsReceived(args.plugins)
        });
    };

}