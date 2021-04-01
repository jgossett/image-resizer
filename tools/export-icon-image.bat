@ECHO off

SET INKSCAPE_APPLICATION_PATH="%PROGRAMFILES%\Inkscape\bin\inkscape.com"

SET FILE_NAME=icon__source.svg
SET FOLDER_PATH=../assets/icons/
SET FILE_PATH=%FOLDER_PATH%/%FILE_NAME%

:: verify Inkscape is installed.

IF not exist %INKSCAPE_APPLICATION_PATH% (
    ECHO.
    ECHO.ERROR: The `inkscape` command is not found. Run `choco install inkscape`.
    EXIT /b 1
)

:: Verify Imagemagick is installed.
magick -version
IF NOT ERRORLEVEL 0 (
     ECHO.
     ECHO.ERROR: The `imagemagick` command is not found. Run `choco install imagemagick`.
     EXIT /b 1
)


::: Create PNG files.
CALL:to-png-image %FILE_PATH% 16 16
CALL:to-png-image %FILE_PATH% 32 32
CALL:to-png-image %FILE_PATH% 48 48
CALL:to-png-image %FILE_PATH% 64 64
CALL:to-png-image %FILE_PATH% 128 128
CALL:to-png-image %FILE_PATH% 256 256

:: create ICO file.
SET BASE_PNG_PATH=%FOLDER_PATH%icon__
magick %BASE_PNG_PATH%16x16.png %BASE_PNG_PATH%32x32.png %BASE_PNG_PATH%48x48.png %BASE_PNG_PATH%256x256.png %FOLDER_PATH%icon.ico

EXIT /B %ERRORLEVEL%

::
:: Resizes and converts a file into PNG
::
:to-png-image
SETLOCAL

SET export_file_path=%1
SET width=%2
SET height=%3

SET output_file_path=%FOLDER_PATH%icon__%width%x%height%.png

%INKSCAPE_APPLICATION_PATH% -w %width% -h %height% -o %output_file_path% %export_file_path%
CALL:log "Created %output_file_path% file."

ENDLOCAL
EXIT /b 0

::
:: Logs message to console.
::
:log

ECHO.LOG: %1

EXIT /b 0
