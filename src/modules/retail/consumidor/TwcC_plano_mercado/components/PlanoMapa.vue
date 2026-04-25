<template>
  <div class="px-4 pb-24">
    <div class="mt-3 bg-white rounded-3xl shadow-md overflow-hidden">
      <div
        ref="viewportEl"
        class="relative w-full h-[500px] select-none bg-cover bg-center"
        style="background-image: url('/ch_verde_claro.jpg')"
      >
        <!-- PIXI CANVAS se inyecta aquí -->
        <div ref="pixiHostEl" class="absolute inset-0"></div>

        <!-- mini toast -->
        <div v-if="toast" class="absolute left-3 bottom-3 bg-black/75 text-white text-xs px-3 py-2 rounded-xl">
          {{ toast }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as PIXI from 'pixi.js'
import planoJson from '../assets/plano_huamantanga.json'
import spriteUrl from '../assets/tile_base_64.png'


/**
 * Props: para integrarte con tu ActionSheet/carrusel en el padre
 * - selected: objeto seleccionado (para highlight)
 * - markers: lista de negocios (Don Emiliano...) para buscar por "Puesto XX"
 */
const props = defineProps({
  selected: { type: Object, default: null },
  markers: { type: Array, default: () => [] },
  destino: { type: [String, Number], default: null }
})
const emit = defineEmits(['selectMarker', 'closePopup'])

/**
 * ✅ REGLA: solo BLANCO (tileId 0) es caminable
 */
const WALKABLE_TILE_IDS = new Set([0])

/**
 * Tiled:
 * - tilewidth = 64 (tu JSON)
 * UI:
 * - lo quieres a la mitad => 32
 */
const DISPLAY_TILE = 32
const SPRITE_COLS = 3

const viewportEl = ref(null)
const pixiHostEl = ref(null)
const toast = ref('')

const TILESET_SIZES = {
  64: 64,
  128: 128
}

const TEXT_ZOOM_THRESHOLD = 1.4
const STALL_ZOOM_THRESHOLD = 1.4

// 🔥 guardar último puesto clickeado (origen)
const lastOrigen = ref(null)


let tileSize = 64
let tileLayer = null
let puestosLayer = null

// bounds en tiles (por chunks)
let minTileX = 0
let minTileY = 0
let maxTileX = 0
let maxTileY = 0

let firstgid64 = 1
let firstgid128 = 1

// grid real (ancho/alto en tiles)
const gridW = ref(0)
const gridH = ref(0)

// grid tileIds (y * W + x)
let grid = []

// stalls (objetos)
const stalls = ref([])

// ===== PIXI =====
let app = null
let world = null
let tilesLayer = null
let stallsLayer = null
let markersLayer = null
let routeLayer = null
let highlightLayer = null

let character = null
let characterTex = null
let isWalking = false
let walkDirection = 1 // 1 ida, -1 vuelta
let walkIndex = 0
let walkSpeed = 1.8 // píxeles por frame (moderado)

let baseTex = null
const tileTextures = new Map() // tileId -> PIXI.Texture

// cámara (pan/zoom)
const cam = {
  x: 0,
  y: 0,
  scale: 1
}

// drag state
let isDown = false
let moved = false
let startClientX = 0
let startClientY = 0
let startCamX = 0
let startCamY = 0

// zoom state
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3.0

// ===== PINCH STATE =====
let isPinching = false
let pinchStartDist = 0
let pinchStartScale = 1
let pinchCenterStart = { x: 0, y: 0 }
let pinchWorldPointStart = { x: 0, y: 0 }

let baseTex64 = null
let baseTex128 = null

let fixedMarkersLayer = null

// render visible tiles (culling + pooling)
const tilePool = []
const visibleTiles = new Map() // key "x,y" -> sprite

// ruta
const route = ref([]) // [{x,y} tiles]
const worldWidthPx = computed(() => gridW.value * DISPLAY_TILE)
const worldHeightPx = computed(() => gridH.value * DISPLAY_TILE)


/**
 * ===== helpers =====
 */
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}

function keyXY(x, y) {
  return `${x},${y}`
}

