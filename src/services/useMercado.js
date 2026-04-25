import { ref } from 'vue'

const STORAGE_KEY = 'regentis_principal_cache'

const mercadoState = ref(null)

function loadCache(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch(e){
    return null
  }
}

export function useMercado(){

  if (!mercadoState.value) {
    const cache = loadCache()
    mercadoState.value = cache?.mercado || null
  }

  function setMercado(data){
    mercadoState.value = data?.mercado || null
  }

  return {
    mercado: mercadoState,
    setMercado
  }
}