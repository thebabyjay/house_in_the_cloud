const http      = require('http').createServer();
const fs        = require('fs');
const io        = require('socket.io')(http)
const cors      = require('cors');

const prod = process.argv[2] === 'production';

let Gpio;

if (prod) {
    Gpio = require('pigpio').Gpio;
}


const PORT = 3000;

const digitalOn = 1;
const digitalOff = 0;

const sockets = {};
const db = {
    lights: [
        // id 1 is the onboard LEDS
        {
            id: 1,
            name: `Jason's Room 16ft`,
            active: false,
            rgb: {
                red: 0,
                green: 0,
                blue: 0,
            },
            groups: []
        },
        {
            id: 2,
            name: `Jason's Room 4ft`,
            active: false,
            rgb: {
                red: 0,
                green: 0,
                blue: 0,
            },
            groups: []
        },
    ],
    scenes: [],
}

const onboardLeds = {};
if (prod) {
    onboardLeds = {
        red: new Gpio(17, { mode: Gpio.OUTPUT }),
        green: new Gpio(22, { mode: Gpio.OUTPUT }),
        blue: new Gpio(24, { mode: Gpio.OUTPUT }),
    }
}

    
const remoteTemplate = {
    id: null,
    name: ``,
    active: false,
    rgb: {
        red: 0,
        green: 0,
        blue: 0,
    },
    groups: []
}


// app.use(express.static(__dirname));


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
    if (!prod) { return }

    const { lights, rgb } = data;

    if (lights.includes(0)) {
        changeOnboardLeds(rgb);
    }

    // change this remote pi's values in the global object
    const { red, green, blue } = rgb;
    db.lights = db.lights.map(l => {
        if (lights.includes(l.id)) {
            l.red = red;
            l.green = green;
            l.blue = blue;
        }
        return l;
    });

    // send the value to all affected satellites
    lights.forEach(id => {
        if (sockets[id]) {
            sockets[id].emit('change-leds', { data })
        }
    })    
}


const updateLightStatus = data => {
    const { id } = data;
    const lightIdx = db.lights.findIndex(l => l.id === id);

    if (db.lights[lightIdx].active) {
        db.lights[lightIdx].active = false;
    } else {
        db.lights[lightIdx].active = true;
    }

    io.emit('new-light-status', {
        id,
        active: db.lights[lightIdx].active
    })
}


const turnOnboardLedsOff = () => {
    if (!prod) { return }

    onboardLeds.red.digitalWrite(digitalOff);
    onboardLeds.green.digitalWrite(digitalOff);
    onboardLeds.blue.digitalWrite(digitalOff);
}

const changeOnboardLeds = (rgb) => {
    if (!prod) { return }

    onboardLeds.red.pwmWrite(rgb.red);
    onboardLeds.green.pwmWrite(rgb.green);
    onboardLeds.blue.pwmWrite(rgb.blue);
}

// listen for sockets
io.sockets.on('connection', (socket) => {
    /**
     * SATELLITE CONNECTION SOCKETS
     */
    
    // inital hit after connection
    socket.on('setId', data => {
        const { id } = data;
        sockets[id] = socket;
    });
    
    socket.on('satellite-init', data => {
        console.log(data)
    });

    
    
    
    /**
     * BROWSER CONNECTION SOCKETS
     */
    
    // send initial data
    socket.emit('browser-reset', { ...db })

    socket.on('update', updateRemote);

    socket.on('update-light-status', updateLightStatus)
    


})



/**
 * STARTUP FUNCTIONS
 */
turnOnboardLedsOff();

// start the main server 
http.listen(PORT, () => {
    console.log(`Boo-LED listening on port ${PORT}`);
})

// listen for ctrl + c
process.on('SIGINT', function () {
    turnOnboardLedsOff();
    process.exit();
});
