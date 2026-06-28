# Install the official Vercel plugin for Cursor (SULUT PROTECT / Next.js).
# Run from PowerShell:
#   cd C:\Users\Darren\sulut-protect
#   .\scripts\install-vercel-plugin.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LocalPluginDir = Join-Path $env:USERPROFILE ".cursor\plugins\local\vercel-plugin"
$RepoUrl = "https://github.com/vercel/vercel-plugin.git"

Write-Host "SULUT PROTECT — Vercel plugin installer" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot`n"

function Test-PluginInstalled {
    $manifest = Join-Path $LocalPluginDir ".cursor-plugin\plugin.json"
    return (Test-Path $manifest)
}

# Method 1: npx plugins CLI (preferred by Vercel docs)
Write-Host "[1/2] Trying: npx plugins add vercel/vercel-plugin ..." -ForegroundColor Yellow
Set-Location $ProjectRoot
try {
    & npx.cmd --yes plugins add vercel/vercel-plugin
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nInstall finished via npx." -ForegroundColor Green
        Write-Host "Reload Cursor: Developer -> Reload Window (or restart Cursor)." -ForegroundColor Cyan
        Write-Host "Verify: Settings -> Customize -> Plugins -> Vercel should appear." -ForegroundColor Cyan
        exit 0
    }
    Write-Host "npx exited with code $LASTEXITCODE — trying git clone fallback..." -ForegroundColor DarkYellow
} catch {
    Write-Host "npx failed: $_ — trying git clone fallback..." -ForegroundColor DarkYellow
}

# Method 2: clone into Cursor local plugins folder
Write-Host "[2/2] Cloning to $LocalPluginDir ..." -ForegroundColor Yellow
$pluginsParent = Split-Path $LocalPluginDir -Parent
if (-not (Test-Path $pluginsParent)) {
    New-Item -ItemType Directory -Path $pluginsParent -Force | Out-Null
}
if (Test-Path $LocalPluginDir) {
    Write-Host "Removing existing folder..." -ForegroundColor DarkGray
    Remove-Item -Recurse -Force $LocalPluginDir
}

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "`nCould not install automatically (npx and git both unavailable)." -ForegroundColor Red
    Write-Host "Easiest fix: in Cursor chat, type:" -ForegroundColor Yellow
    Write-Host "  /add-plugin vercel" -ForegroundColor White
    exit 1
}

& git clone --depth 1 $RepoUrl $LocalPluginDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nGit clone failed." -ForegroundColor Red
    Write-Host "In Cursor chat, type: /add-plugin vercel" -ForegroundColor Yellow
    exit 1
}

if (Test-PluginInstalled) {
    Write-Host "`nVercel plugin cloned successfully." -ForegroundColor Green
    Write-Host "Reload Cursor: Developer -> Reload Window." -ForegroundColor Cyan
    Write-Host "Verify: Settings -> Customize -> Plugins." -ForegroundColor Cyan
    exit 0
}

Write-Host "`nClone completed but plugin manifest not found." -ForegroundColor Red
exit 1
