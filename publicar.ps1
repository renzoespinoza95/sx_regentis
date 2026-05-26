# ============================================
# publicar.ps1
# Regentis TWA Builder
# ============================================

Clear-Host

# ============================================
# CONSTANTES
# ============================================

$PACKAGE_ID = "com.regentis.mercado3"

$APP_NAME = "Mercado Huamantanga"

$ICON_FILE = "mercado3.png"

$VERSION_FILE = "version.txt"

$TWA_MANIFEST = "twa-manifest.json"

$OUTPUT_DIR = "output"

# ============================================
# VALIDAR ARCHIVOS
# ============================================

if (!(Test-Path $TWA_MANIFEST)) {

    Write-Host ""
    Write-Host "No existe twa-manifest.json"
    Write-Host ""

    exit
}

if (!(Test-Path $ICON_FILE)) {

    Write-Host ""
    Write-Host "No existe el icono: $ICON_FILE"
    Write-Host ""

    exit
}

# ============================================
# VERSION CODE
# ============================================

if (!(Test-Path $VERSION_FILE)) {

    "1" | Set-Content $VERSION_FILE
}

$VERSION_CODE = Get-Content $VERSION_FILE
$VERSION_CODE = [int]$VERSION_CODE + 1

$VERSION_NAME = "1.$VERSION_CODE"

$VERSION_CODE.ToString() | Set-Content $VERSION_FILE

# ============================================
# MOSTRAR CONFIG
# ============================================

Write-Host ""
Write-Host "===================================="
Write-Host "REGENTIS TWA BUILDER"
Write-Host "===================================="
Write-Host ""

Write-Host "PACKAGE:"
Write-Host "$PACKAGE_ID"
Write-Host ""

Write-Host "APP:"
Write-Host "$APP_NAME"
Write-Host ""

Write-Host " ICON:"
Write-Host "$ICON_FILE"
Write-Host ""

Write-Host "VERSION CODE:"
Write-Host "$VERSION_CODE"
Write-Host ""

Write-Host "VERSION NAME:"
Write-Host "$VERSION_NAME"
Write-Host ""

# ============================================
# LEER JSON
# ============================================

$json = Get-Content $TWA_MANIFEST -Raw | ConvertFrom-Json

# ============================================
# MODIFICAR CONFIG
# ============================================

$json.packageId = $PACKAGE_ID

$json.name = $APP_NAME

$json.launcherName = $APP_NAME

$json.appVersionCode = $VERSION_CODE

$json.appVersionName = $VERSION_NAME

# ============================================
# ICON URL
# ============================================

$json.iconUrl = "https://huamantanga.lat/$ICON_FILE"

# ============================================
# START URL
# ============================================

$json.startUrl = "/"

# ============================================
# GUARDAR JSON
# ============================================

$jsonContent = $json | ConvertTo-Json -Depth 100

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllText(
    $TWA_MANIFEST,
    $jsonContent,
    $utf8NoBom
)

Write-Host ""
Write-Host "twa-manifest.json actualizado"
Write-Host ""

# ============================================
# LIMPIAR OUTPUT
# ============================================

if (Test-Path $OUTPUT_DIR) {

    Remove-Item $OUTPUT_DIR -Recurse -Force
}

# ============================================
# GENERAR COMPILADOS (AAB Y APK FIRMADO)
# ============================================

Write-Host ""
Write-Host "Generando AAB (Android App Bundle)..."
Write-Host ""

# Genera el bundle oficial para la Google Play Console
bubblewrap build

Write-Host ""
Write-Host "Generando APK Firmado (Para descarga directa)..."
Write-Host ""

# Genera el APK firmado usando las mismas credenciales sin preguntar en consola
bubblewrap build --apk


# ============================================
# BUSCAR AAB
# ============================================

$aab = Get-ChildItem -Recurse -Filter *.aab | Select-Object -First 1

if ($aab -eq $null) {

    Write-Host ""
    Write-Host "No se genero el AAB"
    Write-Host ""

    exit
}

# ============================================
# BUSCAR COMPILADOS
# ============================================

$aab = Get-ChildItem -Recurse -Filter *.aab | Select-Object -First 1
# Buscamos el APK que ya está firmado (evitamos los 'unsigned' o 'aligned' intermedios)
$apk = Get-ChildItem -Recurse -Filter *-release-signed.apk | Select-Object -First 1

if ($aab -eq $null) {
    Write-Host ""
    Write-Host "No se generó el archivo AAB"
    Write-Host ""
    exit
}

if ($apk -eq $null) {
    Write-Host ""
    Write-Host "No se generó el archivo APK firmado"
    Write-Host ""
}

# ============================================
# FINAL
# ============================================

Write-Host ""
Write-Host "===================================="
Write-Host " ARCHIVOS GENERADOS CON ÉXITO"
Write-Host "===================================="
Write-Host ""

Write-Host "GOOGLE PLAY (AAB):"
Write-Host $aab.FullName
Write-Host ""

Write-Host "DESCARGA DIRECTA (APK):"
if ($apk -ne $null) { Write-Host $apk.FullName } else { Write-Host "No encontrado" }
Write-Host ""

Write-Host "PACKAGE:"
Write-Host $PACKAGE_ID
Write-Host ""

Write-Host "LISTO PARA:"
Write-Host "1. Subir AAB a Google Play (Testing Abierto/Interno)"
Write-Host "2. Subir APK a Drive/Mega para descarga directa"
Write-Host ""

pause

pause 