function getPoint(e) {
  const t = e.touches?.[0]
  return {
    x: t ? t.clientX : e.clientX,
    y: t ? t.clientY : e.clientY
  }
}

  /**
   * tile textures desde sprite (64->32)
   * tileId en Tiled empieza en 1 (gid), 0=vacío
   */
  function getTileTexture(tileId) {

    if (tileId === 0) {
      return PIXI.Texture.WHITE
    }

    if (tileTextures.has(tileId)) {
      return tileTextures.get(tileId)
    }

    let texture

    if (tileId >= firstgid128) {
      // ===== TILESET 128 =====
      const index = tileId - firstgid128

      const cols = baseTex128.width / 128

      const col = index % cols
      const row = Math.floor(index / cols)

      const rect = new PIXI.Rectangle(
        col * 128,
        row * 128,
        128,
        128
      )

      texture = new PIXI.Texture({
        source: baseTex128,
        frame: rect
      })

    } else {
      // ===== TILESET 64 =====
      const index = tileId - firstgid64

      const cols = baseTex64.width / 64

      const col = index % cols
      const row = Math.floor(index / cols)

      const rect = new PIXI.Rectangle(
        col * 64,
        row * 64,
        64,
        64
      )

      texture = new PIXI.Texture({
        source: baseTex64,
        frame: rect
      })
    }

    tileTextures.set(tileId, texture)
    return texture
  }

/**
 * Caminable: tileId === 0
 */
function isWalkableByTile(x, y) {
  const W = gridW.value
  const H = gridH.value
  if (x < 0 || y < 0 || x >= W || y >= H) return false
  const id = grid[y * W + x] ?? 0
  return WALKABLE_TILE_IDS.has(id)
}

function nearestWalkable(fromX, fromY, maxR = 8) {
  if (isWalkableByTile(fromX, fromY)) return { x: fromX, y: fromY }
  for (let r = 1; r <= maxR; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = fromX + dx
        const y = fromY + dy
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue
        if (isWalkableByTile(x, y)) return { x, y }
      }
    }
  }
  return null
}

function bfs(start, goal) {
  const W = gridW.value
  const H = gridH.value
  const idx = (x, y) => y * W + x

  const q = new Array(W * H)
  let qi = 0, qj = 0

  const prev = new Array(W * H).fill(-1)
  const seen = new Uint8Array(W * H)

  q[qj++] = start
  seen[idx(start.x, start.y)] = 1

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]

  while (qi < qj) {
    const cur = q[qi++]
    if (cur.x === goal.x && cur.y === goal.y) break

    for (const [dx, dy] of dirs) {
      const nx = cur.x + dx
      const ny = cur.y + dy
      if (!isWalkableByTile(nx, ny)) continue
      const k = idx(nx, ny)
      if (seen[k]) continue
      seen[k] = 1
      prev[k] = idx(cur.x, cur.y)
      q[qj++] = { x: nx, y: ny }
    }
  }

  const gk = idx(goal.x, goal.y)
  if (!seen[gk]) return []

  const out = []
  let k = gk
  while (k !== -1) {
    const x = k % W
    const y = Math.floor(k / W)
    out.push({ x, y })
    k = prev[k]
  }
  out.reverse()
  return out
}

/**
 * ===== negocios/markers =====
 */
function findBusinessByPuesto(numStr) {
  const needle = `Puesto ${numStr}`
  return props.markers.find(m => (m.subtitle || '').includes(needle)) || null
}

function emitSelectForPuesto(numStr) {
  const business = findBusinessByPuesto(String(numStr))
  emit(
    'selectMarker',
    business || {
      id: `p${numStr}`,
      name: `Puesto ${numStr}`,
      subtitle: `Puesto ${numStr}`,
      products: business?.products || []
    }
  )
}

/**
 * ===== camera apply =====
 */
function applyCamera() {
  if (!world) return
  world.position.set(cam.x, cam.y)
  world.scale.set(cam.scale)
  scheduleVisibleTilesUpdate()

  // 🔥 controlar visibilidad de puestos
  if (stallsLayer) {
    stallsLayer.children.forEach(child => {
      child.visible = cam.scale >= TEXT_ZOOM_THRESHOLD
    })
  }

  updateFixedMarkers()
}

/**
 * center camera to world
 */
function centerWorld() {

  const host = pixiHostEl.value
  if (!host) return

  const vw = host.clientWidth
  const vh = host.clientHeight

  const ww = worldWidthPx.value
  const wh = worldHeightPx.value

  // 🔥 calcular escala mínima que quepa todo el mapa
  const scaleX = vw / ww
  const scaleY = vh / wh

  const fitScale = Math.min(scaleX, scaleY)

  // 🔥 usar el menor entre fitScale y tu MIN_ZOOM
  cam.scale = Math.min(fitScale, MIN_ZOOM)

  cam.x = Math.round((vw - ww * cam.scale) / 2)
  cam.y = Math.round((vh - wh * cam.scale) / 2)

  applyCamera()
}

