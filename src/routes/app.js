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

  var listado = temperatura.getAll();
  var si      = setInterval ( () => {

    if ( typeof(listado) !== 'undefined' ) {

      clearInterval(si);

      if ( listado.estado === true ) {
        var resTemperatura = jsonRes.set(true, listado.mensaje, listado.detalle);
        res.status( 400 ).json(resTemperatura);
      } else if ( listado.estado === false ){
        var resTemperatura = jsonRes.set(false, listado.mensaje, listado.detalle);
        res.status( 500 ).json(resTemperatura);
      }
    }

  }, 500);

});

//
// Exports
//
module.exports = app;