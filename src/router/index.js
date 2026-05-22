import { createRouter, createWebHistory } from 'vue-router'

// COMUNES
import RegPrincipalApp from '../modules/reg_principal/RegPrincipalApp.vue'
import Mod_registro from '../modules/mod_registro/Mod_registro.vue'
import Mod_dash from '../modules/mod_dash/Mod_dash.vue'

import Mod_pedidos from '../modules/mod_pedidos/Mod_pedidos.vue'
import Mod_plano_mercado from '../modules/mod_plano_mercado/Mod_plano_mercado.vue'

import Mod_nav from '../modules/mod_nav/Mod_nav.vue'
import Mod_404 from '../modules/mod_404/Mod_404.vue'

/* CONSUMIDOR */
import PCJj_mapa_ubicacion from '../modules/retail/consumidor/PCJj_mapa_ubicacion/PCJj_mapa_ubicacion.vue'
import QZMq_detalle_prod from '../modules/retail/consumidor/QZMq_detalle_prod/QZMq_detalle_prod.vue'
import URl4_usuario_carrito from '../modules/retail/consumidor/URl4_usuario_carrito/URl4_usuario_carrito.vue'
import MmZU_productos_categoria from '../modules/retail/consumidor/MmZU_productos_categoria/MmZU_productos_categoria.vue'
import BTqw_mi_cuenta from '../modules/retail/consumidor/BTqw_mi_cuenta/BTqw_mi_cuenta.vue'
import Wvn1_mis_mensajes from '../modules/retail/consumidor/Wvn1_mis_mensajes/Wvn1_mis_mensajes.vue'
import CyHh_leer_mensaje from '../modules/retail/consumidor/CyHh_leer_mensaje/CyHh_leer_mensaje.vue'
import Adfj_mis_favoritos from '../modules/retail/consumidor/Adfj_mis_favoritos/Adfj_mis_favoritos.vue'
import B2Tk_detalle_pedido from '../modules/retail/consumidor/B2Tk_detalle_pedido/B2Tk_detalle_pedido.vue'
import CV2K_negocio from '../modules/retail/consumidor/CV2K_negocio/CV2K_negocio.vue'
import TyB3CrearTienda from '../modules/retail/consumidor/TyB3_crear_tienda/TyB3_crear_tienda.vue'
import Gx7p_atencion_mesa from '../modules/retail/consumidor/Gx7p_atencion_mesa/Gx7p_atencion_mesa.vue'

/* NEGOCIO_ADMIN */
import ZpB1_ag_producto from '../modules/retail/negocio_admin/ZpB1_ag_producto/ZpB1_ag_producto.vue'
import RUkp_ed_producto from '../modules/retail/negocio_admin/RUkp_ed_producto/RUkp_ed_producto.vue'
import K9Rk_lista_trabajadores from '../modules/retail/negocio_admin/K9Rk_lista_trabajadores/K9Rk_lista_trabajadores.vue'
import CjiH_ag_trabajador from '../modules/retail/negocio_admin/CjiH_ag_trabajador/CjiH_ag_trabajador.vue'
import NrAz_lista_pedidos from '../modules/retail/negocio_admin/NrAz_lista_pedidos/NrAz_lista_pedidos.vue'
import PM1N_ag_pedido from '../modules/retail/negocio_admin/PM1N_ag_pedido/PM1N_ag_pedido.vue'
import UbpF_ed_pedido from '../modules/retail/negocio_admin/UbpF_ed_pedido/UbpF_ed_pedido.vue'
import OAtb_lista_clientes from '../modules/retail/negocio_admin/OAtb_lista_clientes/OAtb_lista_clientes.vue'
import Lfdx_detalle_pedido from '../modules/retail/negocio_admin/Lfdx_detalle_pedido/Lfdx_detalle_pedido.vue'
import MpIH_lista_productos from '../modules/retail/negocio_admin/MpIH_lista_productos/MpIH_lista_productos.vue'
import Khjs_despachar from '../modules/retail/negocio_admin/Khjs_despachar/Khjs_despachar.vue'



/* NEGOCIO_STAFF */
import Vlsz_venta_directa from '../modules/retail/negocio_staff/Vlsz_venta_directa/Vlsz_venta_directa.vue'
import WdtJ_atencion_mesa from '../modules/retail/negocio_staff/WdtJ_atencion_mesa/WdtJ_atencion_mesa.vue'
import TdNV_lista_productos from '../modules/retail/negocio_staff/TdNV_lista_productos/TdNV_lista_productos.vue'
import U8EX_lista_pedidos from '../modules/retail/negocio_staff/U8EX_lista_pedidos/U8EX_lista_pedidos.vue'
import RPsB_lista_clientes from '../modules/retail/negocio_staff/RPsB_lista_clientes/RPsB_lista_clientes.vue'



