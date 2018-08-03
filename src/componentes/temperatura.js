/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 26-07-2018
 * @version 2018.0.1
 * 
 * Definición de procesos para redes sociales
 * 
 */
var jsonRes = require('../json-res');
var axios   = require('axios');
var redis   = require('redis');

// Inicialización de variables
var redisPort    = 6379;
var redisHost    = '127.0.0.1';
var redisClient  = redis.createClient(redisPort, redisHost);

//
// Conexión a Redis
//
redisClient.on('connect', () => {
  console.log('Cliente Redis conectado a ' + redisHost + ':' + redisPort); 
});
redisClient.on('error', (err) => {
  console.log(err);
});

/**
 * Componente principal
 */
var temperatura = {

  servicio: {
    url     : 'https://api.darksky.net/forecast/44024b1ca03ddb6445f9b5aba9f885ce',
    params  : 'lang=es&units=auto'
  },

  // Estado de la obtención de temeperaturas
  estado : null,
  error  : null,

  // Listado de temperaturas obtenidas
  places : [
    { nombre: 'Santiago', abreviado: 'CL',  clima: null, latLon: '-33.4372,-70.6506' },
    { nombre: 'Zurich',   abreviado: 'CH',  clima: null, latLon: '47.3666687,8.5500002' },
    { nombre: 'Auckland', abreviado: 'NZ',  clima: null, latLon: '-36.8404,174.7634888' },
    { nombre: 'Sydney',   abreviado: 'AU',  clima: null, latLon: '-33.8667,151.2' },
    { nombre: 'Londres',  abreviado: 'UK',  clima: null, latLon: '51.5072,-0.1275' },
    { nombre: 'Georgia',  abreviado: 'USA', clima: null, latLon: '41.8036499,43.4819412' }
  ]

};

/**
 * Retorna la información de los lugares desde el servicio y lo almacena en Redis
 */
temperatura.getDataFromService = () => {

  temperatura.estado = null; // Inicio del estado de control de la respuesta
  temperatura.error  = null; // Reinicio del mensaje de error

  axios.all([

    axios.get(temperatura.servicio.url + '/' + temperatura.places[0].latLon + '?' + temperatura.servicio.params),
    axios.get(temperatura.servicio.url + '/' + temperatura.places[1].latLon + '?' + temperatura.servicio.params),
    axios.get(temperatura.servicio.url + '/' + temperatura.places[2].latLon + '?' + temperatura.servicio.params),
    axios.get(temperatura.servicio.url + '/' + temperatura.places[3].latLon + '?' + temperatura.servicio.params),
    axios.get(temperatura.servicio.url + '/' + temperatura.places[4].latLon + '?' + temperatura.servicio.params),
    axios.get(temperatura.servicio.url + '/' + temperatura.places[5].latLon + '?' + temperatura.servicio.params),

  ]).then(axios.spread((resCl, resCh, resNz, resAu, resUk, resUsa) => {

    temperatura.places[0].clima   = { temperatura: resCl.data.currently.temperature, estado: resCl.data.currently.summary, icon: resCl.data.currently.icon };
    temperatura.places[1].clima   = { temperatura: resCh.data.currently.temperature, estado: resCh.data.currently.summary, icon: resCh.data.currently.icon  };
    temperatura.places[2].clima   = { temperatura: resNz.data.currently.temperature, estado: resNz.data.currently.summary, icon: resNz.data.currently.icon  };
    temperatura.places[3].clima   = { temperatura: resAu.data.currently.temperature, estado: resAu.data.currently.summary, icon: resAu.data.currently.icon  };
    temperatura.places[4].clima   = { temperatura: resUk.data.currently.temperature, estado: resUk.data.currently.summary, icon: resUk.data.currently.icon  };
    temperatura.places[5].clima  = { temperatura: resUsa.data.currently.temperature, estado: resUsa.data.currently.summary, icon: resUsa.data.currently.icon  };
  
    // Guardado en Redis
    redisClient.set('places', JSON.stringify(temperatura.places), redis.print);

    // Bandera de infromación capturada con éxito
    temperatura.estado = true;

  })).catch(error => {

    console.error('temperatura.getTemperaturas', error);
    temperatura.estado = false;
    temperatura.error  = error;
    
  });

}

/**
 * Coordina el rescate de todas las temperaturas
 */
temperatura.getDataFromRedis = () => {

  redisClient.get('places', function (error, result) {
    if (error) {
      console.log(error);
      return jsonRes.set(false, 'No se pudo obtener la data de Redis', error);
    }
    console.log('result', result);
    return jsonRes.set(true, 'Data desde Redis', result);
  });

};

module.exports = temperatura;