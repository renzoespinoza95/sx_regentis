import axios from 'axios'

import {
  API_BASE,
  NEG_ID
}
from '../config/appConfig.js'

import {
  firma
}
from './security.js'

export async function fetchTienda() {

  const seguridad =
    firma()

  const res =
    await axios.post(

      `${API_BASE}/ArWL/tienda`,

      {

        neg_id:
          NEG_ID,

        xin:
          seguridad.xin,

        yuan:
          seguridad.yuan

      }

    )

  return res.data.data

}