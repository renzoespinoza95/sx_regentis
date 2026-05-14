// src/utils/security.js

import md5 from 'md5';

/* =====================================================
   CLAVE PRIVADA
===================================================== */

const BARSI_SECRET =
'Diedao_qi_ci,_zhan_qilai_ba_ci';

/* =====================================================
   GENERAR FIRMA
===================================================== */

export function firma(){

    const xin = Date.now();

    const yuan = md5(
        xin + BARSI_SECRET
    );

    return {
        xin,
        yuan
    };

}

/* =====================================================
   ENCRIPTAR
===================================================== */

export function enc_barsi(texto){

    texto = texto.toString();

    let resultado = '';

    for(let i = 0; i < texto.length; i++){

        resultado += texto
            .charCodeAt(i)
            .toString(16);

    }

    return resultado;

}

/* =====================================================
   DESENCRIPTAR
===================================================== */

export function des_barsi(hex){

    let resultado = '';

    for(let i = 0; i < hex.length; i += 2){

        resultado += String.fromCharCode(

            parseInt(
                hex.substr(i, 2),
                16
            )

        );

    }

    return resultado;

}

/*
import {
   firma
} from '@/utils/security';

const firma = firma();

axios.post(

   '/usuario/listar',

   {
      xin: firma.xin,
      yuan: firma.yuan
   }

);
*/