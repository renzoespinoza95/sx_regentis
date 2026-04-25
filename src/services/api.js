import axios from 'axios'

/* ===============================
   BASE URL
================================= */

const PUBLIC_URL_BASE = import.meta.env.VITE_PUBLIC_URL_BASE
const PUBLIC_SECRET_KEY = import.meta.env.VITE_PUBLIC_BARSI_KEY

console.log('PUBLIC_URL_BASE =>', PUBLIC_URL_BASE)

export const api = axios.create({
  baseURL: PUBLIC_URL_BASE,
  timeout: 8000
})

/* ===============================
   HELPERS BASE64
================================= */

function bytesToB64(bytes) {
  let binary = ''
  const len = bytes.length
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function b64ToBytes(b64) {
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/* ===============================
   GET KEY
================================= */

async function getKey() {
  const rawBytes = b64ToBytes(PUBLIC_SECRET_KEY)

  return crypto.subtle.importKey(
    "raw",
    rawBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  )
}


/* ===============================
   ENCRIPTAR
================================= */

export async function enc_barsi(texto) {
  const key = await getKey()

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encoded = new TextEncoder().encode(texto)

  const ctBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  )

  const ct = new Uint8Array(ctBuffer)

  const out = new Uint8Array(iv.length + ct.length)
  out.set(iv, 0)
  out.set(ct, iv.length)

  return bytesToB64(out)
}

/* ===============================
   DESENCRIPTAR
================================= */

export async function des_barsi(tokenB64) {
  const key = await getKey()

  const raw = b64ToBytes(tokenB64)

  const iv = raw.slice(0, 12)
  const ct = raw.slice(12)

  const ptBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ct
  )

  return new TextDecoder().decode(new Uint8Array(ptBuffer))
}

/*
COMO USARLO
import { enc_barsi, des_barsi } from '@/services/api.js'

const cifrado = await enc_barsi("hola mundo")
const texto = await des_barsi(cifrado)
*/
