import { ref } from 'vue'

const anonimoState = ref({

    neg_id: null,

    productos: []

})

export function useAnonimo() {

    function load() {

        try {

            anonimoState.value =

                JSON.parse(

                    localStorage.getItem(
                        'regentis_anonimo'
                    )

                )

                ||

                {

                    neg_id: null,

                    productos: []

                }

        }

        catch {

            anonimoState.value = {

                neg_id: null,

                productos: []

            }

        }

    }

    function save() {

        localStorage.setItem(

            'regentis_anonimo',

            JSON.stringify(
                anonimoState.value
            )

        )

    }

    function setNegocio(
        neg_id
    ) {

        anonimoState.value.neg_id =
            Number(neg_id)

        save()

    }

    function addProducto(
        producto
    ) {

        const idx =

            anonimoState.value.productos.findIndex(

                x =>

                    Number(x.product_id)

                    ===

                    Number(
                        producto.product_id
                    )

            )

        if (

            idx >= 0

        ) {

            anonimoState.value.productos[idx].cantidad +=

                producto.cantidad

                ||

                1

        }

        else {

            anonimoState.value.productos.push({

                product_id:
                    producto.product_id,

                nombre:
                    producto.nombre,

                precio:
                    producto.precio,

                cantidad:
                    producto.cantidad || 1,

                img:
                    producto.img

            })

        }

        save()

    }

    function removeProducto(
        product_id
    ) {

        anonimoState.value.productos =

            anonimoState.value.productos.filter(

                x =>

                    Number(x.product_id)

                    !==

                    Number(product_id)

            )

        save()

    }

    function clear() {

        anonimoState.value = {

            neg_id: null,

            productos: []

        }

        save()

    }

    load()

    return {

        anonimo:
            anonimoState,

        setNegocio,

        addProducto,

        removeProducto,

        clear

    }

} 
