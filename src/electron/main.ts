// electron - main.js

import {app, BrowserWindow, Menu, ipcMain, Tray, dialog, nativeTheme} from 'electron';
import {CHANNEL, LOADING_STATUS} from "../constants";
import path = require('path');
import {AutoUpdater} from "./utils/autoUpdater";
import {MenuBuilder} from "./utils/menuBuilder";
import {startDebugging} from "./utils/startDebugging";
import {DebugHelper} from "./utils/debugHelper";
import {StarterMenuBuilder} from "./utils/starterMenuBuilder";
import {PluginFileManager} from "../controllers/pluginFileManager";
import {MigrationHandler} from "../migrations/migrationHandler";

const environment = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
let starterWindow: BrowserWindow,
    editorWindow: BrowserWindow,
    debugWindow: BrowserWindow;
let autoUpdater: AutoUpdater;
let menuBuilder: MenuBuilder;
let starterMenuBuilder: StarterMenuBuilder;
let projectDir: string;
nativeTheme.themeSource = "light";

async function createStarterWindow() {
    starterWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    starterWindow.on('ready-to-show', () => {
        starterWindow.show();
    });
    starterWindow.on('close', event => {
        // @ts-ignore
        if (!app.quiting) {
            event.preventDefault();
            starterWindow.hide();
        } else {
            starterWindow = null;
        }
    });
    starterMenuBuilder = new StarterMenuBuilder(starterWindow);
    starterMenuBuilder.build();
    //
    await starterWindow.loadFile(path.join(__dirname, 'starter.html'));
    starterWindow.webContents.send(CHANNEL.PREINSTALL_PLUGINS, {status: 'loading'});
    try {
        await new PluginFileManager().checkAndFetchPluginsConfig();
        await new PluginFileManager().preinstallPlugins()
        starterWindow.webContents.send(CHANNEL.PREINSTALL_PLUGINS, {status: 'complete'});
    } catch (e) {
        console.log(e);
        starterWindow.webContents.send(CHANNEL.PREINSTALL_PLUGINS, {status: 'error'});
    }
}

async function createEditorWindow(projectDir: string) {
    editorWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        }
    });
    const templatePath = path.join(__dirname, 'editor.html');
    const filePath = await new PluginFileManager().renderHtmlTemplateWithPluginFiles(__dirname, templatePath);
    editorWindow.maximize();
    await editorWindow.loadFile(filePath);
    editorWindow.webContents.send(CHANNEL.SEND_PROJECT_DIR, projectDir);

    if (!!starterWindow) {
        starterWindow.close();
        starterWindow = null;
    }
    editorWindow.on('ready-to-show', () => {
        editorWindow.show();
    });
    editorWindow.on('close', event => {
        // @ts-ignore
        if (!app.quiting) {
            event.preventDefault();
            editorWindow.hide();
        } else {
            editorWindow = null;
            if (!!autoUpdater) autoUpdater.stop();
            autoUpdater = null;
        }
    });
    editorWindow.on('focus', () => {
        editorWindow.webContents.send(CHANNEL.EDITOR_WINDOW_ON_ACTIVE);
    });
    // init auto updater
    autoUpdater = new AutoUpdater(editorWindow);
    autoUpdater.initEventListeners();
    //  init menu
    menuBuilder = new MenuBuilder(editorWindow);
    menuBuilder.build({autoUpdater});
    // async actions
    await autoUpdater.checkForUpdates();
    await autoUpdater.checkForPluginUpdates();
}

async function createDebugWindow() {
    if (!!debugWindow) {
        debugWindow.show();
        debugWindow.reload();
        return;
    }
    debugWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    await debugWindow.loadURL("http://localhost:8080");
    debugWindow.webContents.openDevTools();
    debugWindow.on('ready-to-show', () => {
        debugWindow.show();
    });
    debugWindow.on('close', event => {
        debugWindow = null;
    });
}