const mercadoId = import.meta.env.VITE_PUBLIC_MERCADO_ID
const negId = import.meta.env.VITE_PUBLIC_NEG_ID

const routes = [
  {
    path: '/',
    redirect: () => {
      if (mercadoId === '0') {
        return `/CV2K_negocio/${negId}`
      }
      return '/principal'
    }
  },
  // =========================================
  // COMUNUES
  // =========================================
  { path: '/principal', component: RegPrincipalApp,  meta: { hideNav: false }  },  
  { path: '/mod_registro/:usu_id', component: Mod_registro, meta: { hideNav: true } },
  { path: '/mod_nav', component: Mod_nav, meta: { hideNav: true } },  
  { path: '/dash',   component: Mod_dash },
  { path: '/MpIH_lista_productos', component: MpIH_lista_productos, meta: { hideNav: false } },      
  { path: '/PCJj_mapa_ubicacion', component: PCJj_mapa_ubicacion, meta: { hideNav: false } },
  
  
  // =========================================
  // RETAIL - CONSUMIDOR
  // =========================================
  { path: '/QZMq_detalle_prod/:product_id', component: QZMq_detalle_prod, meta: { hideNav: false } },  
  { path: '/URl4_usuario_carrito', component: URl4_usuario_carrito, meta: { hideNav: false } },
  { path: '/MmZU_productos_categoria/:category_id', component: MmZU_productos_categoria, meta: { hideNav: false } },  
  { path: '/CV2K_negocio/:neg_id', component: CV2K_negocio, meta: { hideNav: false } },
  { path: '/BTqw_mi_cuenta', component: BTqw_mi_cuenta, meta: { hideNav: false } },
  { path: '/Wvn1_mis_mensajes', component: Wvn1_mis_mensajes, meta: { hideNav: false } },
  { path: '/CyHh_leer_mensaje/:id', component: CyHh_leer_mensaje, meta: { hideNav: false } },
  { path: '/Adfj_mis_favoritos', component: Adfj_mis_favoritos, meta: { hideNav: false } },
  { path: '/ZpB1_ag_producto', component: ZpB1_ag_producto, meta: { hideNav: false } },
  { path: '/RUkp_ed_producto/:id', component: RUkp_ed_producto, meta: { hideNav: false } },
  { path: '/K9Rk_lista_trabajadores', component: K9Rk_lista_trabajadores, meta: { hideNav: false } },
  { path: '/CjiH_ag_trabajador', component: CjiH_ag_trabajador, meta: { hideNav: false } },  
  { path: '/NrAz_lista_pedidos', component: NrAz_lista_pedidos, meta: { hideNav: false } },
  { path: '/PM1N_ag_pedido', component: PM1N_ag_pedido, meta: { hideNav: false } },
  { path: '/UbpF_ed_pedido/:id', component: UbpF_ed_pedido, meta: { hideNav: false } },
  { path: '/OAtb_lista_clientes', component: OAtb_lista_clientes, meta: { hideNav: false } },  
  { path: '/TyB3_crear_tienda', component: TyB3CrearTienda, meta: { hideNav: false } },
  { path: '/B2Tk_detalle_pedido/:id', component: B2Tk_detalle_pedido, meta: { hideNav: false } },
  { path: '/Gx7p_atencion_mesa', component: Gx7p_atencion_mesa, meta: { hideNav: false } },  
  // =========================================
  // RETAIL - ADMIN
  // =========================================  
  { path: '/Lfdx_detalle_pedido/:id', component: Lfdx_detalle_pedido, meta: { hideNav: false } },
  { path: '/Vlsz_venta_directa', component: Vlsz_venta_directa, meta: { hideNav: false } },
  { path: '/WdtJ_atencion_mesa', component: WdtJ_atencion_mesa, meta: { hideNav: false } },
  { path: '/TdNV_lista_productos', component: TdNV_lista_productos, meta: { hideNav: false } },
  { path: '/U8EX_lista_pedidos', component: U8EX_lista_pedidos, meta: { hideNav: false } },
  { path: '/RPsB_lista_clientes', component: RPsB_lista_clientes, meta: { hideNav: false } },
  { path: '/Mod_pedidos', component: Mod_pedidos, meta: { hideNav: false } },
  {
    path: '/Khjs_despachar/:id',
    component: Khjs_despachar,
    meta: { hideNav: false }
  },
  // =========================================
  // RETAIL - DELIVERY
  // =========================================
  { path: '/Mod_plano_mercado', component: Mod_plano_mercado, meta: { hideNav: false } },  
  // =========================================
  // 404
  // =========================================
  { 
    path: '/mod_404',
    component: Mod_404,
    meta: { hideNav: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/mod_404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router