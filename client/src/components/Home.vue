 <template>
  <div class="wrapper" :class='{ "no-scroll": showUpdateSceneModal || showDeleteSceneModal }'>
    <div class="header">
      <div>
        <h1 @click='toggleHeaderActionBar'>House in the Cloud</h1>
      </div>
    </div>
    <!-- hidden button to re-read the database in -->
    <div class='header-actions' v-if='showHeaderActions'>
        <button class='header-action-btn' @click='readDb'>Read DB</button>
    </div>

    <div class='spacer-50' />

    <!-- Modal for scenes -->
    <div class='modal' v-if='showUpdateSceneModal || showDeleteSceneModal'>
      <div class="modal-body">
        <button class="modal-exit-btn" @click='handleModalClose'>
          <v-icon>close</v-icon>
        </button>

        <!-- update or create a scene -->
        <scene-update 
        v-if='showUpdateSceneModal'
        :scene='sceneToModify'
        :handleCancel='handleModalClose'
        :handleConfirm='handleUpdateScene'
        :devices='devices'
        />

        <!-- confirmation for deleting a scene -->
        <scene-delete
        v-if='showDeleteSceneModal'
        :scene='sceneToModify'
        :handleCancel='handleModalClose'
        :handleConfirm='handleDeleteScene'
        />
      </div>
    </div>

    <div>
      
      <!-- showing all devices -->
      <div class='section'>
        <h1>Devices</h1>
        <device-switches
        :devices='devices'
        :showSwitch='true'
        :handleClick='handlePowerSwitchClick'
        :connectedDevices='connectedDevices'
        :switchesActivated='switchesActivated'
        />
      </div>

      <!-- showing all connected multi-color lights -->
      <div class="section">
        <h1>Custom Lighting</h1>
        <v-container>
          <v-layout row wrap justify-center>
            <multi-color-light-checkbox
              v-for='mcLight in connectedMultiColorLights' 
              :key='`light_color_${mcLight.id}`' 
              :light='mcLight' 
              :selected='selectedMultiColorLights.find(l => l.id === mcLight.id) ? true : false'
              :handleLightClick='handleMultiColorLightCheckboxClick'
            />
          </v-layout>
          <div style='margin-top: 25px'>
            <button class='set-selected-lights-btn' @click='setSelectedLightsToCurrentColor'>
              Set selected lights to this color
            </button>
          </div>
        </v-container>
        
        <rgb-sliders
        :redSliderValue='redSliderValue'
        :greenSliderValue='greenSliderValue'
        :blueSliderValue='blueSliderValue'
        :handleChange='handleRgbSliderChange'
        />
      </div>
      
      <!-- Scenes -->
      <div class="section">
        <div style='display: flex; flex-direction: row; justify-content: center;'>
          <h1>Scenes</h1>
          <button class='add-btn' style='margin-left: 15px;' @click='handleShowSceneUpdate'>
            <v-icon style='color: white; font-size: 30px;'>add_circle_outline</v-icon>
          </button> 
        </div>
        <v-container>
          <v-layout row wrap justify-center>
            <scene 
              v-for='scene in scenes'
              :key='`scene_${scene.id}`'
              :scene='scene'
              :handleSceneClick='handleSceneClick'
              :handleShowSceneUpdate='handleShowSceneUpdate'
              :handleShowSceneDelete='handleShowSceneDelete'
            />
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import DeviceSwitches from './DeviceSwitches';
import SceneUpdate from './scene/SceneUpdate';
import SceneDelete from './scene/SceneDelete';
import MultiColorLightCheckbox from './MultiColorLightCheckbox';
import Scene from './scene/Scene';
import RgbSliders from './RgbSliders';

