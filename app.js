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

var oRedis        = require('./src/bd/redis');
var oLugares      = require('./src/componentes/lugares');

// Inicializar variables
var puertoServer        = 3000;
var app                 = express();
var server              = http.createServer(app);

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

//
// Rutas
//
var routesPath = './src/routes';
app.use('/', require(routesPath + '/lugares'));

//
// Sockets
//
var socketsPath = './src/sockets';
require(socketsPath + '/lugares')(server);

//
// Inicio de servidor
//
server.listen( puertoServer, () => {
  console.log('Express Server REST corriendo en puerto ' + puertoServer + ': online');
});

//
// Inicialización de datos
//
oRedis.cliente.on('connect', () => {
  console.log('Cliente Redis conectado a ' + oRedis.host + ':' + oRedis.port); 
  oLugares.storeRedis();
});