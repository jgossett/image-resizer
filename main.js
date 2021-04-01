const {app, BrowserWindow} = require('electron')

let mainWindow;

function createBrowserWindow() {
    const browserWindow = new BrowserWindow({
        title: 'Image Resize',
        width: 500,
        height: 600,
        icon: `${__dirname}/assets/icons/icon__256x256.png`
    });

    browserWindow.loadFile(`./app/index.html`);

    return browserWindow;
}

app.on('ready', () => {
    mainWindow = createBrowserWindow();
})
