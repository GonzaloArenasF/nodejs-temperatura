/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 25-07-2018
 * @version 2018.0.1
 * 
 * Definición de rutas únicas
 * 
 * // Consideraciones:
 * - JSON format standar require('../json-res');
 * 
 */
var express = require('express');
var jsonRes = require('../json-res');
var temperatura = require('../componentes/temperatura');

var app = express();

//
// Rutas únicas
//
app.get( '/temperatura', (req, res, next) => {

  temperatura.getDataFromService();
  
  let places = temperatura.getDataFromRedis();

  var si  = setInterval ( () => {
    if ( temperatura.estado !== null ) {

      clearInterval(si);

      if ( temperatura.estado  === true ) {

        
        console.log(places);
        if (places.estado === true) {
          res.status( 200 ).json( jsonRes.set(true, 'Datos encontrados', places.detalle) );
        } else if (places.estado === false) {
          res.status( 400 ).json( jsonRes.set(false, places.mensaje, places.detalle) );
        }

      } else if ( temperatura.estado === false ) {
        res.status( 500 ).json( jsonRes.set(false, 'No se pudieron obtener datos', temperatura.error) );
      }

    }

  }, 500);

});

//
// Exports
//
module.exports = app;