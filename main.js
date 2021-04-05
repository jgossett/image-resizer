const {app, BrowserWindow, Menu, isMac, globalShortcut} = require('electron');

let mainWindow;
let aboutWindow;

function createBrowserWindow() {
    const browserWindow = new BrowserWindow({
        title: app.name,
        width: 500,
        height: 600,
        icon: `${__dirname}/assets/icons/icon__256x256.png`
    });

    browserWindow.loadFile(`./app/index.html`);

    return browserWindow;
}

function createAboutWindow() {
    const browserWindow = new BrowserWindow({
        title: `About ${app.name}`,
        width: 300,
        height: 400,
        resizable: false,
        icon: `${__dirname}/assets/icons/icon__256x256.png`
    });

    browserWindow.loadFile(`./app/about.html`);

    return browserWindow;
}

function createApplicationMenu() {
    const fileMenu = {
        role: 'fileMenu'
    };

    const developerMenu = {
        label: "Developer",
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {type: 'separator'},
            {role: 'toggleDevTools'}
        ]
    };

    const helpMenu = {
        role:"help",
        submenu: [
            {
                label: 'About',
                click: () => {
                    aboutWindow = createAboutWindow();
                }
            }
        ]
    }

    const createDefaultMenu = () => [
        fileMenu,
        developerMenu,
        helpMenu
    ];
    const createMacOsMenu = () => [
        {
            role: 'appMenu'
        },
        fileMenu,
        developerMenu
    ]

    const menuTemplate = !isMac ? createDefaultMenu() : createMacOsMenu();

    return Menu.buildFromTemplate(menuTemplate)
}

async function onStartUp() {
    await app.whenReady()

    app.applicationMenu = createApplicationMenu();
    globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload())
    globalShortcut.register("CmdOrCtrl+Shift+I", () => mainWindow.toggleDevTools())

    mainWindow = createBrowserWindow();
}

onStartUp()
