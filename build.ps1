# build_and_zip.ps1

Write-Host "==============================="
Write-Host " Ejecutando npm build"
Write-Host "==============================="

npm run build

if ($LASTEXITCODE -ne 0) {
Write-Host "Error en npm run build"
exit 1
}

$distPath = Join-Path $PSScriptRoot "dist"
$zipPath  = Join-Path $PSScriptRoot "dist.zip"

if (!(Test-Path $distPath)) {
Write-Host "No se encontró la carpeta dist"
exit 1
}

# eliminar zip anterior si existe

if (Test-Path $zipPath) {
Remove-Item $zipPath -Force
}

Write-Host "==============================="
Write-Host " Comprimiendo carpeta dist con WinRAR"
Write-Host "==============================="

$winrar = "C:\Program Files\WinRAR\WinRAR.exe"

if (!(Test-Path $winrar)) {
Write-Host "No se encontró WinRAR en: $winrar"
exit 1
}

# cambiar al directorio del script para evitar rutas completas dentro del zip

Set-Location $PSScriptRoot

# crear zip usando WinRAR

& "$winrar" a -afzip "dist.zip" "dist"

if ($LASTEXITCODE -ne 0) {
Write-Host "Error al crear dist.zip"
exit 1
}

Write-Host "==============================="
Write-Host " dist.zip creado correctamente"
Write-Host "==============================="
