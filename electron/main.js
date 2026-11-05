const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const SITE = 'https://rajajunaidzamurd.github.io/deepsky-accounts/';
if (!app.requestSingleInstanceLock()) app.quit();
function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 850, minWidth: 900, minHeight: 600,
    title: 'Deep Sky Marquee Accounts', icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#0A1433', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false }
  });
  Menu.setApplicationMenu(null);
  win.loadURL(SITE);
  win.webContents.on('did-fail-load', (_e, _c, _d, _u, isMain) => {
    if (isMain) win.loadFile(path.join(__dirname, 'offline.html'));
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url || url === 'about:blank') return { action: 'allow' };
    if (/^(https?|mailto):/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(SITE) && /^(https?|mailto):/i.test(url)) { e.preventDefault(); shell.openExternal(url); }
  });
}
app.whenReady().then(createWindow);
app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
app.on('window-all-closed', () => app.quit());
