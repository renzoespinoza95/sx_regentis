# build_and_zip.ps1

Write-Host "==============================="
Write-Host " Configurando .env para PRODUCCION"
Write-Host "==============================="

$envFile = Join-Path $PSScriptRoot ".env"

if (!(Test-Path $envFile)) {
    Write-Host "No se encontró el archivo .env"
    exit 1
}

$contenido = @"
#VITE_PUBLIC_URL_BASE=http://localhost:84/bd_regentis
#VITE_PUBLIC_URL_FLASK=http://172.28.81.231:8080
VITE_PUBLIC_URL_FLASK=https://barsi--flaskbarsi--ztw6b8jvgkzn.code.run
VITE_PUBLIC_URL_BASE=https://regentis.app/bd_regentis
VITE_PUBLIC_VUE_QUERY=0
VITE_PUBLIC_VQ_STALETIME=5
VITE_PUBLIC_VERSION=0.88
VITE_PUBLIC_RQ_POLLING=1
VITE_PUBLIC_MERCADO_ID=3
"@

Set-Content -Path $envFile -Value $contenido -Encoding UTF8

Write-Host ".env actualizado correctamente"

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
