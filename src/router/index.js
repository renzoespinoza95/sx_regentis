import { createRouter, createWebHistory } from 'vue-router'

// IMPORTA TUS VISTAS
import RegPrincipalApp from '../modules/reg_principal/RegPrincipalApp.vue'
import LoginApp from '../modules/mod_login/LoginApp.vue'
import Mod_dash from '../modules/mod_dash/Mod_dash.vue'
import MpIH_lista_productos from '../modules/retail/negocio_admin/MpIH_lista_productos/MpIH_lista_productos.vue'
import Mod_nuevo_usu from '../modules/mod_nuevo_usu/Mod_nuevo_usu.vue'
import Mod_pedidos from '../modules/mod_pedidos/Mod_pedidos.vue'
import Mod_plano_mercado from '../modules/mod_plano_mercado/Mod_plano_mercado.vue'
import CV2K_negocio from '../modules/retail/consumidor/CV2K_negocio/CV2K_negocio.vue'

import PCJj_mapa_ubicacion from '../modules/retail/consumidor/PCJj_mapa_ubicacion/PCJj_mapa_ubicacion.vue'
import QZMq_detalle_prod from '../modules/retail/consumidor/QZMq_detalle_prod/QZMq_detalle_prod.vue'
import ShJs_detalle_prod_cocina from '../modules/retail/consumidor/ShJs_detalle_prod_cocina/ShJs_detalle_prod_cocina.vue'
import URl4_usuario_carrito from '../modules/retail/consumidor/URl4_usuario_carrito/URl4_usuario_carrito.vue'
import MmZU_productos_categoria from '../modules/retail/consumidor/MmZU_productos_categoria/MmZU_productos_categoria.vue'
import SFST_datos_delivery from '../modules/retail/consumidor/SFST_datos_delivery/SFST_datos_delivery.vue'
import U8mi_carrito_pedido from '../modules/retail/consumidor/U8mi_carrito_pedido/U8mi_carrito_pedido.vue'
import BTqw_mi_cuenta from '../modules/retail/consumidor/BTqw_mi_cuenta/BTqw_mi_cuenta.vue'
import Wvn1_mis_mensajes from '../modules/retail/consumidor/Wvn1_mis_mensajes/Wvn1_mis_mensajes.vue'
import CyHh_leer_mensaje from '../modules/retail/consumidor/CyHh_leer_mensaje/CyHh_leer_mensaje.vue'
import Adfj_mis_favoritos from '../modules/retail/consumidor/Adfj_mis_favoritos/Adfj_mis_favoritos.vue'
import Mod_navegantes from '../modules/mod_navegantes/Mod_navegantes.vue'
import ZpB1_ag_producto from '../modules/retail/negocio_admin/ZpB1_ag_producto/ZpB1_ag_producto.vue'
import RUkp_ed_producto from '../modules/retail/negocio_admin/RUkp_ed_producto/RUkp_ed_producto.vue'
import K9Rk_lista_trabajadores from '../modules/retail/negocio_admin/K9Rk_lista_trabajadores/K9Rk_lista_trabajadores.vue'
import CjiH_ag_trabajador from '../modules/retail/negocio_admin/CjiH_ag_trabajador/CjiH_ag_trabajador.vue'
import Ugoy_ed_trabajador from '../modules/retail/negocio_admin/Ugoy_ed_trabajador/Ugoy_ed_trabajador.vue'
import NrAz_lista_pedidos from '../modules/retail/negocio_admin/NrAz_lista_pedidos/NrAz_lista_pedidos.vue'
import PM1N_ag_pedido from '../modules/retail/negocio_admin/PM1N_ag_pedido/PM1N_ag_pedido.vue'
import UbpF_ed_pedido from '../modules/retail/negocio_admin/UbpF_ed_pedido/UbpF_ed_pedido.vue'
import OAtb_lista_clientes from '../modules/retail/negocio_admin/OAtb_lista_clientes/OAtb_lista_clientes.vue'
import WhEb_ed_cliente from '../modules/retail/negocio_admin/WhEb_ed_cliente/WhEb_ed_cliente.vue'
import XtfF_ag_cliente from '../modules/retail/negocio_admin/XtfF_ag_cliente/XtfF_ag_cliente.vue'
import Lfdx_detalle_pedido from '../modules/retail/negocio_admin/Lfdx_detalle_pedido/Lfdx_detalle_pedido.vue'
import Vlsz_venta_directa from '../modules/retail/negocio_staff/Vlsz_venta_directa/Vlsz_venta_directa.vue'
import WdtJ_atencion_mesa from '../modules/restaurantes/negocio_staff/WdtJ_atencion_mesa/WdtJ_atencion_mesa.vue'

