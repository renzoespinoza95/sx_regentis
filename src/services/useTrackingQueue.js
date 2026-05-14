import { ref } from 'vue'

const trackingQueue = ref([])

export function useTrackingQueue() {

    function addTracking({
        usu_id,
        accion,
        descripcion,
        extra_data = {}
    }) {

        trackingQueue.value.push({

            usu_id,

            accion,

            descripcion,

            extra_data,

            fecha_creacion: new Date().toISOString()

        })

    }

    function getTracking() {

        return [...trackingQueue.value]

    }

    function clearTracking() {

        trackingQueue.value = []

    }

    return {

        trackingQueue,

        addTracking,

        getTracking,

        clearTracking

    }

} 
