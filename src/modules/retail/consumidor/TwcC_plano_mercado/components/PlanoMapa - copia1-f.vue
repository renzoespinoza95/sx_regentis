<template>
  <div class="px-4 pb-24">
    <div class="mt-3 bg-white rounded-3xl shadow-md overflow-hidden">
      <div
        ref="viewportEl"
        class="relative w-full h-[500px] bg-slate-50 select-none"
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
import puestoGrandeUrl from '../assets/puesto_grande.png'

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

let tileSize = 64
let tileLayer = null
let puestosLayer = null

let puestoGrandeTex = null

// bounds en tiles (por chunks)
let minTileX = 0
let minTileY = 0
let maxTileX = 0
let maxTileY = 0

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

  // Si es 0 (vacío), devolver blanco puro
  if (tileId === 0) {
    return PIXI.Texture.WHITE
  }

  if (tileTextures.has(tileId)) {
    return tileTextures.get(tileId)
  }

  const index = tileId - 1

  const col = index % SPRITE_COLS
  const row = Math.floor(index / SPRITE_COLS)

  const rect = new PIXI.Rectangle(
    col * tileSize,
    row * tileSize,
    tileSize,
    tileSize
  )

  const texture = new PIXI.Texture({
    source: baseTex,
    frame: rect
  })

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

  cam.scale = 1
  cam.x = Math.round((vw - ww) / 2)
  cam.y = Math.round((vh - wh) / 2)
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

      // 🔥 NO dibujar tiles que pertenecen a un puesto grande
      const perteneceABig = stalls.value.some(s =>
        s.isBig &&
        x >= s.tileX &&
        x < s.tileX + s.widthTiles &&
        y >= s.tileY &&
        y < s.tileY + s.heightTiles
      )

      if (perteneceABig) continue

      let sp = acquireTileSprite()
      sp.texture = getTileTexture(id)
      sp.tint = 0xffffff

      sp.x = x * DISPLAY_TILE
      sp.y = y * DISPLAY_TILE
      sp.width = DISPLAY_TILE
      sp.height = DISPLAY_TILE
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
    // 🔴 CASO PUESTO GRANDE
    // =========================
    if (s.isBig) {

      // 🔥 SOLO AQUÍ corregimos centro real 2x2
      centerX = (s.tileX + 1) * TILE
      centerY = (s.tileY + 1) * TILE

      const container = new PIXI.Container()
      container.x = centerX
      container.y = centerY
      container.eventMode = 'static'
      container.cursor = 'pointer'

      const sprite = new PIXI.Sprite(puestoGrandeTex)
      sprite.anchor.set(0.5)
      sprite.width = TILE * 2
      sprite.height = TILE * 2

      // 🔥 Si no quieres número en big, elimina este bloque
      const txt = new PIXI.Text(String(s.name), {
        fontFamily: 'Montserrat',
        fontSize: TILE * 0.7,
        fontWeight: 'bold',
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3,
        align: 'center'
      })

      txt.anchor.set(0.5)

      container.on('pointertap', async () => {
        emitSelectForPuesto(s.name)
        await onClickStallForRoute(s.name)
      })

      container.addChild(sprite, txt)
      stallsLayer.addChild(container)

      return
    }

    // =========================
    // 🔵 CASO NORMAL (NO SE TOCA)
    // =========================

    const container = new PIXI.Container()
    container.x = centerX
    container.y = centerY
    container.eventMode = 'static'
    container.cursor = 'pointer'
    container.hitArea = new PIXI.Circle(0, 0, OUTER_RADIUS)
/*
    const shadow = new PIXI.Graphics()
    shadow.ellipse(0, 3, OUTER_RADIUS, OUTER_RADIUS)
    shadow.fill({ color: 0x000000, alpha: 0.18 })

    const outer = new PIXI.Graphics()
    outer.ellipse(0, 0, OUTER_RADIUS, OUTER_RADIUS)
    outer.fill(0x4f6fdc)

    const inner = new PIXI.Graphics()
    inner.ellipse(0, 0, INNER_RADIUS, INNER_RADIUS)
    inner.fill(0xffffff)
    inner.stroke({
      color: 0x3555c5,
      width: 2
    })
*/
    const txt = new PIXI.Text(String(s.name), {
      fontFamily: 'Montserrat',
      fontSize: TILE * 0.34,
      fontWeight: 'bold',
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 3,
      align: 'center'
    })

    txt.anchor.set(0.5)

    container.on('pointertap', async () => {
      emitSelectForPuesto(s.name)
      await onClickStallForRoute(s.name)
    })

    container.addChild(txt)
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
}

/**
 * ===== load map data =====
 */
function loadMapData() {

  tileSize = planoJson.tilewidth
  tileLayer = planoJson.layers.find(l => l.type === 'tilelayer')
  puestosLayer = planoJson.layers.find(l => l.type === 'objectgroup')

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
      isBig: obj.width === tileSize * 2 && obj.height === tileSize * 2,
      widthTiles: obj.width / tileSize,
      heightTiles: obj.height / tileSize,
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

  // ===== SPRITE =====
  baseTex = await PIXI.Assets.load(spriteUrl)

  // ===== EVENTS =====
  app.canvas.addEventListener('mousedown', onPointerDown, { passive: true })
  app.canvas.addEventListener('mousemove', onPointerMove, { passive: true })
  app.canvas.addEventListener('mouseup', onPointerUp, { passive: true })
  app.canvas.addEventListener('mouseleave', onPointerUp, { passive: true })

  app.canvas.addEventListener('touchstart', onPointerDown, { passive: true })
  app.canvas.addEventListener('touchmove', (e) => { onPointerMove(e) }, { passive: false })
  app.canvas.addEventListener('touchend', onPointerUp, { passive: true })

  app.canvas.addEventListener('wheel', onWheel, { passive: false })

  puestoGrandeTex = await PIXI.Assets.load(puestoGrandeUrl)

  // ===== CAMERA =====
  centerWorld()

  // ===== DRAW INITIAL =====
  updateVisibleTiles()
  renderStalls()
  renderHighlight()
  drawRoute()
  renderDestinoMarker()
}

function renderDestinoMarker() {

  if (!props.destino) return
  if (!stallsLayer) return

  // borrar marker anterior si existe
  const old = stallsLayer.children.find(c => c.label === 'destinoMarker')
  if (old) {
    old.destroy({ children: true })
  }

  const stall = stalls.value.find(s => s.name === String(props.destino))
  if (!stall) return

  const cx = (stall.tileX + 0.5) * DISPLAY_TILE
  const cy = (stall.tileY + 0.5) * DISPLAY_TILE

  const marker = new PIXI.Container()
  marker.label  = 'destinoMarker'
  marker.x = cx
  marker.y = cy

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

  stallsLayer.addChild(marker)
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

watch(() => props.destino, () => {
  renderDestinoMarker()
})
</script>

<style scoped>
/* el host ocupa todo */
</style>