/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 31-07-2018
 * @version 0.0.1
 * 
 * Principal de Backend
 * 
 */

// Requires
var express       = require('express');
var cors          = require('cors')
var bodyParser    = require('body-parser');
var http          = require('http');
var socketIO      = require('socket.io');

// Inicializar variables
var puertoServer        = 3000;
var app                 = express();
var server              = http.createServer(app);
var io                  = socketIO(server);

var temperatura = require('./src/componentes/temperatura');

//
// Control CORS
//
app.use(cors({
  methods     : 'GET',
  origin      : 'http://localhost:3001',
  credentials : true
}));

//
// Body Parser
//
app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                           // parse application/json

// Rutas
var routesPath = './src/routes';
app.use('/', require(routesPath + '/app'));

// Sockets
io.on('connection', function(socket) {

  console.log('Una conexión estabecida', socket.id);

  socket.on('placeReq', req => {

    console.log('placeReq', req.place);

    if (req.place === 'cl')  { socket.emit('placeResCl:',  temperatura.places[0] ); }
    if (req.place === 'ch')  { socket.emit('placeResCh:',  temperatura.places[1] ); }
    if (req.place === 'nz')  { socket.emit('placeResNz:',  temperatura.places[2] ); }
    if (req.place === 'au')  { socket.emit('placeResAu:',  temperatura.places[3] ); }
    if (req.place === 'uk')  { socket.emit('placeResUk:',  temperatura.places[4] ); }
    if (req.place === 'usa') { socket.emit('placeResUsa:', temperatura.places[5] ); }
    
  });

});

// Inicio de servidor
server.listen( puertoServer, () => {
  console.log('Express Server REST corriendo en puerto ' + puertoServer + ': online');
});