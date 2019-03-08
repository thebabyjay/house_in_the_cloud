const os        = require('os');
const config    = require('./config.js');
const socket    = require('socket.io-client')(config.mainServerUrl);

// use MAC address as ID for each satellite
const macAddr = os.networkInterfaces().wlan0[0].mac;

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


/*
VARIABLES
*/
// var port = 8080;
var on = 1;
var off = 0;

/*
    STARTUP METHODS
*/

//RESET RGB LED
ledRed.digitalWrite(off); // Turn RED LED off
ledGreen.digitalWrite(off); // Turn GREEN LED off
ledBlue.digitalWrite(off); // Turn BLUE LED off





/*
    FUNCTIONS   
*/
const changeLeds = (rgb, active) => {
    if (active) {
        ledRed.pwmWrite(rgb.red);
        ledGreen.pwmWrite(rgb.green);
        ledBlue.pwmWrite(rgb.blue);
        return;
    }
    ledRed.pwmWrite(0);
    ledGreen.pwmWrite(0);
    ledBlue.pwmWrite(0);    
    
}


/*
    WEB SOCKETS
*/
socket.on('connect', function() {
    socket.emit('satellite-init', { 
        macAddr,
        remoteName: config.remoteName
    });
})

socket.on('satellite-init', data => {
    satelliteId = data.id;
})
// socket.on('info', function(data) {
//     console.log(data)
// })

socket.on('change-leds', function(data) {
    changeLeds(data.rgb, data.active);
    // const { lights, rgb } = data;

    // if (lights.includes(remoteId)) {
    //     changeLeds(rgb);
    // }
})

// socket.on('new-light-status', data => console.log(data))


process.on('SIGINT', function () { //on ctrl+c
    ledRed.digitalWrite(off); // Turn RED LED off
    ledGreen.digitalWrite(off); // Turn GREEN LED off
    ledBlue.digitalWrite(off); // Turn BLUE LED off
    process.exit(); //exit completely
});

