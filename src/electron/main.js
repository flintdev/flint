// electron - main.js

const {app, BrowserWindow, Menu, ipcMain, Tray, dialog, nativeTheme} = require('electron');
const {CHANNEL} = require('./constants');
const path = require('path');

const environment = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
let starterWindow, editorWindow;

nativeTheme.themeSource = "light";

function createStarterWindow() {
    starterWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    starterWindow.loadFile(path.join(__dirname, 'views/starter.html')).then(r => {});
    starterWindow.on('ready-to-show', () => {
        starterWindow.show();
    });
    starterWindow.on('close', event => {
        starterWindow = null;
    });
    // if (environment === 'development') {
    //     starterWindow.webContents.openDevTools();
    // }
}

function createEditorWindow(projectDir) {
    editorWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        }
    });
    editorWindow.loadFile(path.join(__dirname, 'views/editor.html')).then(r => {
        editorWindow.webContents.send(CHANNEL.SEND_PROJECT_DIR, projectDir);
        editorWindow.maximize();
        if (!!starterWindow) starterWindow.close();
    });
    editorWindow.on('ready-to-show', () => {
        editorWindow.show();
    });
    editorWindow.on('close', event => {
        editorWindow = null;
    });
    if (environment === 'development') {
        editorWindow.webContents.openDevTools();
    }

}

app.on('ready', async () => {
    await createStarterWindow();
    ipcMain.on(CHANNEL.OPEN_EDITOR_AND_CLOSE_STARTER, (event, args) => {
        const projectDir = args;
        createEditorWindow(projectDir);
    });
    ipcMain.on(CHANNEL.SELECT_DIRECTORY, (event, args) => {
        dialog.showOpenDialog(starterWindow, {properties: ['openDirectory']})
            .then(result => {
                event.reply(CHANNEL.SELECT_DIRECTORY_REPLY, result.filePaths);
            });
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

app.on('activate', () => {
    if (starterWindow === null) {
        createStarterWindow();
    } else {
        starterWindow.show();
    }
});

app.on('before-quit', event => {
    console.log('app before quit');
    app.quiting = true;
});

app.on('will-quit', event => {
    console.log('will-quit');
});