export default {
  name: 'Home',
  components: {
    DeviceSwitches,
    SceneUpdate,
    SceneDelete,
    MultiColorLightCheckbox,
    Scene,
    RgbSliders,
  },
  data() {
    const mainServerUrl = `${window.location.hostname}:3000`
    return {
      socket: io(mainServerUrl),      // creates websocket connection
      db: {},

      selectedMultiColorLights: [],   // handling multicolor lights when RGB sliders move
      showHeaderActions: false,

      redSliderValue: 0,
      greenSliderValue: 0,
      blueSliderValue: 0,

      // MODAL INFO
      showUpdateSceneModal: false,
      showDeleteSceneModal: false,
      sceneToModify: {},
    }
  },

  computed: {
    devices: function() {
      return this.lights.concat(this.switches);
    },
    lights: function() {
      return this.db.devices ? this.db.devices.lights : [];
    },
    switches: function() {
      return this.db.devices ? this.db.devices.switches : [];
    },
    scenes: function() {
      return this.db.scenes || [];
    },
    groups: function() {
      return this.db.groups || [];
    },

    scenes: function() {
      return this.db.scenes || [];
    },
    

    // filter out disconnected devices
    connectedDevices: function() {
      const connectedLights = this.lights.filter(l => l.connected);
      const conenctedSwitches = this.switches.filter(s => s.connected);

      return connectedLights
        .concat(conenctedSwitches);
    },
    connectedLights: function() {
      return this.lights.filter(l => l.connected);
    },
    connectedMultiColorLights: function() {
      return this.connectedLights.filter(cl => cl.deviceType === 'LIGHT_MULTICOLOR');
    },
    switchesActivated: function() {
      const activated = this.connectedDevices.filter(cd => cd.active)
      return activated;
    }

  },

  mounted() {
    // re-instantiate the lights and scenes
    this.socket.on('browser-init', data => {
      this.db = data;
    })
  },

  methods: {
    // send request to server to update affected satellite devices
    updateMultiColorLights: function() {
      this.selectedMultiColorLights = this.selectedMultiColorLights.map(mcl => {
        const { redSliderValue, greenSliderValue, blueSliderValue } = this;
        mcl.status = {
          red: redSliderValue,
          green: greenSliderValue,
          blue: blueSliderValue
        }
        return mcl;
      })

      this.socket.emit('update-devices', { devices: this.selectedMultiColorLights });
    },

    // sets any selected multi-color lights to the current RGB slider values
    setSelectedLightsToCurrentColor: function() {
      this.updateMultiColorLights();
    },

    // shows hidden action bar by pressing on the page banner
    toggleHeaderActionBar: function() {
      this.showHeaderActions = !this.showHeaderActions;
    },

    // tells the server to re-read the database in from file
    readDb: function() {
      this.socket.emit('read-db');
    },
    

    // deleteLight: function(id) {
    //   this.socket.emit('delete-light', {
    //     id
    //   })
    // },

    // updateLight: function(light) {
    //   this.socket.emit('update-light', {
    //     light
    //   })
    // },

    // toggles a device and updates the satellite
    handlePowerSwitchClick: function(device) {
      device.active = !device.active;
      this.socket.emit('toggle-device', { device });
    },
    
    // handles multi-color light clicks (getting RGB settings for the sliders)
    handleMultiColorLightCheckboxClick: function(light) {

      // hold all lights being changed locally
      const found = this.selectedMultiColorLights.find(l => l.id === light.id);


      if (!found) {
        this.selectedMultiColorLights = this.selectedMultiColorLights.concat(light);

        // get this light's last known RGB value
        const { red, green, blue } = light.status;
        this.redSliderValue = red;
        this.greenSliderValue = green;
        this.blueSliderValue = blue;
        return;
      } 
      
      this.selectedMultiColorLights = this.selectedMultiColorLights.filter(sl => sl.id !== light.id);

      // get the previously selected light's last known RGB value
      if (!this.selectedMultiColorLights.length) {
        this.redSliderValue = 0;
        this.greenSliderValue = 0;
        this.blueSliderValue = 0;
      } else { 
        const previousSelectedLight = this.selectedMultiColorLights[this.selectedMultiColorLights.length - 1];
        const { red, green, blue } = previousSelectedLight.status;
        this.redSliderValue = red;
        this.greenSliderValue = green;
        this.blueSliderValue = blue;
      }
    },

    // change lights when RGB sliders move
    handleRgbSliderChange: function(color, value) {
      if (value < 0 || value > 255) return;

      if (color === 'red') this.redSliderValue = value;
      if (color === 'green') this.greenSliderValue = value;
      if (color === 'blue') this.blueSliderValue = value;
      this.updateMultiColorLights();
    },
    
    // run a scene
    handleSceneClick: function(id) {
      this.socket.emit('run-scene', { id });
    },

    // handleShowSceneCreate: function(evt, scene) {
    //   evt.cancelBubble = true;
    //   this.showCreateSceneModal = true;
    // },

    // open the modal to create/update a scene
    handleShowSceneUpdate: function(evt, scene) {
      evt.cancelBubble = true;
      this.sceneToModify = scene || null
      this.showUpdateSceneModal = true;
    },

    // open the delete confirmation modal
    handleShowSceneDelete: function(evt, scene) {
      evt.cancelBubble = true;
      this.sceneToModify = scene;
      this.showDeleteSceneModal = true;
    },

    // delete a scene
    handleDeleteScene: function(scene) {
      this.socket.emit('delete-scene', { scene })
      this.handleModalClose();
    },

    // TODO: JB - add name validation for updating a scene (make sure it doesn't already exist)
    // update a scene
    handleUpdateScene: function(scene) {
      this.socket.emit('update-scene', { scene });
      this.handleModalClose();
    },

    handleModalClose: function() {
      this.showUpdateSceneModal = false;
      this.showDeleteSceneModal = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  /* padding-top: 50px; */
  color: white;
  position: relative;
  min-height: 100vh;
  padding-bottom: 30px;
}

/**
  HEADER
*/
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid white;
  padding: 10px;
}

.header-actions {
  margin-top: 10px;
}

.spacer-50 {
  margin-bottom: 50px;
}
  
.header-action-btn{
  margin: 5px;
  border: 1px solid #fafafa;
  padding: 10px;
  border-radius: 5px;
}

.header-action-btn:hover {
  background-color: rgba(255,255,255,0.2);
}

.header-action-btn-active {
  background-color: rgba(41, 111, 250, 0.8);
}


/**
  SECTIONS (each card relating to a feature or group of devices)
*/
.section {
  width: 95%;
  margin: 30px auto;
  padding: 10px;
  border: 1px solid rgb(200,200,200);
  background-color: #373b44;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(255,255,255,0.2);
}



/**
  EDIT and CREATE panels
*/

.acc-edit-row{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.panel-action-btn {
  margin: 5px;
  border: 1px solid #fafafa;
  padding: 10px;
  border-radius: 5px;
}
.panel-action-btn:hover {
  background-color: rgba(255,255,255,0.2);
}

.remove-icon,
.save-icon {
  font-size: 30px;
}

.remove-icon:hover {
  color: rgba(255,100,100,0.8);
}
.save-icon:hover {
  color: rgba(100,225,100,0.8);
}

.panel-delete-btn {
  border: 1px solid red;
  border-radius: 50%;
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.panel-delete-btn:hover {
  background-color: rgba(255,100,100, 0.8);
  color: black;
}
.panel-delete-btn-text {
  position: absolute;
  font-family: serif;
  font-size: 20px;
}

.edit-accessory-input {
  padding: 5px;
  border: 1px solid #fafafa;
  border-radius: 5px;
  margin: 0 10px;
}

.create-acc-input {
  padding: 5px;
  border-bottom: 1px solid #fafafa;
  margin: 0 10px;
}

.create-scene-light-container {
  border: 1px solid #fafafa;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
}
.create-scene-light-container:hover {
  background-color: rgba(255,255,255,0.3);
  cursor: pointer;
}
.light-selected {
    border: 1px solid rgba(20,230,20, 0.7);
}

.create-btn {
  border: 1px solid black;
  padding: 10px;
  background-color: rgba(100,225,100,0.8);
  border-radius: 5px;
}




/**
  LIGHTS
*/

.switch-disabled {
	pointer-events: none;
	opacity: 0.5;
}

.set-selected-lights-btn {
  border: 1px solid white;
  background-color: rgba(255,255,255,0.1);
  padding: 10px;
  border-radius: 5px;
}
.set-selected-lights-btn:hover {
  background-color: rgba(255,255,255,0.2);
}




/**
  SLIDERS
*/

.slider-icon {
  height: 35px;
  margin: 10px;
}
.slider-icon:first-of-type {
  fill: rgba(255, 255, 137, 0.694);
}
.slider-icon:nth-of-type(2) {
  fill: rgb(255, 255, 108);
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin: 15px 0;
}

.slider:hover {opacity: 1;}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}
#redSlider::-webkit-slider-thumb {background: red;}
#redSlider::-moz-range-thumb {background: red;}
#greenSlider::-webkit-slider-thumb {background: green;}
#greenSlider::-moz-range-thumb {background: green;}
#blueSlider::-webkit-slider-thumb {background: blue;}
#blueSlider::-moz-range-thumb {background: blue;}
#brightnessSlider::-webkit-slider-thumb {background: rgb(255, 255, 108);}
#brightnessSlider::-moz-range-thumb {background: rgb(255, 255, 108);}

.slider-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.slider-value-change-btn {
  background: rgba(0,0,0,0.2);
  margin: 10px;
  padding: 5px;
  border-radius: 4px;
}
.slider-value-change-btn i { 
  color: white;
}



/**
  MODALS
*/
.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  min-height: 100%;
  z-index: 5;
  background-color: rgba(0,0,0,0.8);
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

/*.modal-extra-container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
*/
.modal-body {
  position: relative;
  /*flex: 1;*/
  width: 90%;
  background-color: #272a31;
  padding: 25px;
  border-radius: 15px;
  overflow-y: scroll;
}

.no-scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.modal-exit-btn {
  position: absolute;
  margin-top: 10px;
  margin-right: 10px;
  top: 0;
  right: 0;
  bottom: 1;
  left: 1;
}
.modal-exit-btn i {
  color: white;
}
</style>
