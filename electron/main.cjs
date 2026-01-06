const { app, BrowserWindow } = require('electron');
const path = require('path');

// 開発モードかどうかを判定
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        // 手書き風アプリに合うように標準のフレームを消すなどのOPも可能だが、
        // まずは標準ウィンドウで実装
        autoHideMenuBar: true, // メニューバーを隠す
        icon: path.join(__dirname, '../public/assets/cat_normal.png') // アイコン設定
    });

    if (isDev) {
        // 開発時はViteサーバーのURLを読み込む
        win.loadURL('http://localhost:5173');
        // 開発ツールを開く
        // win.webContents.openDevTools();
    } else {
        // 本番（ビルド後）は生成されたHTMLファイルを読み込む
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
