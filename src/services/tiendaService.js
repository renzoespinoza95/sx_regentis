import axios from 'axios'
import { API_BASE, NEG_ID } from '../config/appConfig.js'

export async function fetchTienda() {
  const res = await axios.get(`${API_BASE}/ArWL/tienda/${NEG_ID}`)
  return res.data.data
} 
