const http          = require('http').createServer();
const fs            = require('fs');
const io            = require('socket.io')(http)
const cors          = require('cors');
const deviceTypes   = require('./device/types')
const deviceCategories = require('./device/categories');
const deviceTemplates = require('./device/templates');

const isProduction = process.argv[2] === 'production';
const PORT = 3000;

const sockets = {};
let db = {};
// let db = {
//     "devices": {
//         "lights": [],
//         "switches": []
//     },
//     "scenes": [],
//     "groups": []
// };

cors();


/**
 * FUNCTIONS
 * @func writeJson
 * @func readJson
 * @func writeDbToFile
 * 
 */

 /**
  * @desc write JSON data to a given file
  * @param {string} filename 
  * @param {object} data 
  * @param {function} cb 
  */
const writeJson = (filename, data, cb) => {
    fs.writeFile(filename, JSON.stringify(data, null, 4), err => {
    	cb(err);
    })
}
/**
 * @desc read JSON data from a given file
 * @param {string} filename 
 * @param {function} cb 
 */
const readJson = (filename, cb) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            return cb(err, null);
        }
        return cb(null, JSON.parse(data));
        // return JSON.parse(data);
    })
}

/**
 * @desc write the local database out to a file to save it for data persistence
 */
const writeDb = () => {
	writeJson('./db.json', db, err => {
		if (err) {
			console.log(err);
		}
	})
}

/**
 * @desc read database from file
 * @desc whenever the database is read in (usually on server startup), all devices should be set to 'disconnected'
 */
const readDb = (socket, setDevicesAsDisconnected = false) => {
    readJson('db.json', (err, data) => {
        Object.keys(data.devices).forEach(deviceType => {
            data.devices[deviceType] = data.devices[deviceType].map(device => {
                device.connected = setDevicesAsDisconnected ? false : device.connected;
                return device;
            })
        })
        
        db = data;
        emitBrowserInit();
    })
}

const updateSatellites = deviceArr => {
    if (!isProduction) return;

    
    deviceArr.forEach(device => {
        console.log(sockets)
        console.log(`device id: ${device.id}`)
        console.log('\n\n\n')
        if (sockets[device.id]) {
            sockets[device.id].emit('update-satellite', { device })
        }
        // sockets[device.id] && sockets[device.id].emit('update-satellite', { device })
    })    
    emitBrowserInit();
}

const toggleDevice = data => {
    const { device } = data;
    const { deviceType } = device;
    let idx;
    switch(deviceType) {
        case deviceTypes.LIGHT_MULTICOLOR:
        case deviceTypes.LIGHT_UNICOLOR_DIMMABLE:
        case deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE:
            idx = db.devices.lights.findIndex(l => l.id === device.id);
            db.devices.lights[idx] = device;
            break;
        case deviceTypes.SWITCH:
            idx = db.devices.switches.findIndex(l => l.id === device.id);
            db.devices.switches[idx] = device;
            break;
        default:
            break;
    }
    updateSatellites([device])
    writeDb();
    emitBrowserInit();
}

const updateDevices = ({ devices }) => {
    if (!devices.length) return;

    devices.forEach(device => {
        const { deviceType } = device;
        let idx;
        switch(deviceType) {
            case deviceTypes.LIGHT_MULTICOLOR:
            case deviceTypes.LIGHT_UNICOLOR_DIMMABLE:
            case deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE:
                idx = db.devices.lights.findIndex(l => l.id === device.id);
                db.devices.lights[idx] = device;
                break;
            case deviceTypes.SWITCH:
                idx = db.devices.switches.findIndex(l => l.id === device.id);
                db.devices.switches[idx] = device;
                break;
            default:
                break;
        }
    })
    updateSatellites(devices)
    emitBrowserInit();
}









const emitBrowserInit = () => {
    io.emit('browser-init', { ...db });
}


/**
 * SOCKETS
 * 
 * -- INCOMING 
 * @event connection        - initial socket connection either from satellite or browser 
 * @event satellite-init    - initialize a satellite device
 * @event disconnect        - runs when a socket disconnects (satellite and browser)
 * 
 * @event create-scene
 * @event update-scene
 * @event delete-scene
 * 
 * @event update-devices
 * @event toggle-device
 * @event delete-device
 * 
 * @event read-database
 * 
 * -- OUTGOING
 * @event browser-init
 * @param devices { lights, switches}
 * @param scenes
 * @param groups
 * 
 * @event update-satellite
 * @param device { id, status, ative }
 * 
 * 
 */
io.sockets.on('connection', socket => {
    let clientType = 'browser'; // browser or satellite
    let macAddr;

    /**
     * SATELIITE PI CONNECTION SOCKETS
     */
    socket.on('satellite-init', data => {
        const { macAddr, satelliteName, deviceType, deviceCategory } = data;
        console.log(`${macAddr} connected`)

        connectionType = 'satellite';

        // console.log(data)

        // see if MAC address already exists
        try {
			const macIdx = db.devices[deviceCategory].findIndex(d => d.id === macAddr)
	        if (macIdx < 0) {
	            const temp = Object.assign({}, deviceTemplates[deviceType]);
	            temp.id = macAddr;
	            temp.name = satelliteName;
	            temp.connected = true;
	            db.devices[deviceCategory] = db.devices[deviceCategory].concat(temp);
	        } else {
	            db.devices[deviceCategory][macIdx].connected = true;
	        }

	        updateSatellites([db.devices[deviceCategory][macIdx]]);
	        sockets[macAddr] = socket;
        } catch (err) {
        	console.log(err)
        }
    })

    socket.on('disconnect', data => {
        if (clientType === 'satellite') {

        }
    })


    /**
     * BROWSER CONNECTION SOCKETS
     */
    emitBrowserInit();

    socket.on('update-devices', updateDevices);
    socket.on('toggle-device', toggleDevice);
    socket.on('read-db', readDb);
    
})



/**
 * STARTUP FUNCTIONS
 */
readDb(null, true);

// start the main server 
http.listen(PORT, () => {
    console.log(`House_in_the_Cloud listening on port ${PORT}`);
})

// listen for ctrl + c
process.on('SIGINT', function () {
    writeDb();
    
    // allow time for the database to write to the file
    setTimeout(() => { 
        process.exit();    
    }, 250);
    
});
