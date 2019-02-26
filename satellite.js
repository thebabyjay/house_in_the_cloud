// var express = require('express');
// var app = express();
// let dbInitialValues = require('../assets/javascript/db_layout');
// var http = require('http').Server(app); //require http server, and create server with function handler()
// var fs = require('fs'); //require filesystem module
// var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
const socket = require('socket.io-client')('http://192.168.1.119');
console.log(socket)
// var admin = require('firebase-admin');
// var serviceAccount = require('../secrets/firebase-credentials.json')
// var secrets = require('../secrets/system');
const Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
    ledRed = new Gpio(2, {
        mode: Gpio.OUTPUT
    }),
    ledGreen = new Gpio(3, {
        mode: Gpio.OUTPUT
    }),
    ledBlue = new Gpio(4, {
        mode: Gpio.OUTPUT 
    });

socket.on('connection', function() {
	console.log('connected');
})

// for communicating with the attached Arduino over serial comm
// var SerialPort = require('serialport');
// var com = new SerialPort('/dev/ttyACM0', {
//     baudRate: 115200,
// }, function (err) {
//     if (err)
//         return console.log('Error: ', err.message);
// })

// com.on('data', function (data) {
//     // console.log(data.toString());
// })

// com.on('error', function (err) {
//     console.log('Error: ', err.message);
// })


// initialize app to use with Firebase
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://node-led.firebaseio.com"
// });


/*
VARIABLES
*/
// var port = 8080;
var on = 1;
var off = 0;
// var defaultDatabase = admin.database();
// let lights;
// let scenes;

/*
    STARTUP METHODS
*/

//RESET RGB LED
ledRed.digitalWrite(off); // Turn RED LED off
ledGreen.digitalWrite(off); // Turn GREEN LED off
ledBlue.digitalWrite(off); // Turn BLUE LED off


// var server = http.listen(port, () => {
//     var host = server.address().address;
//     var port = server.address().port;

//     console.log('Listening on port %s', port);
// })






/*
    FUNCTIONS   
*/



/*
    WEB SOCKETS
*/
// io.sockets.on('connection', (socket) => {

//     // send out required data to load the page
//     socket.emit('start', lights, scenes);

//     // return default db values
//     socket.on('initial-db-values', function () {
//         socket.emit('initial-db-values', dbInitialValues);
//     })

//     socket.on('run-scene', (id) => {
//         runScene(id);
//     })

// })




process.on('SIGINT', function () { //on ctrl+c
    ledRed.digitalWrite(off); // Turn RED LED off
    ledGreen.digitalWrite(off); // Turn GREEN LED off
    ledBlue.digitalWrite(off); // Turn BLUE LED off
    process.exit(); //exit completely
});

