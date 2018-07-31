/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 26-07-2018
 * @version 2018.0.1
 * 
 * Definición de procesos para redes sociales
 * 
 */
var https   = require('https');
var jsonRes = require('../json-res');
var axios   = require('axios');

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

  // Listado de temperaturas obtenidas
  places : {
    cl:   { nombre: 'Santiago', abreviado: 'CL',  clima: null, latLon: '-33.4372,-70.6506' },
    ch:   { nombre: 'Zurich',   abreviado: 'CH',  clima: null, latLon: '47.3666687,8.5500002' },
    nz:   { nombre: 'Auckland', abreviado: 'NZ',  clima: null, latLon: '-36.8404,174.7634888' },
    au:   { nombre: 'Sydney',   abreviado: 'AU',  clima: null, latLon: '-33.8667,151.2' },
    uk:   { nombre: 'Londres',  abreviado: 'UK',  clima: null, latLon: '51.5072,-0.1275' },
    usa:  { nombre: 'Georgia',  abreviado: 'USA', clima: null, latLon: '41.8036499,43.4819412' }
  }

};

/**
 * Retorna la información de los lugares desde el servicio
 */
temperatura.getTemperaturas = () => {

  temperatura.estado = null // Inicio del estado de control de la respuesta

  axios.all([

    axios.get(temperatura.servicio.url + '/' + temperatura.places.cl.latLon + '?' + temperatura.servicio.params)
  //   axios.get(temperatura.servicio.url + '/' + temperatura.places.ch.latLon + '?' + temperatura.servicio.params),
  //   axios.get(temperatura.servicio.url + '/' + temperatura.places.nz.latLon + '?' + temperatura.servicio.params),
  //   axios.get(temperatura.servicio.url + '/' + temperatura.places.au.latLon + '?' + temperatura.servicio.params),
  //   axios.get(temperatura.servicio.url + '/' + temperatura.places.uk.latLon + '?' + temperatura.servicio.params),
  //   axios.get(temperatura.servicio.url + '/' + temperatura.places.usa.latLon + '?' + temperatura.servicio.params),

  ]).then(axios.spread((resCl, resCh, resNz, resAu, resUk, resUsa) => {

    temperatura.places.cl.clima   = { temperatura: resCl.data.currently.temperature, estado: resCl.data.currently.summary };
    // temperatura.places.ch.clima   = { temperatura: resCh.currently.temperature, estado: resCh.currently.summary };
    // temperatura.places.nz.clima   = { temperatura: resNz.currently.temperature, estado: resNz.currently.summary };
    // temperatura.places.au.clima   = { temperatura: resAu.currently.temperature, estado: resAu.currently.summary };
    // temperatura.places.uk.clima   = { temperatura: resUk.currently.temperature, estado: resUk.currently.summary };
    // temperatura.places.usa.clima  = { temperatura: resUsa.currently.temperature, estado: resUsa.currently.summary };
  
    temperatura.estado = true;

  })).catch(error => {
    console.log('error', error);
    temperatura.estado = false;
  });

}

/**
 * Rescate de todas las temperaturas
 * @returns jsonRes => array(model)
 */
temperatura.getAll = () => {
  
  try {

    temperatura.getTemperaturas();

    let si = setInterval( () => {

      if (temperatura.estado !== null) {

        clearInterval(si);

        if (temperatura.estado === true) {
          return jsonRes.set(true, 'Datos encontrados', temperatura.places);
        } else if (temperatura.estado === false) {
          throw 'No se pudo recuperar la información';
        }

      }

    }, 500 );

  } catch (e) {
    return jsonRes.set(false, e.message);
  }

};

module.exports = temperatura;