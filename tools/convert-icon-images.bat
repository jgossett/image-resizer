@ECHO off

SET FILE_NOT_FOUND_CODE=9009

SET INKSCAPE_APPLICATION_PATH="%PROGRAMFILES%\Inkscape\bin\inkscape.com"
SET ICON_FOLDER_PATH=../app/assets/icons/

SET APPLICATION_FILE_NAME_PREFIX=application-icon
SET INSTALLER_FILE_NAME_PREFIX=installer-icon

:: Verify Inkscape is installed.
IF not exist %INKSCAPE_APPLICATION_PATH% (
    ECHO.
    ECHO.ERROR: The `inkscape` command is not found. Run `choco install inkscape`.
    EXIT /b 1
)

:: Verify Imagemagick is installed.
magick -version > NUL
IF %ERRORLEVEL%==%FILE_NOT_FOUND_CODE% (
     ECHO.
     ECHO.ERROR: The `imagemagick` command is not found. Run `choco install imagemagick`.
     EXIT /b 1
)

CALL:convert-to-png-and-ico-images %APPLICATION_FILE_NAME_PREFIX% %ICON_FOLDER_PATH%
CALL:convert-to-png-and-ico-images %INSTALLER_FILE_NAME_PREFIX% %ICON_FOLDER_PATH%

EXIT /B %ERRORLEVEL%

::
:: Converts SVG file in PNG and ICO files.
::
:convert-to-png-and-ico-images
SETLOCAL
SET fileNamePrefix=%1
SET folderPath=%2
SET sourceFilePath=%folderPath%%fileNamePrefix%__source.svg
SET basePath=%folderPath%%fileNamePrefix%__

:: Create PNG files.
CALL:convert-to-png-image %sourceFilePath% %basePath% 16 16
CALL:convert-to-png-image %sourceFilePath% %basePath% 32 32
CALL:convert-to-png-image %sourceFilePath% %basePath% 48 48
CALL:convert-to-png-image %sourceFilePath% %basePath% 64 64
CALL:convert-to-png-image %sourceFilePath% %basePath% 128 128
CALL:convert-to-png-image %sourceFilePath% %basePath% 256 256

:: Create ICO file.
SET iconPath=%folderPath%%fileNamePrefix%.ico
magick %basePath%16x16.png %basePath%32x32.png %basePath%48x48.png %basePath%256x256.png %iconPath%
CALL:log "Created %iconPath%"

ENDLOCAL
EXIT /b 0

::
:: Resizes and converts a SVG file into PNG file
::
:convert-to-png-image
SETLOCAL

SET exportFilePath=%1
SET basePath=%2
SET width=%3
SET height=%4

SET outputFilePath=%basePath%%width%x%height%.png

%INKSCAPE_APPLICATION_PATH% -w %width% -h %height% -o %outputFilePath% %exportFilePath%
CALL:log "Created %outputFilePath% file."

ENDLOCAL
EXIT /b 0

::
:: Logs message to console.
::
:log

ECHO.LOG: %1

EXIT /b 0
