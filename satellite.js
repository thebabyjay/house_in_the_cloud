const os            = require('os');
const config        = require('./config.js');
const socket        = require('socket.io-client')(config.mainServerUrl);
const deviceTypes   = require('./device/types');

// use MAC address as ID for each satellite
// const macAddr = os.networkInterfaces().wlan0[0].mac;

let macAddr = null;
if (['x64', 'x32'].includes(os.arch())) {
    const interfaces = os.networkInterfaces();
    if (interfaces.Wifi) {
        macAddr = os.networkInterfaces().Wifi[0].mac
    } else {
        macAddr = os.networkInterfaces().Ethernet[0].mac
    }
} else {
    macAddr = os.networkInterfaces().wlan0[0].mac;
}
// const Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
//     ledRed = new Gpio(2, {
//         mode: Gpio.OUTPUT
//     }),
//     ledGreen = new Gpio(3, {
//         mode: Gpio.OUTPUT
//     }),
//     ledBlue = new Gpio(4, {
//         mode: Gpio.OUTPUT 
//     });


/*
VARIABLES
*/
// var port = 8080;
var on = 1;
var off = 0;



/*
    FUNCTIONS   
*/
const turnDeviceOff = () => {
    // ledRed.digitalWrite(off); // Turn RED LED off
    // ledGreen.digitalWrite(off); // Turn GREEN LED off
    // ledBlue.digitalWrite(off); // Turn BLUE LED off
}

const handleSwitchChange = (device) => {

}

const handleLightMultiColorChange = (device) => {
    const { red, green, blue } = device.status;
    ledRed.pwmWrite(red);
    ledGreen.pwmWrite(green);
    ledBlue.pwmWrite(blue);
}

const handleLightUniColorDimmableChange = (device) => {
    const { status } = device;
    ledRed.pwmWrite(status);
    ledGreen.pwmWrite(status);
    ledBlue.pwmWrite(status);
}

const handleLightUniColorNondimmableChange = (device) => {
    const { status } = device;
    ledRed.analogWrite(status);
}



const updateDevice = device => {
    switch(device.type) {
        case deviceTypes.SWITCH:
            handleSwitchChange(device);
            break;
        case deviceTypes.LIGHT_MULTICOLOR:
            handleLightMultiColorChange(device);
            break;
        case deviceTypes.LIGHT_UNICOLOR_DIMMABLE:
            handleLightUniColorDimmableChange(device);
            break;
        case deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE:
            handleLightUniColorNondimmableChange(device);
            break;

    }
}

// const changeLeds = (rgb, active) => {
//     if (active) {
//         ledRed.pwmWrite(rgb.red);
//         ledGreen.pwmWrite(rgb.green);
//         ledBlue.pwmWrite(rgb.blue);
//         return;
//     }
//     ledRed.pwmWrite(0);
//     ledGreen.pwmWrite(0);
//     ledBlue.pwmWrite(0);    
// }


/*
    WEB SOCKETS
*/
socket.on('connect', function() {
    console.log('connected')
    socket.emit('satellite-init', { 
        macAddr,
        satelliteName: config.satelliteName,
        deviceType: config.deviceType,
        deviceCategory: config.deviceCategory
    });
})

socket.on('satellite-init', data => {
    console.log('response', data)
    satelliteId = data.id;
})
// socket.on('info', function(data) {
//     console.log(data)
// })

// socket.on('change-leds', function(data) {
socket.on('update-satellite', function(data) {
    const { mac, device } = data;
    console.log(data)
    if (mac === macAddr) {
        updateDevice(device);
    }
    // changeLeds(data.rgb, data.active);
})

// socket.on('new-light-status', data => console.log(data))


/*
    STARTUP METHODS
*/

//RESET RGB LED
turnDeviceOff();




process.on('SIGINT', function () { //on ctrl+c
    turnDeviceOff();
    process.exit(); //exit completely
});