function resetCenter() {
  centerWorld()
}

defineExpose({ resetCenter })

/**
 * ===== pointer events =====
 */
function onPointerDown(e) {
  isDown = true
  moved = false
  const p = getPoint(e)
  startClientX = p.x
  startClientY = p.y
  startCamX = cam.x
  startCamY = cam.y
}

function onPointerMove(e) {
  if (!isDown) return
  const p = getPoint(e)
  const dx = p.x - startClientX
  const dy = p.y - startClientY
  if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true
  cam.x = startCamX + dx
  cam.y = startCamY + dy
  applyCamera()
}

function onPointerUp() {
  isDown = false
  // si fue click (no drag), cerrar popup
  if (!moved) emit('closePopup')
}

/**
 * zoom with wheel (pointer-centered)
 */
function onWheel(e) {
  if (!app || !world) return
  e.preventDefault()

  const host = pixiHostEl.value
  if (!host) return

  const rect = host.getBoundingClientRect()
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  // world coords before zoom
  const wx = (mx - cam.x) / cam.scale
  const wy = (my - cam.y) / cam.scale

  const dir = e.deltaY > 0 ? -1 : 1
  const factor = dir > 0 ? 1.12 : 0.89
  const next = clamp(cam.scale * factor, MIN_ZOOM, MAX_ZOOM)

  cam.scale = next

  // keep mouse point stable
  cam.x = mx - wx * cam.scale
  cam.y = my - wy * cam.scale

  applyCamera()
}

function getTouchDistance(t1, t2) {
  const dx = t2.clientX - t1.clientX
  const dy = t2.clientY - t1.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getTouchCenter(t1, t2) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2
  }
}

function onTouchStart(e) {
  if (e.touches.length === 2) {
    isPinching = true

    const t1 = e.touches[0]
    const t2 = e.touches[1]

    pinchStartDist = getTouchDistance(t1, t2)
    pinchStartScale = cam.scale

    const center = getTouchCenter(t1, t2)
    pinchCenterStart = center

    // Convertimos centro pantalla → mundo
    const rect = app.canvas.getBoundingClientRect()
    const mx = center.x - rect.left
    const my = center.y - rect.top

    pinchWorldPointStart = {
      x: (mx - cam.x) / cam.scale,
      y: (my - cam.y) / cam.scale
    }
  } else if (e.touches.length === 1 && !isPinching) {
    onPointerDown(e)
  }
}

function onTouchMove(e) {
  if (isPinching && e.touches.length === 2) {
    e.preventDefault()

    const t1 = e.touches[0]
    const t2 = e.touches[1]

    const newDist = getTouchDistance(t1, t2)
    const scaleFactor = newDist / pinchStartDist

    const nextScale = clamp(
      pinchStartScale * scaleFactor,
      MIN_ZOOM,
      MAX_ZOOM
    )

    cam.scale = nextScale

    // mantener centro estable
    const rect = app.canvas.getBoundingClientRect()
    const center = getTouchCenter(t1, t2)

    const mx = center.x - rect.left
    const my = center.y - rect.top

    cam.x = mx - pinchWorldPointStart.x * cam.scale
    cam.y = my - pinchWorldPointStart.y * cam.scale

    applyCamera()
  } else if (!isPinching && e.touches.length === 1) {
    onPointerMove(e)
  }
}

function onTouchEnd(e) {
  if (e.touches.length < 2) {
    isPinching = false
  }
  if (!isPinching) {
    onPointerUp()
  }
}

/**
 * ===== visible tiles (culling) =====
 * Renderiza SOLO lo visible + margen.
 */
let rafTiles = 0
function scheduleVisibleTilesUpdate() {
  if (rafTiles) return
  rafTiles = requestAnimationFrame(() => {
    rafTiles = 0
    updateVisibleTiles()
  })
}

function getViewportWorldRect() {
  const host = pixiHostEl.value
  if (!host) return { x0: 0, y0: 0, x1: 0, y1: 0 }

  const vw = host.clientWidth
  const vh = host.clientHeight

  // screen -> world
  const x0 = (0 - cam.x) / cam.scale
  const y0 = (0 - cam.y) / cam.scale
  const x1 = (vw - cam.x) / cam.scale
  const y1 = (vh - cam.y) / cam.scale

  return { x0, y0, x1, y1 }
}

