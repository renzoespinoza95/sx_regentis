import mitt from 'mitt'

export const bus = mitt()

/* =========================================
   🔥 BOTTOMNAV LAYERS
========================================= */

let hideCount = 0

/* =========================================
   🔥 HIDE
========================================= */

export function hideBottomNav() {

    hideCount++

    /* =========================================
       🔥 NUEVO
    ========================================= */

    bus.emit(
        'bottomnav:hidden',
        true
    )

    /* =========================================
       🔥 COMPATIBILIDAD
    ========================================= */

    bus.emit(
        'bottomnav:toggle',
        true
    )

}

/* =========================================
   🔥 SHOW
========================================= */

export function showBottomNav() {

    hideCount--

    if (hideCount < 0) {

        hideCount = 0

    }

    /* =========================================
       🔥 SOLO MOSTRAR SI YA NO HAY MODALS
    ========================================= */

    if (hideCount === 0) {

        /* =========================================
           🔥 NUEVO
        ========================================= */

        bus.emit(
            'bottomnav:hidden',
            false
        )

        /* =========================================
           🔥 COMPATIBILIDAD
        ========================================= */

        bus.emit(
            'bottomnav:toggle',
            false
        )

    }

}