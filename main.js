const {app, BrowserWindow, Menu, isMac, globalShortcut} = require('electron')

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

function createApplicationMenu() {
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                // quit
                {
                    label: 'Quit',
                    click: () => {
                        app.quit();
                    },
                    accelerator: 'CmdOrCtrl+W'
                }
            ]
        }
    ]

    if (isMac) {
        menuTemplate.unshift({role: 'appMenu'});
    }

    return Menu.buildFromTemplate(menuTemplate)
}

async function onStartUp(){
    await app.whenReady()

    app.applicationMenu = createApplicationMenu();
    globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload())
    globalShortcut.register("CmdOrCtrl+Shift+I", ()=> mainWindow.toggleDevTools())

    mainWindow = createBrowserWindow();
}

onStartUp();
