Write-Host "=================================="
Write-Host " Configurando .env para DESARROLLO"
Write-Host "=================================="

$envFile = Join-Path $PSScriptRoot ".env"

if (!(Test-Path $envFile)) {
    Write-Host "No se encontró el archivo .env"
    exit 1
}

$contenido = @"
VITE_PUBLIC_URL_BASE=http://localhost:84/bd_regentis
VITE_PUBLIC_URL_FLASK=http://172.28.81.231:8080
#VITE_PUBLIC_URL_FLASK=https://barsi--flaskbarsi--ztw6b8jvgkzn.code.run
#VITE_PUBLIC_URL_BASE=https://regentis.app/bd_regentis
VITE_PUBLIC_VUE_QUERY=0
VITE_PUBLIC_VQ_STALETIME=5
VITE_PUBLIC_VERSION=0.88
VITE_PUBLIC_RQ_POLLING=1
VITE_PUBLIC_MERCADO_ID=3
"@

Set-Content -Path $envFile -Value $contenido -Encoding UTF8

Write-Host ".env actualizado correctamente"

npm run dev