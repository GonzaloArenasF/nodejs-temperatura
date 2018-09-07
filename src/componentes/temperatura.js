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

var oRedis    = require('../bd/redis');
var oLugares  = require('./lugares');

/**
 * Componente principal
 */
function oTemperatura () {

  this.servicio = {
    urlPersonal     : 'https://api.darksky.net/forecast/44024b1ca03ddb6445f9b5aba9f885ce',
    url     : 'https://api.darksky.net/forecast/2b58d388684fbfae750a4f2f86ac287c',
    params  : 'lang=es&units=auto'
  },

  // Estado de la obtención de temeperaturas
  this.estadoConsumoServicio = null;
  this.errorConsumoServicio  = null;

  // Lugares a trabajar obtenidos desde Redis
  this.estadoLugares = null;
  this.errorLugares  = null;
  this.lugares       = null;

  // Cuando se recupera un lugar específico
  this.place = null;

  //
  // Rescate lugares desde Redis
  //
  oRedis.cliente.get( oLugares.redisKey, (error, result) => {
      
    this.estadoLugares = null;

    if (error) {
      this.estadoLugares  = false;
      this.errorLugares   = error;
    }

    this.estadoLugares  = true;
    this.lugares = JSON.parse(result);

  });

  /**
   * Retorna la información de los lugares desde el servicio y lo almacena en Redis
   */
  this.getDataFromService = () => {

    try {

      // Fallo del 10%
      // if (Math.random(0, 1) < 0.1) { throw 'How unfortunate! The API Request Failed'; }

      // Verificación de la obtención de los datos desde Redis
      if (this.estadoLugares === false ) { throw this.errorLugares; }

      // Reinicio de valores de validación
      this.estadoConsumoServicio = null;
      this.errorConsumoServicio  = null;

      //
      // Consumo del servicio con Axios
      //
      axios.all([

        axios.get(this.servicio.url + '/' + this.lugares[0].latLon + '?' + this.servicio.params),
        axios.get(this.servicio.url + '/' + this.lugares[1].latLon + '?' + this.servicio.params),
        axios.get(this.servicio.url + '/' + this.lugares[2].latLon + '?' + this.servicio.params),
        axios.get(this.servicio.url + '/' + this.lugares[3].latLon + '?' + this.servicio.params),
        axios.get(this.servicio.url + '/' + this.lugares[4].latLon + '?' + this.servicio.params),
        axios.get(this.servicio.url + '/' + this.lugares[5].latLon + '?' + this.servicio.params),

      ]).then(axios.spread((resCl, resCh, resNz, resAu, resUk, resUsa) => {

        this.lugares[0].clima   = { temperatura: resCl.data.currently.temperature, estado: resCl.data.currently.summary, icon: resCl.data.currently.icon };
        this.lugares[1].clima   = { temperatura: resCh.data.currently.temperature, estado: resCh.data.currently.summary, icon: resCh.data.currently.icon  };
        this.lugares[2].clima   = { temperatura: resNz.data.currently.temperature, estado: resNz.data.currently.summary, icon: resNz.data.currently.icon  };
        this.lugares[3].clima   = { temperatura: resAu.data.currently.temperature, estado: resAu.data.currently.summary, icon: resAu.data.currently.icon  };
        this.lugares[4].clima   = { temperatura: resUk.data.currently.temperature, estado: resUk.data.currently.summary, icon: resUk.data.currently.icon  };
        this.lugares[5].clima   = { temperatura: resUsa.data.currently.temperature, estado: resUsa.data.currently.summary, icon: resUsa.data.currently.icon  };

        // Bandera de infromación capturada con éxito
        this.estadoConsumoServicio = true;

      })).catch( error => {

        this.errorConsumoServicio  = error;
        this.estadoConsumoServicio = false;
        
      });

    } catch (e) {

      this.errorConsumoServicio  = e;
      this.estadoConsumoServicio = false;
        
    }

  };

  /**
   * Retorna la información de los lugares desde el servicio y lo almacena en Redis
   */
  this.getDataFromDummy = () => {

    try {

      // Fallo del 10%
      // if (Math.random(0, 1) < 0.1) { throw 'How unfortunate! The API Request Failed'; }

      // Verificación de la obtención de los datos desde Redis
      if (this.estadoLugares === false ) { throw this.errorLugares; }

      // Reinicio de valores de validación
      this.estadoConsumoServicio = null;
      this.errorConsumoServicio  = null;

      //
      // Dummy
      //
      this.lugares[0].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2), estado: 'Despejado', icon: 'clear-day' };
      this.lugares[1].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2), estado: 'Nublado', icon: 'cloudy'  };
      this.lugares[2].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2), estado: 'Nubosidad Parcial', icon: 'partly-cloudy-day'  };
      this.lugares[3].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2), estado: 'Lluvia', icon: 'rain'  };
      this.lugares[4].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2), estado: 'Ventisca', icon: 'wind'  };
      this.lugares[5].clima   = { temperatura: (Math.random(0, 1)*1000).toString().substring(0,2) , estado: 'Tormenta', icon: 'thunderstorm'  };

      this.estadoConsumoServicio = true;

    } catch (e) {

      this.errorConsumoServicio  = e;
      this.estadoConsumoServicio = false;

    }

  };

  /**
   * Rescate de los datos actuales del clima de una localidad por coordendas
   */
  this.getWeatherFromCoord = (coordendas) => {

    try {

      // Reinicio de valores de validación
      this.estadoConsumoServicio = null;
      this.errorConsumoServicio  = null;

      //
      // Consumo del servicio con Axios
      //
      axios.all([

        axios.get(this.servicio.url + '/' + coordendas + '?' + this.servicio.params)

      ]).then(axios.spread( (res) => {

        this.place = res.data.currently;

        // Bandera de infromación capturada con éxito
        this.estadoConsumoServicio = true;

      })).catch( error => {

        this.errorConsumoServicio  = error;
        this.estadoConsumoServicio = false;
        
      });

    } catch (e) {

      this.errorConsumoServicio  = e;
      this.estadoConsumoServicio = false;
        
    }

  }

  return this;

};

module.exports = oTemperatura;
