import { createRouter, createWebHistory } from 'vue-router'

// IMPORTA TUS VISTAS
//import DashApp from '../modules/retail/mod_dash/HomeApp.vue'
import RegPrincipalApp from '../modules/reg_principal/RegPrincipalApp.vue'
import LoginApp from '../modules/mod_login/LoginApp.vue'
import ModDashApp from '../modules/retail/negocio_admin/mod_dash/ModDashApp.vue'
import MpIH_lst_productos from '../modules/retail/negocio_admin/MpIH_lst_productos/MpIH_lst_productos.vue'
import Cuvg_crear_usu from '../modules/retail/negocio_admin/Cuvg_crear_usu/Cuvg_crear_usu.vue'
import CV2K_negocio from '../modules/retail/consumidor/CV2K_negocio/CV2K_negocio.vue'

import PCJj_mapa_ubicacion from '../modules/retail/consumidor/PCJj_mapa_ubicacion/PCJj_mapa_ubicacion.vue'
import QZMq_detalle_prod from '../modules/retail/consumidor/QZMq_detalle_prod/QZMq_detalle_prod.vue'
import ShJs_detalle_prod_cocina from '../modules/retail/consumidor/ShJs_detalle_prod_cocina/ShJs_detalle_prod_cocina.vue'
import TwcC_plano_mercado from '../modules/retail/consumidor/TwcC_plano_mercado/TwcC_plano_mercado.vue'
import URl4_usuario_carrito from '../modules/retail/consumidor/URl4_usuario_carrito/URl4_usuario_carrito.vue'
import MmZU_productos_categoria from '../modules/retail/consumidor/MmZU_productos_categoria/MmZU_productos_categoria.vue'
import QJB5_fecha_entrega from '../modules/retail/consumidor/QJB5_fecha_entrega/QJB5_fecha_entrega.vue'
import SFST_datos_delivery from '../modules/retail/consumidor/SFST_datos_delivery/SFST_datos_delivery.vue'
import U8mi_carrito_pedido from '../modules/retail/consumidor/U8mi_carrito_pedido/U8mi_carrito_pedido.vue'
import BTqw_mi_cuenta from '../modules/retail/consumidor/BTqw_mi_cuenta/BTqw_mi_cuenta.vue'
import Wvn1_mis_mensajes from '../modules/retail/consumidor/Wvn1_mis_mensajes/Wvn1_mis_mensajes.vue'
import CyHh_leer_mensaje from '../modules/retail/consumidor/CyHh_leer_mensaje/CyHh_leer_mensaje.vue'
import Adfj_mis_favoritos from '../modules/retail/consumidor/Adfj_mis_favoritos/Adfj_mis_favoritos.vue'
import KT3ENavegantes from '../modules/retail/negocio_admin/KT3E_navegantes/KT3E_navegantes.vue'
import ZpB1_ag_producto from '../modules/retail/negocio_admin/ZpB1_ag_producto/ZpB1_ag_producto.vue'
import RUkp_ed_producto from '../modules/retail/negocio_admin/RUkp_ed_producto/RUkp_ed_producto.vue'
import K9Rk_trabajadores from '../modules/retail/negocio_admin/K9Rk_trabajadores/K9Rk_trabajadores.vue'
import CjiH_ag_trabajador from '../modules/retail/negocio_admin/CjiH_ag_trabajador/CjiH_ag_trabajador.vue'
import Ugoy_ed_trabajador from '../modules/retail/negocio_admin/Ugoy_ed_trabajador/Ugoy_ed_trabajador.vue'
import NrAz_lista_pedidos from '../modules/retail/negocio_admin/NrAz_lista_pedidos/NrAz_lista_pedidos.vue'
import PM1N_ag_pedido from '../modules/retail/negocio_admin/PM1N_ag_pedido/PM1N_ag_pedido.vue'
import UbpF_ed_pedido from '../modules/retail/negocio_admin/UbpF_ed_pedido/UbpF_ed_pedido.vue'
import OAtb_lista_clientes from '../modules/retail/negocio_admin/OAtb_lista_clientes/OAtb_lista_clientes.vue'
import WhEb_ed_cliente from '../modules/retail/negocio_admin/WhEb_ed_cliente/WhEb_ed_cliente.vue'
import XtfF_ag_cliente from '../modules/retail/negocio_admin/XtfF_ag_cliente/XtfF_ag_cliente.vue'
import Lfdx_detalle_pedido from '../modules/retail/negocio_admin/Lfdx_detalle_pedido/Lfdx_detalle_pedido.vue'
import Vlsz_venta_directa from '../modules/retail/negocio_admin/Vlsz_venta_directa/Vlsz_venta_directa.vue'



const routes = [
  { path: '/', component: RegPrincipalApp,  meta: { hideNav: true }  },  
  //{ path: '/', component: DashApp, meta: { hideNav: true } },  
  { path: '/principal', component: RegPrincipalApp,  meta: { hideNav: false }  },  
  { path: '/login', component: LoginApp, meta: { hideNav: true } },
  { path: '/ari1995', component: KT3ENavegantes, meta: { hideNav: true } },
  //{ path: '/dash', component: DashApp, meta: { hideNav: false } },  
  { path: '/dash',   component: ModDashApp },
  { path: '/mpih_lst_productos', component: MpIH_lst_productos, meta: { hideNav: false } },    
  { path: '/Cuvg_crear_usu', component: Cuvg_crear_usu, meta: { hideNav: false } }, 


  { path: '/CV2K_negocio', component: CV2K_negocio, meta: { hideNav: true } },
  { path: '/PCJj_mapa_ubicacion', component: PCJj_mapa_ubicacion, meta: { hideNav: true } },
  { path: '/QZMq_detalle_prod', component: QZMq_detalle_prod, meta: { hideNav: true } },
  { path: '/ShJs_detalle_prod_cocina', component: ShJs_detalle_prod_cocina, meta: { hideNav: true } },  
  { path: '/TwcC_plano_mercado', component: TwcC_plano_mercado, meta: { hideNav: true } },
  { path: '/URl4_usuario_carrito', component: URl4_usuario_carrito, meta: { hideNav: false } },
  { path: '/MmZU_productos_categoria', component: MmZU_productos_categoria, meta: { hideNav: true } },
  { path: '/QJB5_fecha_entrega', component: QJB5_fecha_entrega, meta: { hideNav: true } },
  { path: '/SFST_datos_delivery', component: SFST_datos_delivery, meta: { hideNav: true } },
  { path: '/U8mi_carrito_pedido', component: U8mi_carrito_pedido, meta: { hideNav: false } },
  { path: '/BTqw_mi_cuenta', component: BTqw_mi_cuenta, meta: { hideNav: true } },
  { path: '/Wvn1_mis_mensajes', component: Wvn1_mis_mensajes, meta: { hideNav: false } },
  { path: '/CyHh_leer_mensaje', component: CyHh_leer_mensaje, meta: { hideNav: false } },
  { path: '/Adfj_mis_favoritos', component: Adfj_mis_favoritos, meta: { hideNav: true } },
  { path: '/ZpB1_ag_producto', component: ZpB1_ag_producto, meta: { hideNav: true } },
  { path: '/RUkp_ed_producto/:id', component: RUkp_ed_producto, meta: { hideNav: true } },
  { path: '/K9Rk_trabajadores', component: K9Rk_trabajadores, meta: { hideNav: true } },
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router