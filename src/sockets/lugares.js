/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 06-08-2018
 * @version 0.0.1
 * 
 * Sockets para lugares
 * 
 */

 //
 // Imports
 //
 var socketIO  = require('socket.io');

 var jsonRes      = require('../json-res');
 var oTemperatura = new (require('../componentes/temperatura'))();

 //
 // Módulo de sockets
 //
 module.exports = (server) => {

  clienteSocket = socketIO(server);
  clienteSocket.on('connection', function(socket) {

    socket.on('placesReq', req => {

      // oTemperatura.getDataFromService();
      oTemperatura.getDataFromDummy();

      let si = setInterval( () => {

        if (oTemperatura.estadoConsumoServicio !== null) {

          clearInterval(si);

          if (oTemperatura.estadoConsumoServicio === true) {
            socket.emit('placesRes', jsonRes.get(true, 'Lugares rescatados', oTemperatura.lugares));
          } else if (oTemperatura.estadoConsumoServicio === false) {
            socket.emit('placesRes', jsonRes.get(false, oTemperatura.errorConsumoServicio));
          }

        }

      }, 500 );

    });

  });

 };