function acquireTileSprite() {
  return tilePool.pop() || new PIXI.Sprite()
}

function releaseTileSprite(sp) {
  sp.texture = PIXI.Texture.EMPTY
  sp.visible = false
  sp.parent && sp.parent.removeChild(sp)
  tilePool.push(sp)
}

function updateVisibleTiles() {
  if (!tilesLayer) return

  const W = gridW.value
  const H = gridH.value
  if (!W || !H) return

  const { x0, y0, x1, y1 } = getViewportWorldRect()

  // tiles range (+buffer)
  const buffer = 2
  const tx0 = clamp(Math.floor(x0 / DISPLAY_TILE) - buffer, 0, W - 1)
  const ty0 = clamp(Math.floor(y0 / DISPLAY_TILE) - buffer, 0, H - 1)
  const tx1 = clamp(Math.ceil(x1 / DISPLAY_TILE) + buffer, 0, W)
  const ty1 = clamp(Math.ceil(y1 / DISPLAY_TILE) + buffer, 0, H)

  // mark needed
  const needed = new Set()
  for (let y = ty0; y < ty1; y++) {
    for (let x = tx0; x < tx1; x++) {
      needed.add(keyXY(x, y))
      if (visibleTiles.has(keyXY(x, y))) continue

      const id = grid[y * W + x] ?? 0
      if (id === 0) continue

      const is128 = id >= firstgid128     

      let sp = acquireTileSprite()
      sp.texture = getTileTexture(id)
      sp.tint = 0xffffff

      sp.x = x * DISPLAY_TILE
      sp.y = y * DISPLAY_TILE

      if (is128) {

        // 🔥 IMPORTANTE
        // Verificar que no sea parte "secundaria"
        const right = grid[y * W + (x + 1)] ?? -1
        const bottom = grid[(y + 1) * W + x] ?? -1

        // Si alguna de esas celdas contiene el mismo GID,
        // significa que NO es la esquina superior izquierda
        if (right === id || bottom === id) {
          releaseTileSprite(sp)
          continue
        }

        sp.width = DISPLAY_TILE * 2
        sp.height = DISPLAY_TILE * 2

      } else {
        sp.width = DISPLAY_TILE
        sp.height = DISPLAY_TILE
      }

      sp.visible = true
      sp.roundPixels = true

      tilesLayer.addChild(sp)
      visibleTiles.set(keyXY(x, y), sp)
    }
  }

  // remove not needed
  for (const [k, sp] of visibleTiles.entries()) {
    if (needed.has(k)) continue
    visibleTiles.delete(k)
    releaseTileSprite(sp)
  }
}

function updateFixedMarkers() {

  if (!fixedMarkersLayer) return

  fixedMarkersLayer.children.forEach(marker => {

    const stall = stalls.value.find(s =>
      s.name === String(props.destino)
    )

    if (!stall) return

    const cx = (stall.tileX + 0.5) * DISPLAY_TILE
    const cy = (stall.tileY + 0.5) * DISPLAY_TILE

    marker.x = cam.x + cx * cam.scale
    marker.y = cam.y + cy * cam.scale
  })

  // actualizar origen
  const origen = fixedMarkersLayer.children.find(c => c.label === 'origenMarker')
  if (origen) {
    const stall = stalls.value.find(s => s.name === String(lastOrigen.value))
    if (stall) {
      const cx = (stall.tileX + 0.5) * DISPLAY_TILE
      const cy = (stall.tileY + 0.5) * DISPLAY_TILE
      origen.x = cam.x + cx * cam.scale
      origen.y = cam.y + cy * cam.scale
    }
  }
}

/**
 * ===== stalls rendering =====
 */
