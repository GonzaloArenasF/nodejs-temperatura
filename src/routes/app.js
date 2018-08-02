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

  temperatura.getAll();

  var si  = setInterval ( () => {
    if ( temperatura.estado !== null ) {

      clearInterval(si);

      if ( temperatura.estado  === true ) {
        var resTemperatura = jsonRes.set(true, 'Datos encontrados', temperatura.places);
        res.status( 200 ).json(resTemperatura);
      } else if ( temperatura.estado === false ){
        var resTemperatura = jsonRes.set(false, 'No se pudieron obtener datos', temperatura.error);
        res.status( 500 ).json(resTemperatura);
      }

    }

  }, 500);

});

//
// Exports
//
module.exports = app;