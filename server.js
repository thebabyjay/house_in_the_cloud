const http      = require('http').createServer();
const fs        = require('fs');
const io        = require('socket.io')(http)
const cors      = require('cors');

cors();

const prod = process.argv[2] === 'production';

let Gpio;

if (prod) {
    Gpio = require('pigpio').Gpio;
}


const PORT = 3000;

const digitalOn = 1;
const digitalOff = 0;

const sockets = {};

let db = {};

// const db = {
//     lights: [
//         // id 1 is the onboard LEDS
//         {
//             id: 1,
//             name: `Jason's Room 16ft`,
//             active: false,
//             connected: false,
//             rgb: {
//                 red: 100,
//                 green: 0,
//                 blue: 0,
//             },
//             groups: []
//         }
//     ],
//     scenes: [
//         {
//             id: 1,
//             name: 'Bonne Nuit',
//             image: 'goodnight.jpg',
//             active: false,
//             lights: [
//                 {
//                     id: 1,
//                     rgb: {
//                         red: 0,
//                         green: 2,
//                         blue: 4
//                     }
//                 },
//                 {
//                     id: 'b8:27:eb:99:c7:3b',
//                     rgb: {
//                         red: 0,
//                         green: 2,
//                         blue: 4
//                     }
//                 },
//             ]
//         },
//         {
//             id: 2,
//             name: 'Bon Matin',
//             image: 'goodmorning.jpg',
//             active: false,
//             lights: [
//                 {
//                     id: 1,
//                     rgb: {
//                         red: 180,
//                         green: 160,
//                         blue: 150
//                     }
//                 },
//                 {
//                     id: 'b8:27:eb:99:c7:3b',
//                     rgb: {
//                         red: 180,
//                         green: 160,
//                         blue: 150
//                     }
//                 },
//             ]
//         }
//     ],
// }

let onboardLeds = {};
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
    connected: false,
    rgb: {
        red: 0,
        green: 0,
        blue: 0,
    },
    groups: []
}


// read and write pi and RGB values locally instead of using a database for now
const writeJson = (filename, data, cb) => {
    fs.writeFile(filename, JSON.stringify(data, null, 4), err => {
        if (err) {
            console.log(err);
        }
    })
}

const readJson = (filename, cb) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            return console.log(err)
        }
        cb(JSON.parse(data));
        // return JSON.parse(data);
    })
}


const updateRemote = (data) => {
    if (!prod) { return }

    const { lights, rgb } = data;
	
    if (lights.includes(1)) {
        changeOnboardLeds(rgb);
    }

    // change this remote pi's values in the global object
    const { red, green, blue } = rgb;
    db.lights = db.lights.map(l => {
        if (lights.includes(l.id)) {
            l.rgb.red = Number(red);
            l.rgb.green = Number(green);
            l.rgb.blue = Number(blue);
        }
        return l;
    });

    // filter out 1 since that is the onboard LED
    const affected = lights.filter(id => id !== 1);

    lights.forEach(id => {
        const lightIdx = db.lights.findIndex(l => l.id === id);
        db.lights[lightIdx].active = true;
        io.emit('update-light', {
            id,
            active: db.lights[lightIdx].active
        })
    })

    // send the value to all affected satellites
    affected.forEach(id => {
    	try {
			const lightIdx = db.lights.findIndex(l => l.id === id);
            sockets[id] && sockets[id].emit('change-leds', { rgb: db.lights[lightIdx].rgb, active: db.lights[lightIdx].active });
            db.lights[lightIdx].active = true;
            io.emit('update-light', {
                id,
                active: db.lights[lightIdx].active
            })
    	}
    	catch (e) {
    		console.log(e)
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

    io.emit('update-light', {
        id,
        active: db.lights[lightIdx].active
    })

    // set the light to off or its previous value (and take out ID 1 since that is the onboard strip)
    if (id === 1) {
    	return db.lights[lightIdx].active ? changeOnboardLeds(db.lights[lightIdx].rgb) : turnOnboardLedsOff();
    } 

    if (prod && sockets[id]) {
        sockets[id].emit('change-leds', { rgb: db.lights[lightIdx].rgb, active: db.lights[lightIdx].active });
    }
}

const runScene = data => {
	const { id } = data;
	const scene = db.scenes.find(scene => scene.id === id);

	const affectedLights = scene.lights;
	affectedLights.forEach(l => {
		const lightIdx = db.lights.findIndex(lit => lit.id === l.id);
        db.lights[lightIdx].active = true;
        db.lights[lightIdx].rgb = Object.assign({}, l.rgb);
        io.emit('update-light', {
            id: l.id,
            active: db.lights[lightIdx].active
        })

        if (l.id === 1) {
			return changeOnboardLeds(l.rgb);
		}

		sockets[l.id] && sockets[l.id].emit('change-leds', {
			rgb: l.rgb,
			active: true
		})
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
    let connectionType = 'browser';  // satellite or browser (change it if it is a satellite)
    let mac;

    /**
     * SATELLITE CONNECTION SOCKETS
     */
    
    // inital hit after connection
    socket.on('satellite-init', data => {
        const { macAddr, remoteName } = data;
        console.log(macAddr)

        connectionType = 'satellite';
        mac = macAddr;

        // see if MAC address already exists
        const macIdx = db.lights.findIndex(l => l.id === macAddr)
        if (macIdx < 0) {
            const temp = Object.assign({}, remoteTemplate);
            temp.id = macAddr;
            temp.name = remoteName;
            temp.connected = true;
            db.lights = db.lights.concat(temp);
        } else {
            db.lights[macIdx].connected = true;
        }

        sockets[macAddr] = socket;
    });

    socket.on('disconnect', (data, idk) => {
        if (connectionType === 'satellite') {
            // remove socket
            delete sockets[mac];
            // sockets = sockets[mac] = null;

            // set the `connected` flag to false
            const macIdx = db.lights.findIndex(l => l.id === mac);
            db.lights[macIdx].connected = false;
        }
    })
    
    
    
    
    /**
     * BROWSER CONNECTION SOCKETS
     */
    
    // send initial data
    socket.emit('browser-reset', { ...db })

    socket.on('update-lights', updateRemote);

    // socket.on('update-light-color', updateLightColor);

    socket.on('toggle-light-switch', updateLightStatus);

    socket.on('run-scene', runScene);

})



/**
 * STARTUP FUNCTIONS
 */
turnOnboardLedsOff();


readJson('db.json', data => {
    data.lights = data.lights.map(l => {
        if (l.id === 1) {
            return l;
        }
        
        l.connected = false;
        return l;
    })

    db = data;

    const connected = db.lights.filter(l => l.connected);
    connected.map(l => {
        updateRemote({
            lights: [l.id],
            rgb: l.rgb
        })
    })
})

// start the main server 
http.listen(PORT, () => {
    console.log(`Boo-LED listening on port ${PORT}`);
})

// listen for ctrl + c
process.on('SIGINT', function () {
    turnOnboardLedsOff();
    writeJson('db.json', db);
    setTimeout(() => {
        process.exit();    
    }, 250);
    
});
