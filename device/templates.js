const deviceTypes = require('./types');
const deviceCategories = require('./categories');

const templates = {
    LIGHT_UNICOLOR_DIMMABLE: {
        id: null,
        name: null,
        deviceType: deviceTypes.LIGHT_UNICOLOR_DIMMABLE,
        deviceCategory: deviceCategories.LIGHT,
        active: false,
        connected: false,
        status: 0,  // OFF = 0, ON = 1-255
    },
    LIGHT_UNICOLOR_NONDIMMABLE: {
        id: null,
        name: null,
        deviceType: deviceTypes.LIGHT_UNICOLOR_NONDIMMABLE,
        deviceCategory: deviceCategories.LIGHT,
        active: false,
        connected: false,
        status: 0,  // OFF = 0, ON = 1
        
    },
    LIGHT_MULTICOLOR: {
        id: null,
        name: null,
        deviceType: deviceTypes.LIGHT_MULTICOLOR,
        deviceCategory: deviceCategories.LIGHT,
        active: false,
        connected: false,
        status: {   // 0 - 255 for each color
            red: 0,
            green: 0,
            blue: 0
        }
    },
    SWITCH: {
        id: null,
        name: null,
        deviceType: deviceTypes.SWITCH,
        deviceCategory: deviceCategories.SWITCH,
        active: false,
        connected: false,
        status: 0,  // OFF = 0, ON = 1
    },
}

module.exports = templates;