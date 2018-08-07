/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 05-08-2018
 * @version 2018.0.1
 * 
 * Definición de procesos para los lugares
 * 
 */
var jsonRes = require('../json-res');
var oRedis  = require('../bd/redis');

//
// Objeto a exportar
//
var oLugares = {

  // Clave de guardado en Redis
  redisKey : 'lugares',

  //
  // Lugares
  //
  cl  : { 
    nombre: 'Santiago', 
    abreviado: 'CL',  
    clima: null, 
    latLon: '-33.4372,-70.6506' 
  },

  ch  : { 
    nombre: 'Zurich',   
    abreviado: 'CH',  
    clima: null, 
    latLon: '47.3666687,8.5500002' 
  },

  nz  : { 
    nombre: 'Auckland', 
    abreviado: 'NZ',  
    clima: null, 
    latLon: '-36.8404,174.7634888' 
  },

  au  : { 
    nombre: 'Sydney',   
    abreviado: 'AU',  
    clima: null, 
    latLon: '-33.8667,151.2' 
  },

  uk  : { 
    nombre: 'Londres',  
    abreviado: 'UK',  
    clima: null, 
    latLon: '51.5072,-0.1275' 
  },

  usa : { 
    nombre: 'Georgia',  
    abreviado: 'USA', 
    clima: null, 
    latLon: '41.8036499,43.4819412' 
  }

};

/**
 * Guardamos los datos de los lugares al momento de cargar la aplicación
 */
oLugares.storeRedis = () => {

  console.log('oLugares', 'Guardando lugares en Redis');

  oRedis.store( oLugares.redisKey, JSON.stringify (
    [ oLugares.au, oLugares.ch, oLugares.cl, oLugares.nz, oLugares.uk, oLugares.usa ]
  ));
  

}

//
// Exportación del módulo
//
module.exports = oLugares;
