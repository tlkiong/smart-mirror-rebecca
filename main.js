const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

function createWindow() {
  // We want kiosk mode. Kiosk mode eg: https://developer.apple.com/library/mac/technotes/tn2062/_index.html
  // mainWindow = new BrowserWindow({
  //   kiosk: true,
  //   toolbar: false,
  //   title: 'Rebecca',
  //   frame: false
  // });

  // We set fullscreen for dev only
  mainWindow = new BrowserWindow({
    fullscreen: true,
    toolbar: false,
    title: 'Rebecca',
    frame: false
  });

  // Load index.html of the app
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  // To open the devTools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if(mainWindow === null) {
    createWindow();
  }
})