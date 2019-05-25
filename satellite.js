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
console.log(macAddr)
const Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO

let ledRed, ledGreen, ledBlue, ledWhite, switchPin;

switch (config.deviceType) {
    case deviceTypes.LIGHT_MULTICOLOR:
        ledRed = new Gpio(2, { mode: Gpio.OUTPUT });
        ledGreen = new Gpio(3, { mode: Gpio.OUTPUT });
        ledBlue = new Gpio(4, { mode: Gpio.OUTPUT });
        break;
    case deviceTypes.LIGHT_UNICOLOR_DIMMABLE:
    case deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE:
        ledWhite = new Gpio(2, { mode: Gpio.OUTPUT });
        break;
    case deviceTypes.SWITCH:
        switchPin = new Gpio(2, { mode: Gpio.OUTPUT });
        break;
    default:
        break;
}


/*
VARIABLES
*/
// var port = 8080;
const ON = 1;
const OFF = 0;



/**
 *  FUNCTIONS  
 * 
 * @func handleSwitchChange                     for smart switches
 * @func handleLightUniColorNondimmableChange   for regular lights (on and off)
 * @func handleLightMultiColorChange            for RGB lights
 * @func handleLightUniColorDimmableChange      for single color lights that can use PWM
 */
const handleSwitchChange = (device) => {
    const { status, active } = device;

    try {
        if (!active) {
            return switchPin.analogWrite(OFF)
        }
        switchPin.analogWrite(status);
    } catch (err) {
        console.log(err)
    }
}

const handleLightUniColorNondimmableChange = (device) => {
    const { status, active } = device;

    try {
        if (!active) {
            return switchPin.analogWrite(OFF);
        }
        switchPin.analogWrite(ON);
    } catch (err) {
        console.log(err)
    }
    
    ledWhite.analogWrite(status);
}


const handleLightMultiColorChange = (device) => {
    try {
        if (!device.active) {
            ledRed.analogWrite(0);
            ledGreen.analogWrite(0);
            ledBlue.analogWrite(0);    
            return;
        }
        const { red, green, blue } = device.status;
        ledRed.pwmWrite(red);
        ledGreen.pwmWrite(green);
        ledBlue.pwmWrite(blue);
    } catch(err) {
        console.log(err)
    }
}

const handleLightUniColorDimmableChange = (device) => {
    const { status, active } = device;

    try {
        if (!active) {
            return ledWhite.pwmWrite(OFF);
        }
        ledWhite.pwmWrite(status);
    } catch (err) {
        console.log(err)
    }
    
}




const updateDevice = device => {
    switch(device.deviceType) {
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
        default: 
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
    satelliteId = data.id;
})
// socket.on('info', function(data) {
//     console.log(data)
// })

// socket.on('change-leds', function(data) {
socket.on('update-satellite', function(data) {
    const { device } = data;
    const { id: mac } = device;
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

