// electron - main.js

const {app, BrowserWindow, Menu, ipcMain, Tray} = require('electron');
const path = require('path');

let starterWindow, editorWindow;

function createStarterWindow() {
    // const iconPath = path.join(__dirname, 'img/icon.png');
    starterWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // icon: iconPath,
        webPreferences: {
            nodeIntegration: true
        }
    });
    const environment = !!process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
    starterWindow.loadFile(path.join(__dirname, 'views/starter.html'));
    starterWindow.on('ready-to-show', () => {
        starterWindow.show();
    });
    starterWindow.on('close', event => {
        starterWindow = null;
    });
    if (environment === 'development') {
        starterWindow.webContents.openDevTools();
    }
}

app.on('ready', async () => {
    await createStarterWindow();
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
