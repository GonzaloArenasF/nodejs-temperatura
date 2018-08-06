/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 05-08-2018
 * @version 2018.0.1
 * 
 * Definición de procesos para redis
 * 
 */

//
// Importaciones
//
var redis = require('redis');

/**
 * Objeto a exportar
 */
var oRedis = {

  // Inicialización de variables
  port    : 6379,
  host    : '127.0.0.1',
  cliente : null

};

// Creación del cliente
oRedis.cliente = redis.createClient(oRedis.port, oRedis.host);
oRedis.cliente.on('error', (err) => {
  console.log(err);
});

/**
 * Almacenar en Redis
 * @param {string} key 
 * @param {any} value 
 */
oRedis.store = (key, value) => {
  oRedis.cliente.set(key, value, redis.print);
}

// 
// Exportación del módulo
//
module.exports = oRedis;