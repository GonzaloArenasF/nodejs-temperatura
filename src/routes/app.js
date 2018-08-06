/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 25-07-2018
 * @version 2018.0.2
 * 
 * Definición de rutas únicas
 * 
 * // Consideraciones:
 * - JSON format standar require('../json-res');
 * 
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 06-08-2018
 * @version 2018.0.2
 * - Refactoring
 * 
 */
var express = require('express');
var jsonRes = require('../json-res');
var oTemperatura = require('../componentes/temperatura');

var app = express();

//
// Rutas únicas
//
app.get( '/temperatura', (req, res, next) => {

  // oTemperatura.getDataFromService();
  oTemperatura.getDataFromDummy();

  let si = setInterval( () => {

    if (oTemperatura.estadoConsumoServicio !== null) {

      clearInterval(si);

      if (oTemperatura.estadoConsumoServicio === true) {

        res.status(200).json(
          jsonRes.get(true, 'Lugares rescatados', oTemperatura.lugares)
        );

      } else if (oTemperatura.estadoConsumoServicio === false) {

        res.status(500).json(
          jsonRes.get(false, oTemperatura.errorConsumoServicio)
        );

      }

    }

  }, 500 );


});

//
// Exports
//
module.exports = app;