import TdNV_lista_productos from '../modules/retail/negocio_staff/TdNV_lista_productos/TdNV_lista_productos.vue'
import U8EX_lista_pedidos from '../modules/retail/negocio_staff/U8EX_lista_pedidos/U8EX_lista_pedidos.vue'
import RPsB_lista_clientes from '../modules/retail/negocio_staff/RPsB_lista_clientes/RPsB_lista_clientes.vue'




const routes = [
  { path: '/', component: RegPrincipalApp,  meta: { hideNav: true }  },  
  //{ path: '/', component: DashApp, meta: { hideNav: true } },  
  { path: '/principal', component: RegPrincipalApp,  meta: { hideNav: false }  },  
  { path: '/login', component: LoginApp, meta: { hideNav: true } },
  { path: '/ari1995', component: Mod_navegantes, meta: { hideNav: true } },
  //{ path: '/dash', component: DashApp, meta: { hideNav: false } },  
  { path: '/dash',   component: Mod_dash },
  { path: '/MpIH_lista_productos', component: MpIH_lista_productos, meta: { hideNav: false } },    
  { path: '/Mod_nuevo_usu', component: Mod_nuevo_usu, meta: { hideNav: false } }, 
  { path: '/CV2K_negocio', component: CV2K_negocio, meta: { hideNav: true } },
  { path: '/PCJj_mapa_ubicacion', component: PCJj_mapa_ubicacion, meta: { hideNav: true } },
  { path: '/QZMq_detalle_prod', component: QZMq_detalle_prod, meta: { hideNav: true } },
  { path: '/ShJs_detalle_prod_cocina', component: ShJs_detalle_prod_cocina, meta: { hideNav: true } },    
  { path: '/URl4_usuario_carrito', component: URl4_usuario_carrito, meta: { hideNav: false } },
  { path: '/MmZU_productos_categoria', component: MmZU_productos_categoria, meta: { hideNav: true } },  
  { path: '/SFST_datos_delivery', component: SFST_datos_delivery, meta: { hideNav: true } },
  { path: '/U8mi_carrito_pedido', component: U8mi_carrito_pedido, meta: { hideNav: false } },
  { path: '/BTqw_mi_cuenta', component: BTqw_mi_cuenta, meta: { hideNav: true } },
  { path: '/Wvn1_mis_mensajes', component: Wvn1_mis_mensajes, meta: { hideNav: false } },
  { path: '/CyHh_leer_mensaje', component: CyHh_leer_mensaje, meta: { hideNav: false } },
  { path: '/Adfj_mis_favoritos', component: Adfj_mis_favoritos, meta: { hideNav: true } },
  { path: '/ZpB1_ag_producto', component: ZpB1_ag_producto, meta: { hideNav: true } },
  { path: '/RUkp_ed_producto/:id', component: RUkp_ed_producto, meta: { hideNav: true } },
  { path: '/K9Rk_lista_trabajadores', component: K9Rk_lista_trabajadores, meta: { hideNav: true } },
  { path: '/CjiH_ag_trabajador', component: CjiH_ag_trabajador, meta: { hideNav: true } },
  { path: '/Ugoy_ed_trabajador/:id', component: Ugoy_ed_trabajador, meta: { hideNav: true } },
  { path: '/NrAz_lista_pedidos', component: NrAz_lista_pedidos, meta: { hideNav: true } },
  { path: '/PM1N_ag_pedido', component: PM1N_ag_pedido, meta: { hideNav: true } },
  { path: '/UbpF_ed_pedido/:id', component: UbpF_ed_pedido, meta: { hideNav: true } },
  { path: '/OAtb_lista_clientes', component: OAtb_lista_clientes, meta: { hideNav: true } },
  { path: '/WhEb_ed_cliente/:id', component: WhEb_ed_cliente, meta: { hideNav: true } },
  { path: '/XtfF_ag_cliente', component: XtfF_ag_cliente, meta: { hideNav: true } },
  { path: '/Lfdx_detalle_pedido/:id', component: Lfdx_detalle_pedido, meta: { hideNav: true } },
  { path: '/Vlsz_venta_directa', component: Vlsz_venta_directa, meta: { hideNav: true } },
  { path: '/WdtJ_atencion_mesa', component: WdtJ_atencion_mesa, meta: { hideNav: true } },
  { path: '/TdNV_lista_productos', component: TdNV_lista_productos, meta: { hideNav: true } },
  { path: '/U8EX_lista_pedidos', component: U8EX_lista_pedidos, meta: { hideNav: true } },
  { path: '/RPsB_lista_clientes', component: RPsB_lista_clientes, meta: { hideNav: true } },
  { path: '/Mod_pedidos', component: Mod_pedidos, meta: { hideNav: true } },
  { path: '/Mod_plano_mercado', component: Mod_plano_mercado, meta: { hideNav: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router