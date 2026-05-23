import { reactive, computed } from 'vue'

const STORAGE_KEY = 'usuario'

/* =========================
   ESTADO REACTIVO GLOBAL
========================= */

const usuarioState = reactive({
  usuario: loadUsuario()
})

/* =========================
   FUNCIONES INTERNAS
========================= */

function loadUsuario() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error('Error parseando usuario', e)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function saveUsuario(usuario) {
  if (!usuario || typeof usuario !== 'object') {
    console.warn('Usuario inválido')
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
  usuarioState.usuario = usuario
}
/* =========================
   API PÚBLICA
========================= */

export function useUsuario() {

  const usuario = computed(() => usuarioState.usuario)

  const isLogged = computed(() => !!usuarioState.usuario)

  /* =========================
     SET COMPLETO (LOGIN)
  ========================= */

  function setUsuario(data) {
    saveUsuario(data)
  }

  /* =========================
     🔥 NUEVO → GUARDAR RESPONSE COMPLETO
  ========================= */

  function setLoginData(response) {
    if (!response || response.status !== 'ok') return

    const fullData = {
      ...response,                 // 🔥 status, data, screens
      user: response.data,        // alias útil
      screens: response.screens || []
    }

    saveUsuario(fullData)
  }

  /* =========================
     GETTERS
  ========================= */

  /* =========================================
   🏪 TIENDA ACTUAL
========================================= */

function setNegIdTienda(neg_id) {

    localStorage.setItem(

        'neg_id_tienda',

        String(neg_id || 0)

    )
    console.log("neg_id_tienda → " + neg_id);

}

function getNegIdTienda() {

    return Number(

        localStorage.getItem(
            'neg_id_tienda'
        )

        ||

        0

    )

}

  function getUsuId() {
    return usuarioState.usuario?.user?.usu_id ?? null
  }

  function getNegId() {
    return usuarioState.usuario?.user?.neg_id ?? null
  }

  function getScreens() {
    return usuarioState.usuario?.screens ?? []
  }

  function getUser() {
    return usuarioState.usuario?.user ?? null
  }

  /* =========================
   GET TIPO USUARIO
========================= */

function getTipoxusuId() {

  return Number(

    usuarioState.usuario?.user?.tipoxusu_id

    ||

    0

  )

}

  /* =========================
     SET DINÁMICO
  ========================= */

  function setCampo(campo, valor) {
    if (!usuarioState.usuario) return

    const nuevo = {
      ...usuarioState.usuario,
      user: {
        ...usuarioState.usuario.user,
        [campo]: valor
      }
    }

    saveUsuario(nuevo)
  }

  /* =========================
     LIMPIAR
  ========================= */

  function clearUsuario() {
    localStorage.removeItem(STORAGE_KEY)
    usuarioState.usuario = null
  }

  /* =========================
     SYNC ENTRE TABS
  ========================= */

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      usuarioState.usuario = loadUsuario()
    }
  })

  return {
    usuario,
    isLogged,

    setUsuario,
    setLoginData, // 🔥 IMPORTANTE

    clearUsuario,

    getUsuId,
    getNegId,
    getScreens,
    getUser,
    getTipoxusuId,
    setNegIdTienda,
    getNegIdTienda,
    setCampo
  }
}