function renderStalls() {

  if (!stallsLayer) return

  stallsLayer.removeChildren()

  const TILE = DISPLAY_TILE
  const OUTER_RADIUS = TILE * 0.42
  const INNER_RADIUS = TILE * 0.34

  stalls.value.forEach(s => {

    // 🔥 MISMA LÓGICA ORIGINAL DE CENTRADO
    let centerX = (s.tileX + 0.5) * TILE
    let centerY = (s.tileY + 0.5) * TILE    

    // =========================
    // 🔵 CASO NORMAL
    // =========================

    const container = new PIXI.Container()
    container.x = centerX
    container.y = centerY
    container.eventMode = 'static'
    container.cursor = 'pointer'
    container.hitArea = new PIXI.Circle(0, 0, OUTER_RADIUS)

    // 🔥 ocultar TODO el puesto si zoom bajo
    container.visible = cam.scale >= STALL_ZOOM_THRESHOLD

    // 🔵 sombra suave
    const shadow = new PIXI.Graphics()
    shadow.circle(0, 3, OUTER_RADIUS)
    shadow.fill({ color: 0x000000, alpha: 0.15 })

    // 🟢 círculo verde sólido
    const circle = new PIXI.Graphics()
    circle.circle(0, 0, OUTER_RADIUS)
    circle.fill(0x00B000)

    // 🔢 texto blanco centrado
    const txt = new PIXI.Text({
      text: String(s.name),
      style: {
        fontFamily: 'Montserrat',
        fontSize: TILE * 0.42,
        fontWeight: 'bold',
        fill: 0xffffff,
        align: 'center'
      }
    })

    txt.anchor.set(0.5)

    container.on('pointertap', async () => {

      // 🔥 guardar como origen
      lastOrigen.value = String(s.name)

      emitSelectForPuesto(s.name)
      await onClickStallForRoute(s.name)
    })

    // ⚠️ ORDEN IMPORTANTE
    container.addChild(shadow, circle, txt)

    stallsLayer.addChild(container)
  })
}
/**
 * ===== highlight seleccionado =====
 */
function renderHighlight() {
  if (!highlightLayer) return
  highlightLayer.clear()

  const sub = props.selected?.subtitle || ''
  const m = sub.match(/Puesto\s+(\d+)/i)
  if (!m) return
  const n = m[1]
  const s = stalls.value.find(x => x.name === String(n))
  if (!s) return

  const x = s.tileX * DISPLAY_TILE
  const y = s.tileY * DISPLAY_TILE

  highlightLayer.roundRect(x, y, DISPLAY_TILE, DISPLAY_TILE, 6)
  highlightLayer.stroke({ color: 0xf97316, width: 2, alpha: 1 })
}

/**
 * ===== route drawing =====
 */
function drawRoute() {
  if (!routeLayer) return
  routeLayer.clear()

  if (!route.value.length) return

  // sombra
  routeLayer.moveTo((route.value[0].x + 0.5) * DISPLAY_TILE, (route.value[0].y + 0.5) * DISPLAY_TILE)
  for (let i = 1; i < route.value.length; i++) {
    routeLayer.lineTo((route.value[i].x + 0.5) * DISPLAY_TILE, (route.value[i].y + 0.5) * DISPLAY_TILE)
  }
  routeLayer.stroke({ color: 0x000000, width: 10, alpha: 0.18, cap: 'round', join: 'round' })

  // principal (rojo)
  routeLayer.clear()
  // dibujamos 2 veces: sombra y principal (para mantener el look)
  // sombra
  routeLayer.moveTo((route.value[0].x + 0.5) * DISPLAY_TILE, (route.value[0].y + 0.5) * DISPLAY_TILE)
  for (let i = 1; i < route.value.length; i++) {
    routeLayer.lineTo((route.value[i].x + 0.5) * DISPLAY_TILE, (route.value[i].y + 0.5) * DISPLAY_TILE)
  }
  routeLayer.stroke({ color: 0x000000, width: 10, alpha: 0.18, cap: 'round', join: 'round' })

  // principal
  routeLayer.moveTo((route.value[0].x + 0.5) * DISPLAY_TILE, (route.value[0].y + 0.5) * DISPLAY_TILE)
  for (let i = 1; i < route.value.length; i++) {
    routeLayer.lineTo((route.value[i].x + 0.5) * DISPLAY_TILE, (route.value[i].y + 0.5) * DISPLAY_TILE)
  }
  routeLayer.stroke({ color: 0xef4444, width: 8, alpha: 1, cap: 'round', join: 'round' })
}

function startWalking() {

  if (!route.value.length || !character) return

  // 🔥 quitar listener anterior si existía
  app.ticker.remove(updateCharacter)

  isWalking = true
  walkDirection = 1
  walkIndex = 0

  const first = route.value[0]

  character.x = (first.x + 0.5) * DISPLAY_TILE
  character.y = (first.y + 0.5) * DISPLAY_TILE
  character.visible = true

  app.ticker.add(updateCharacter)
  character.play()
}

