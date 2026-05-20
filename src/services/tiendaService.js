import axios from 'axios'

import {
  API_BASE
}
from '../config/appConfig.js'

import {
  firma
}
from './security.js'

import {
  useUsuario
}
from './usuarioService.js'

const {

  getNegIdTienda

} = useUsuario()

export async function fetchTienda() {

  /* =========================================
     🔐 SECURITY
  ========================================= */

  const seguridad =
    firma()

  /* =========================================
     🏪 NEG_ID DINÁMICO
  ========================================= */

  const neg_id =
    getNegIdTienda()

  console.log(
    '🏪 fetchTienda neg_id =>',
    neg_id
  )

  /* =========================================
     🚀 REQUEST
  ========================================= */

  const res =
    await axios.post(

      `${API_BASE}/ArWL/tienda`,

      {

        neg_id,

        xin:
          seguridad.xin,

        yuan:
          seguridad.yuan

      }

    )

  console.log(
    '📦 tienda response =>',
    res.data
  )

  return res.data.data

}