@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for RealEstate Portal Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "IDEA_MAVEN=C:\Program Files\JetBrains\IntelliJ IDEA 2026.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
set "IDEA_JBR=C:\Program Files\JetBrains\IntelliJ IDEA 2026.3\jbr"

if "%JAVA_HOME%"=="" (
    if exist "%IDEA_JBR%" (
        set "JAVA_HOME=%IDEA_JBR%"
    )
)

where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

if exist "%IDEA_MAVEN%" (
    call "%IDEA_MAVEN%" %*
    exit /b %ERRORLEVEL%
)

echo [ERRORE] Maven non trovato. Assicurati che Maven o IntelliJ IDEA sia installato.
exit /b 1