function stopWalking() {
  isWalking = false
  if (app) app.ticker.remove(updateCharacter)
}

function updateCharacter() {

  if (!isWalking || !route.value.length) return

  const target = route.value[walkIndex]
  if (!target) return

  const targetX = (target.x + 0.5) * DISPLAY_TILE
  const targetY = (target.y + 0.5) * DISPLAY_TILE

  const dx = targetX - character.x
  const dy = targetY - character.y
  const dist = Math.hypot(dx, dy)

  // ===== SI YA LLEGAMOS AL TILE =====
  if (dist <= walkSpeed) {

    // SNAP EXACTO
    character.x = targetX
    character.y = targetY

    walkIndex += walkDirection

    // ===== EXTREMO DESTINO =====
    if (walkIndex >= route.value.length) {
      walkDirection = -1
      walkIndex = route.value.length - 2
      character.scale.x = -Math.abs(character.scale.x)
    }

    // ===== EXTREMO ORIGEN =====
    if (walkIndex < 0) {
      walkDirection = 1
      walkIndex = 1
      character.scale.x = Math.abs(character.scale.x)
    }

    return
  }

  // ===== MOVIMIENTO CONSTANTE REAL =====
  const vx = dx / dist
  const vy = dy / dist

  // Orientación horizontal
  if (vx > 0) {
    character.scale.x = Math.abs(character.scale.x)
  } else if (vx < 0) {
    character.scale.x = -Math.abs(character.scale.x)
  }

  character.x += vx * walkSpeed
  character.y += vy * walkSpeed
}

/**
 * Click en puesto (solo ruta) => hacia puesto 10
 */
async function onClickStallForRoute(stallName) {

  const destinoActual = String(props.destino)

  if (!destinoActual) {
    console.log('No hay destino seleccionado')
    route.value = []
    drawRoute()
    return
  }

  const from = stalls.value.find(s => s.name === String(stallName))
  const to = stalls.value.find(s => s.name === destinoActual)

  if (!from) {
    console.log('Origen no encontrado:', stallName)
    return
  }

  if (!to) {
    console.log('Destino no encontrado:', destinoActual)
    return
  }

  const start = nearestWalkable(from.tileX, from.tileY, 12)
  const goal = nearestWalkable(to.tileX, to.tileY, 12)

  if (!start || !goal) {
    console.log('No se encontró camino válido')
    route.value = []
    drawRoute()
    return
  }

  const path = bfs(start, goal)

  route.value = path.length ? path : []

  await nextTick()
  drawRoute()
  stopWalking()
  startWalking()
}

/**
 * ===== load map data =====
 */
function loadMapData() {

  tileSize = planoJson.tilewidth
  tileLayer = planoJson.layers.find(l => l.type === 'tilelayer')
  puestosLayer = planoJson.layers.find(l => l.type === 'objectgroup')

  const ts64 = planoJson.tilesets.find(ts => ts.source.includes('tile_base_64'))
  const ts128 = planoJson.tilesets.find(ts => ts.source.includes('tileset_128'))

  firstgid64 = ts64.firstgid
  firstgid128 = ts128.firstgid

  if (!tileLayer?.chunks) {
    toast.value = 'No encuentro chunks en el tilelayer 😕'
    return false
  }

  // ===============================
  // CALCULAR BOUNDS REALES
  // ===============================
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  tileLayer.chunks.forEach(ch => {
    minX = Math.min(minX, ch.x)
    minY = Math.min(minY, ch.y)
    maxX = Math.max(maxX, ch.x + ch.width)
    maxY = Math.max(maxY, ch.y + ch.height)
  })

  minTileX = minX
  minTileY = minY
  maxTileX = maxX
  maxTileY = maxY

  const W = maxTileX - minTileX
  const H = maxTileY - minTileY

  gridW.value = W
  gridH.value = H

  // ===============================
  // INICIALIZAR GRID
  // ===============================
  grid = new Array(W * H).fill(0)

  // ===============================
  // VOLCAR CHUNKS AL GRID
  // ===============================
  tileLayer.chunks.forEach(ch => {

    for (let i = 0; i < ch.data.length; i++) {

      const tileId = ch.data[i]

      const localX = i % ch.width
      const localY = Math.floor(i / ch.width)

      const tx = (ch.x + localX) - minTileX
      const ty = (ch.y + localY) - minTileY

      if (tx >= 0 && ty >= 0 && tx < W && ty < H) {
        grid[ty * W + tx] = tileId
      }
    }
  })

  // ===============================
  // PROCESAR STALLS (PUESTOS)
  // ===============================
  const arr = []

  if (puestosLayer?.objects?.length) {
  puestosLayer.objects.forEach(obj => {

    const tileXAbs = Math.floor(obj.x / tileSize)
    const tileYAbs = Math.round(obj.y / tileSize)

    const tileX = tileXAbs - minTileX
    const tileY = tileYAbs - minTileY

    arr.push({
      name: String(obj.name),
      tileX,
      tileY,
      obj
    })
  })
}

  stalls.value = arr

  return true
}

