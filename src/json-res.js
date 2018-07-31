/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 31-07-2018
 * @version 2018.0.1
 * 
 * Definición de la respuesta genérica de backend
 * 
 */

var jsonRes = {};

/**
 * Retorna el jSon genérico para respuestas de servicios
 * 
 * @param {boolean} est 
 * @param {string} msg 
 * @param {object} det 
 */
jsonRes.set = (est, msg, det = null) => {

  if (typeof(est) !== 'boolean') { return false };
  if (typeof(msg) !== 'string') { return false };

  var res = {
    estado    : est,
    mensaje   : msg
  }

  if (det !== null && typeof(det) === 'object') {
    res.detalle = det;
  };

  return res;

}

module.exports = jsonRes;