app.on('ready', async () => {
    await createStarterWindow();
    ipcMain.on(CHANNEL.OPEN_EDITOR_AND_CLOSE_STARTER, (event, args) => {
        projectDir = args;
        const action = async () => {
            await new MigrationHandler(projectDir).migrate()
            await createEditorWindow(projectDir);
        };
        action().then(r => {});
    });
    ipcMain.on(CHANNEL.SELECT_DIRECTORY, (event, args) => {
        dialog.showOpenDialog(starterWindow, {properties: ['openDirectory']})
            .then(result => {
                event.reply(CHANNEL.SELECT_DIRECTORY_REPLY, result.filePaths);
            });
    });
    ipcMain.on(CHANNEL.START_DEBUGGING, (event, args) => {
        const {dir, localStorageItems} = args;
        // startDebugging(dir).then(r => {});
        createDebugWindow().then(r => {
            new DebugHelper(debugWindow).loadLocalStorage(localStorageItems);
        });
    });
    ipcMain.on(CHANNEL.INSTALL_PLUGIN, (event, args) => {
        const pluginData = args;
        const action = async () => {
            try {
                await new PluginFileManager().downloadPluginWithoutProgress(pluginData);
                event.reply(CHANNEL.INSTALL_PLUGIN_REPLY, {status: LOADING_STATUS.COMPLETE});
            } catch (err) {
                event.reply(CHANNEL.INSTALL_PLUGIN_REPLY, {status: LOADING_STATUS.FAILED});
            }
        };
        action().then(r => {});
    });
    ipcMain.on(CHANNEL.REMOVE_PLUGIN, (event, args) => {
        const pluginData = args;
        const action = async () => {
            await new PluginFileManager().removePlugin(pluginData);
            event.reply(CHANNEL.REMOVE_PLUGIN_REPLY);
        };
        action().then(r => {});
    });
    ipcMain.on(CHANNEL.RELAUNCH_EDITOR_WINDOW, () => {
        editorWindow.close();
        editorWindow = null;
        createEditorWindow(projectDir);
    });
    ipcMain.on(CHANNEL.GET_INSTALLED_PLUGIN, (event, args) => {
        const action = async () => {
            const plugins = await new PluginFileManager().getInstalledPlugins();
            event.reply(CHANNEL.GET_INSTALLED_PLUGIN_REPLY, {plugins});
        };
        action().then(r => {});
    });
    ipcMain.on(CHANNEL.GET_UNINSTALLED_DEPENDENT_PLUGINS, (event, args) => {
        const pluginIdList = args;
        const action = async () => {
            const plugins = await new PluginFileManager().getUninstalledDependentPlugins(pluginIdList);
            event.reply(CHANNEL.GET_UNINSTALLED_DEPENDENT_PLUGINS_REPLY, {plugins});
        };
        action().then(r => {});
    });
    ipcMain.on(CHANNEL.FETCH_ALL_PLUGINS, (event, args) => {
        const action = async () => {
            const pluginFileManager = new PluginFileManager();
            await pluginFileManager.reloadPluginsConfigFromRegistry();
            const {plugins} = await pluginFileManager.getPluginsConfigJson();
            const installedPlugins = await pluginFileManager.getInstalledPlugins();
            event.reply(CHANNEL.FETCH_ALL_PLUGINS_REPLY, {plugins, installedPlugins});
        };
        action().then(r => {});
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

app.on('activate', async () => {
    if (!starterWindow && !editorWindow) {
        await createStarterWindow();
    } else if (!!starterWindow) {
        starterWindow.show();
    } else if (!!editorWindow) {
        editorWindow.show();
    }
    // check updates
    if (!!autoUpdater) await autoUpdater.checkForUpdates();
});

app.on('before-quit', event => {
    // @ts-ignore
    app.quiting = true;
    console.log('app before quit');
});

app.on('will-quit', event => {
    console.log('will-quit');
});