/**
 * ===== init pixi =====
 */
async function initPixi() {
  const host = pixiHostEl.value
  if (!host) return

  app = new PIXI.Application()

  await app.init({
    resizeTo: host,
    antialias: true,
    backgroundAlpha: 0,
    resolution: Math.min(window.devicePixelRatio || 1, 2)
  })

  host.appendChild(app.canvas)

  // ===== WORLD =====
  world = new PIXI.Container()
  app.stage.addChild(world)

  // ===== LAYERS =====
  tilesLayer = new PIXI.Container()
  routeLayer = new PIXI.Graphics()
  highlightLayer = new PIXI.Graphics()
  stallsLayer = new PIXI.Container()

  // ⚠️ ESTO FALTABA
  world.addChild(tilesLayer)
  world.addChild(routeLayer)
  world.addChild(highlightLayer)
  world.addChild(stallsLayer)

  // 🔥 capa fija (NO escala)
  fixedMarkersLayer = new PIXI.Container()
  app.stage.addChild(fixedMarkersLayer)

  // ===== SPRITE =====
  baseTex64 = await PIXI.Assets.load(spriteUrl)
  baseTex128 = await PIXI.Assets.load(new URL('../assets/tileset_128.png', import.meta.url).href)

  // ===== EVENTS =====
  app.canvas.addEventListener('mousedown', onPointerDown, { passive: true })
  app.canvas.addEventListener('mousemove', onPointerMove, { passive: true })
  app.canvas.addEventListener('mouseup', onPointerUp, { passive: true })
  app.canvas.addEventListener('mouseleave', onPointerUp, { passive: true })

  app.canvas.addEventListener('touchstart', onTouchStart, { passive: false })
  app.canvas.addEventListener('touchmove', onTouchMove, { passive: false })
  app.canvas.addEventListener('touchend', onTouchEnd, { passive: false })

  app.canvas.addEventListener('wheel', onWheel, { passive: false })  

  // ===== CAMERA =====
  centerWorld()

  // ===== DRAW INITIAL =====
  updateVisibleTiles()
  renderStalls()
  renderHighlight()
  drawRoute()
  renderDestinoMarker()

  characterTex = await PIXI.Assets.load(
    new URL('../assets/white.png', import.meta.url).href
  )

  characterTex = await PIXI.Assets.load(
  new URL('../assets/white.png', import.meta.url).href
)

const frameSize = 24
const walkRow = 1 // 👈 fila 2 (empieza en 0)

const frames = []

for (let col = 0; col < 6; col++) {

  const rect = new PIXI.Rectangle(
    col * frameSize,
    walkRow * frameSize,
    frameSize,
    frameSize
  )

  const frameTex = new PIXI.Texture({
      source: characterTex.source,
      frame: rect
    })

    frames.push(frameTex)
  }

  character = new PIXI.AnimatedSprite(frames)

  character.anchor.set(0.5)
  character.animationSpeed = 0.18
  character.loop = true
  character.width = DISPLAY_TILE * 0.9
  character.height = DISPLAY_TILE * 0.9
  character.visible = false

  world.addChild(character)
  character.anchor.set(0.5)
  character.width = DISPLAY_TILE * 0.8
  character.height = DISPLAY_TILE * 0.8

  world.addChild(character)
  character.visible = false
}

