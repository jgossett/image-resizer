const {createWindowsInstaller} = require('electron-winstaller')
const {join} = require('path')
const log = require('electron-log')


async function createInstallerOptions() {
    const outputPath = './build/';
    const appDirectory = join(outputPath, 'desktop-application/Image Resizer-win32-ia32');
    const outputDirectory = join(outputPath, 'windows-installer');

    return {
        appDirectory,
        exe: 'Image Resizer.exe',

        setupIcon: './app/assets/icons/installer-icon.ico',
        outputDirectory,
        setupExe: 'image-resizer-installer.exe',
        setupMsi: 'image-resizer-installer.msi'
    }
}

async function createInstaller() {
    const options = await createInstallerOptions();
    await createWindowsInstaller(options);
}

(async function () {
    try {
        await createInstaller();
    } catch (error) {
        log.error("Encounter an unexpected exception.", error)
    }
})();
