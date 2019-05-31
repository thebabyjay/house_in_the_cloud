const http          = require('http').createServer();       // creating the server
const fs            = require('fs');                        // reading and writing to files
const io            = require('socket.io')(http)            // creating a web socket
const cors          = require('cors');                      // used for security

const deviceTypes   = require('./device/types')             // SWITCH, LIGHT_MULTICOLOR, LIGHT_UNICOLOR, etc
const deviceCategories = require('./device/categories');    // LIGHT, SWITCH
const deviceTemplates = require('./device/templates');      // a database template for creating new instances

/**
 * since I am not hosting this, I use command line arguments to set dev or prod environment
 * dev is for when I am programming on a Windows machine
 * prod is for when I am running the program on the raspberry pi
 */
const isProduction = process.argv[2] === 'production';
const PORT = 3000;

const sockets = {};
let db = {};

// setup CORS
cors();


/**
 * FUNCTIONS
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
    })
}

/**
 * @desc write the local database out to a file 
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
 * @param {socket} socket holds the socket that made the request
 * @param {Boolean} setDevicesAsDisconnected tells the function whether to reset all devices to not connected or not
 */
const readDb = (setDevicesAsDisconnected = false) => {
    readJson('db.json', (err, data) => {
        Object.keys(data.devices).forEach(deviceType => {
            data.devices[deviceType] = data.devices[deviceType].map(device => {
                device.connected = setDevicesAsDisconnected ? false : device.connected;
                return device;
            })
        })
        
        // update the local database object
        db = data;
        emitBrowserInit();
    })
}

/**
 * @desc sends updated settings info to the devices that need to update (such as a light needing to change colors)
 * @param {Array} deviceArr 
 */
const updateSatellites = deviceArr => {
    if (!isProduction) return;

    deviceArr.forEach(device => {
        if (sockets[device.id]) {
            sockets[device.id].emit('update-satellite', { device })
        }
    })    

    // send new info to all connected clients
    emitBrowserInit();
}

// TODO: JB - merge toggle device wuth update devices since toggleDevice does not actually toggle a device as the device is toggled on the front end and sent to the server 
/**
 * @desc toggles one device (on or off) according to its device type
 * @param {Object} data 
 */
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

    // save the changes to the database
    writeDb();

    // update hardware devices when the user changes settings
    updateSatellites([device])
}

/**
 * @desc update device in the database
 * @param {Array} devices - a list of modifed devices
 */
const updateDevices = ({ devices }) => {
    if (!devices.length) return;

    devices.forEach(device => {
        if (!device) return;

        const { deviceType } = device;
        let idx;

        // set the active flag for each affected device
        device.active = true;

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
    
    // save the changes to the database
    writeDb();
    
    // update hardware devices when the user changes settings
    updateSatellites(devices)
}

/**
 * @desc run a selected scene (change devices in the selected scene)
 */
const runScene = (info) => {
    const { id: sceneId } = info;
    const tempscene = db.scenes.find(s => s.id === sceneId)
    const scene = Object.assign({}, tempscene);

    // get out if a scene does not exist
    if (!scene) {
        return console.log('scene not found')
    }

    updateDevices(scene);

    // get the full object for each device in a scene
    // const allDeviceList = Object.keys(db.devices).reduce((acc, deviceCat) => acc.concat(db.devices[deviceCat]), []);
    // scene.devices = scene.devices.map(d => {
    //     const device = allDeviceList.find(dev => dev.id === d.id);

    //     if (!device) return null;

    //     device.status = d.status;
    //     return device;

    //     switch(device.deviceType) {
    //         case deviceTypes.LIGHT_MULTICOLOR:
    //         case deviceTypes.LIGHT_UNICOLOR_DIMMABLE:
    //         case deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE:
    //             // device = db.devices.lights.find(l => l.id === d.id);
    //             device.status = d.status;
    //             break;
    //         case deviceTypes.SWITCH:
    //             // device = db.devices.switches.find(s => s.id === d.id);
    //             device.status = d.status;
    //             break;
    //         default:
    //             break;
    //     }
    //     // console.log(device)
    //     return device;
    // })

    // updateDevices(scene);
}

/**
 * @desc delete an existing scene
 */
deleteScene = ({ scene }) => {
    if (!scene) {
        return console.log('scene does not exist')
    }

    db.scenes = db.scenes.filter(s => s.id !== scene.id);
    writeDb();
    emitBrowserInit();
}

/**
 * @desc updates the details of a scene or adds a new scene if it does not exist
 */
const addOrUpdateScene = ({ scene }) => {
    if (!scene) {
        return console.log('no scene given in addOrUpdateScene');
    }

    // check if the scene has an ID and if it exists in the database
    const { id } = scene;
    if (!id || !db.scenes.find(s => s.id === id)) {
        // find a new id
        const highestId = db.scenes.reduce((acc, cur) => acc > cur.id ? acc : cur.id, 0);
        scene.id = highestId + 1;
        db.scenes = db.scenes.concat(scene);
    } else {
        // if it exists, just update it
        const sceneIdx = db.scenes.findIndex(s => s.id === id);
        db.scenes[sceneIdx] = scene;    
    }

    writeDb();
    emitBrowserInit();
}


/**
 * @desc emit the database to any connected client browsers 
 */
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
 * @event run-scene         - finds and updates devices in a scene
 * @event update-scene      - creates or updates an existing scene in the database
 * @event delete-scene      - removes a scene from the database
 * 
 * @event update-devices    - updates device info in the database
 * @event toggle-device     - turns a device on or off
 * @event delete-device ** NOT IMPLEMENTED
 * 
 * @event read-db           - reads in the local database file
 * 
 * -- OUTGOING
 * @event browser-init      - sends all required info to the client browser
 * @param devices { lights, switches}
 * @param scenes
 * @param groups
 * 
 * @event update-satellite  - sends all required info to a satellite device
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

	        sockets[macAddr] = socket;
	        updateSatellites([db.devices[deviceCategory][macIdx]]);
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
    socket.on('read-db', data => readDb(false));
    
    // SCENES
    socket.on('run-scene', runScene);
    socket.on('delete-scene', deleteScene);
    socket.on('update-scene', addOrUpdateScene);
    
})



/**
 * STARTUP FUNCTIONS
 */
readDb(true);   // read in the database and set all devices to disconnected

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
