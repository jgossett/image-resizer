const {app, BrowserWindow, Menu, isMac, globalShortcut, ipcMain, shell} = require('electron');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const slash = require('slash');

const ENVIRONMENTS = {
    local: 1,
    production: 2,
}

let mainWindow;
let aboutWindow;
let environment = ENVIRONMENTS.local;

function createBrowserWindow() {
    const browserWindow = new BrowserWindow({
        title: app.name,
        width: environment !== ENVIRONMENTS.local ? 500 : 1000,
        height: 600,
        icon: `${__dirname}/assets/icons/icon__256x256.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    browserWindow.loadFile(`./app/index.html`);

    if (environment === ENVIRONMENTS.local) {
        browserWindow.webContents.openDevTools();
    }

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
        role: "help",
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

ipcMain.on('image.shrink', (event, {path, quality, outputFolderPath}) => {
    console.log('Received "image.shrink" request.', {path, quality, outputFolderPath});
    shrinkImage(path, quality, outputFolderPath)
});

async function shrinkImage(path, quality, outputFolderPath) {
    try {
        const optimizationLevel = Math.floor(quality / 8);
        const pathWithBackslashes = slash(path);
        const outputFolderPathWithBackslashes = slash(outputFolderPath)
        const shrunkPaths = await imagemin(
            [pathWithBackslashes],
            {
                destination: outputFolderPathWithBackslashes,
                plugins: [
                    imageminOptipng({
                        optimizationLevel
                    }),
                    imageminMozjpeg({
                        quality
                    })
                ]
            }
        );

        await shell.openPath(shrunkPaths[0].destinationPath);
    } catch (error) {
        console.error('Could not shrink image file.', error);
    }
}

onStartUp()
