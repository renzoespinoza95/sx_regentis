export const USE_VUE_QUERY = import.meta.env.VITE_PUBLIC_VUE_QUERY == 1
export const STALE_TIME = Number(import.meta.env.VITE_PUBLIC_VQ_STALETIME || 2) * 60 * 1000
export const API_BASE = import.meta.env.VITE_PUBLIC_URL_BASE
export const NEG_ID = import.meta.env.VITE_PUBLIC_NEG_ID 
