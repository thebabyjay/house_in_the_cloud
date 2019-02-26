const express   = require('express');
const app       = express();
const http      = require('http').Server(app);
const fs        = require('fs');
// const http      = require('http');
const io        = require('socket.io')(http);
const Gpio      = require('pigpio').Gpio;

const writeData = {
    name: 'Jason',
    id: 21
}
let readData;

const PORT = 3000;

const digitalOn = 1;
const digitalOff = 0;
const remotes = [
    // id 0 is the onboard LEDS
    {
        id: 0,
        socket: null,
        red: new Gpio(17, { mode: Gpio.OUTPUT }),
        green: new Gpio(22, { mode: Gpio.OUTPUT }),
        blue: new Gpio(24, { mode: Gpio.OUTPUT }),
        groups: []
    }
];
const remoteTemplate = {
    id: null,
    socket: null,
    red: 0,
    green: 0,
    blue: 0,
    groups: []
}


app.use(express.static(__dirname));


// read and write pi and RGB values locally instead of using a database for now
const writeJson = async (filename, data) => {
    await fs.writeFile(filename, JSON.stringify(data, null, 4), err => {
        console.log(err);
    })
}

const readJson = async (filename) => {
    await fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            return console.log(err)
        }
        return JSON.parse(data);
    })
}

const updateRemote = (data) => {
    const { id, red, green, blue } = data;
    
    // change this remote pi's values in the global object
    remotes = remotes.map(r => {
        if (r.id === id) {
            r.red = red;
            r.green = green;
            r.blue = blue;
        }
        return r;
    });
}

const turnOnboardLedsOff = () => {
    const onboard = remotes.find(led => led.id === 0);
    onboard.red.digitalWrite(digitalOff);
    onboard.green.digitalWrite(digitalOff);
    onboard.blue.digitalWrite(digitalOff);
}

const changeOnboardLeds = (rgb) => {
    const onboard = remotes.find(led => led.id === 0);
    onboard.red.pwmWrite(rgb.red);
    onboard.green.pwmWrite(rgb.green);
    onboard.blue.pwmWrite(rgb.blue);
}

// listen for sockets
io.sockets.on('connection', (socket) => {
    // inital hit after connection
    socket.on('setId', data => {
        const { id } = data;

        // make sure this id is not in the global object already
        const idx = remotes.find(r => r.id === id);
        if (idx) {
            console.log('Duplicate remote ID found...')
        }

        // send back values for this id, if there are any
        
    })

    // update values for a remote pi
    socket.on('update', updateRemote);
})



/**
 * STARTUP FUNCTIONS
 */
turnOnboardLedsOff();

// start the main server 
app.listen(PORT, () => {
    console.log(`Boo-LED listening on port ${PORT}`);
})

// listen for ctrl + c
process.on('SIGINT', function () {
    turnOnboardLedsOff();
    process.exit();
});
