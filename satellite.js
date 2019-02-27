const socket = require('socket.io-client')('http://192.168.1.119:3000');
const remoteId = 1;

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
const changeLeds = (rgb) => {
    ledRed.pwmWrite(rgb.red);
    ledGreen.pwmWrite(rgb.green);
    ledBlue.pwmWrite(rgb.blue);
}


/*
    WEB SOCKETS
*/
socket.on('connect', function() {
    socket.emit('init', { id: remoteId });
})

// socket.on('info', function(data) {
//     console.log(data)
// })

socket.on('change-leds', function(data) {
    const { lights, rgb } = data;

    if (lights.includes(remoteId)) {
        changeLeds(rgb);
    }
})




process.on('SIGINT', function () { //on ctrl+c
    ledRed.digitalWrite(off); // Turn RED LED off
    ledGreen.digitalWrite(off); // Turn GREEN LED off
    ledBlue.digitalWrite(off); // Turn BLUE LED off
    process.exit(); //exit completely
});

