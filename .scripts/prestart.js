const fs = require("fs");

const CONFIG_DB_FILE_URL = "setup/db.json";
const LIVE_DB_FILE_URL = "db.json";

/**
 * @desc write JSON data to a given file
 * @param {string} filename
 * @param {object} data
 * @param {function} cb
 */
const writeJson = (filename, data, cb) => {
  fs.writeFile(filename, JSON.stringify(data, null, 4), err => {
    cb(err);
  });
};

/**
 * @desc read JSON data from a given file
 * @param {string} filename
 * @param {function} cb
 */
const readJson = (filename, cb) => {
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      return cb(err, null);
    }
    return cb(null, JSON.parse(data));
  });
};

const createNewDatabase = async () => {
  readJson(CONFIG_DB_FILE_URL, (error, db) => {
    if (error) {
      throw "config file does not exist... HELP!!!";
    }

    // config file exists... writing to the root directory
    writeJson(LIVE_DB_FILE_URL, db, (err, data) => {
      if (err) {
        throw err;
      }

      // transaction successful
    });
  });
};

const detetermineIfFileExists = async () => {
  readJson(LIVE_DB_FILE_URL, (error, data) => {
    if (error) {
      // no db exists... creating a new one
      console.log("CREATING A NEW DATABASE FILE");
      createNewDatabase();
    }

    // database exists... ignoring
  });
};

detetermineIfFileExists();