function renderDestinoMarker() {

  if (!props.destino) return
  if (!fixedMarkersLayer) return

  // borrar marker anterior si existe
  const old = fixedMarkersLayer.children.find(c => c.label === 'destinoMarker')
  if (old) {
    old.destroy({ children: true })
  }

  const stall = stalls.value.find(s => s.name === String(props.destino))
  if (!stall) return

  const cx = (stall.tileX + 0.5) * DISPLAY_TILE
  const cy = (stall.tileY + 0.5) * DISPLAY_TILE

  const marker = new PIXI.Container()
  marker.label  = 'destinoMarker'
  // 🔥 convertir world → screen
  marker.x = cam.x + cx * cam.scale
  marker.y = cam.y + cy * cam.scale

  // sombra
  const shadow = new PIXI.Graphics()
  shadow.circle(0, -10, 18)
  shadow.fill({ color: 0x000000, alpha: 0.2 })

  // círculo principal
  const circle = new PIXI.Graphics()
  circle.circle(0, -12, 18)
  circle.fill({ color: 0xef4444 })
  circle.stroke({ color: 0xffffff, width: 3 })

  // ícono
  const txt = new PIXI.Text('📍', {
    fontSize: 18
  })
  txt.anchor.set(0.5)
  txt.y = -12

  marker.addChild(shadow, circle, txt)

  fixedMarkersLayer.addChild(marker)
}

function renderOrigenMarker() {

  if (!props.destino) return
  if (!fixedMarkersLayer) return
  if (!lastOrigen.value) return

  // borrar anterior
  const old = fixedMarkersLayer.children.find(c => c.label === 'origenMarker')
  if (old) old.destroy({ children: true })

  const stall = stalls.value.find(s => s.name === String(lastOrigen.value))
  if (!stall) return

  const cx = (stall.tileX + 0.5) * DISPLAY_TILE
  const cy = (stall.tileY + 0.5) * DISPLAY_TILE

  const marker = new PIXI.Container()
  marker.label = 'origenMarker'

  // convertir world → screen
  marker.x = cam.x + cx * cam.scale
  marker.y = cam.y + cy * cam.scale

  // sombra
  const shadow = new PIXI.Graphics()
  shadow.circle(0, -10, 18)
  shadow.fill({ color: 0x000000, alpha: 0.2 })

  // 🔵 círculo azul
  const circle = new PIXI.Graphics()
  circle.circle(0, -12, 18)
  circle.fill({ color: 0x3b82f6 }) // azul
  circle.stroke({ color: 0xffffff, width: 3 })

  const txt = new PIXI.Text('📍', { fontSize: 18 })
  txt.anchor.set(0.5)
  txt.y = -12

  marker.addChild(shadow, circle, txt)

  fixedMarkersLayer.addChild(marker)
}

/**
 * ===== destroy pixi =====
 */
function destroyPixi() {
  if (rafTiles) cancelAnimationFrame(rafTiles)
  rafTiles = 0

  if (app?.canvas) {
    app.canvas.removeEventListener('mousedown', onPointerDown)
    app.canvas.removeEventListener('mousemove', onPointerMove)
    app.canvas.removeEventListener('mouseup', onPointerUp)
    app.canvas.removeEventListener('mouseleave', onPointerUp)

    app.canvas.removeEventListener('touchstart', onPointerDown)
    app.canvas.removeEventListener('touchend', onPointerUp)

    app.canvas.removeEventListener('wheel', onWheel)
  }

  // liberar sprites visibles
  for (const sp of visibleTiles.values()) releaseTileSprite(sp)
  visibleTiles.clear()
  tilePool.length = 0
  tileTextures.clear()

  app?.destroy({ removeView: true, children: true, texture: true, textureSource: true })
  app = null
  world = null
  tilesLayer = null
  stallsLayer = null
  markersLayer = null
  routeLayer = null
  highlightLayer = null
  baseTex = null
}

/**
 * ===== lifecycle =====
 */
onMounted(async () => {
  const ok = loadMapData()
  if (!ok) return
  await initPixi()
})

onBeforeUnmount(() => {
  destroyPixi()
})

/**
 * re-render stalls/markers/highlight si cambian
 */
watch(() => stalls.value.length, () => {
  renderStalls()
  scheduleVisibleTilesUpdate()
  //console.log('Nuevo destino:', val)
})

watch(() => props.selected, () => {
  renderHighlight()
}, { deep: true })

watch(() => props.destino, async (newDestino) => {

  renderDestinoMarker()
  renderOrigenMarker()

  if (!newDestino) return

  if (!lastOrigen.value) {
    lastOrigen.value = String(newDestino)
    renderOrigenMarker()
    return
  }

  await onClickStallForRoute(lastOrigen.value)

})
</script>

<style scoped>
/* el host ocupa todo */
canvas {
  touch-action: none;
}
</style>