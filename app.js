/**
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 * @since 31-07-2018
 * @version 0.0.1
 * 
 * Principal de Backend
 * 
 */

// Requires
var express     = require('express');
var bodyParser  = require('body-parser');

// Inicializar variables
var puertoExpress = 3000; //Puede ser cualquier puerto disponible 
var app           = express();

//
// Control CORS
//
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow.Methos", "PSOT, GET, PUT, DELETE, OPTIONS");
  next();
});

//
// Body Parser
//
app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                           // parse application/json

// Rutas
var routesPath = './src/routes';
app.use('/', require(routesPath + '/app'));

// Escuchar peticiones
app.listen( puertoExpress, () => {
  console.log('Express Server corriendo en puerto ' + puertoExpress + ': online');
});