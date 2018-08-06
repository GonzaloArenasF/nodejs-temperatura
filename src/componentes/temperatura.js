/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 26-07-2018
 * @version 2018.0.1
 * 
 * Definición de procesos para redes sociales
 * 
 */

//
// Importaciones
//
var axios   = require('axios');

var jsonRes   = require('../json-res');
var oRedis    = require('../bd/redis');
var oLugares  = require('./lugares');

/**
 * Componente principal
 */
var oTemperatura = {

  servicio: {
    url     : 'https://api.darksky.net/forecast/44024b1ca03ddb6445f9b5aba9f885ce',
    params  : 'lang=es&units=auto'
  },

  // Estado de la obtención de temeperaturas
  estadoConsumoServicio : null,
  errorConsumoServicio  : null,

  // Lugares a trabajar obtenidos desde Redis
  estadoLugares : null,
  errorLugares  : null,
  lugares       : null

};

//
// Rescate lugares desde Redis
//
oRedis.cliente.get( oLugares.redisKey, (error, result) => {
    
  oTemperatura.estadoLugares = null;

  if (error) {
    oTemperatura.estadoLugares  = false;
    oTemperatura.errorLugares   = error;
  }

  oTemperatura.estadoLugares  = true;
  oTemperatura.lugares = JSON.parse(result);

});

/**
 * Retorna la información de los lugares desde el servicio y lo almacena en Redis
 */
oTemperatura.getDataFromService = () => {

  // Fallo del 10%
  if (Math.random(0, 1) < 0.1) { throw 'How unfortunate! The API Request Failed'; }

  // Verificación de la obtención de los datos desde Redis
  if (oTemperatura.estadoLugares === false ) { throw oTemperatura.errorLugares; }

  // Reinicio de valores de validación
  oTemperatura.estadoConsumoServicio = null;
  oTemperatura.errorConsumoServicio  = null;

  //
  // Consumo del servicio con Axios
  //
  axios.all([

    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[0].latLon + '?' + oTemperatura.servicio.params),
    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[1].latLon + '?' + oTemperatura.servicio.params),
    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[2].latLon + '?' + oTemperatura.servicio.params),
    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[3].latLon + '?' + oTemperatura.servicio.params),
    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[4].latLon + '?' + oTemperatura.servicio.params),
    axios.get(oTemperatura.servicio.url + '/' + oTemperatura.lugares[5].latLon + '?' + oTemperatura.servicio.params),

  ]).then(axios.spread((resCl, resCh, resNz, resAu, resUk, resUsa) => {

    oTemperatura.lugares[0].clima   = { temperatura: resCl.data.currently.temperature, estado: resCl.data.currently.summary, icon: resCl.data.currently.icon };
    oTemperatura.lugares[1].clima   = { temperatura: resCh.data.currently.temperature, estado: resCh.data.currently.summary, icon: resCh.data.currently.icon  };
    oTemperatura.lugares[2].clima   = { temperatura: resNz.data.currently.temperature, estado: resNz.data.currently.summary, icon: resNz.data.currently.icon  };
    oTemperatura.lugares[3].clima   = { temperatura: resAu.data.currently.temperature, estado: resAu.data.currently.summary, icon: resAu.data.currently.icon  };
    oTemperatura.lugares[4].clima   = { temperatura: resUk.data.currently.temperature, estado: resUk.data.currently.summary, icon: resUk.data.currently.icon  };
    oTemperatura.lugares[5].clima   = { temperatura: resUsa.data.currently.temperature, estado: resUsa.data.currently.summary, icon: resUsa.data.currently.icon  };

    // Bandera de infromación capturada con éxito
    oTemperatura.estadoConsumoServicio = true;

  })).catch( error => {

    oTemperatura.errorConsumoServicio  = error;
    oTemperatura.estadoConsumoServicio = false;
    
  });

}

module.exports = oTemperatura;