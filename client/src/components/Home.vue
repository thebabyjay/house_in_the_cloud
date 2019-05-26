 <template>
  <div class="wrapper" :class='{ "no-scroll": showUpdateSceneModal || showDeleteSceneModal }'>
    <div class="header">
      <div>
        <h1 @click='toggleHeaderActionBar'>House in the Cloud</h1>
      </div>
    </div>
    <div class='header-actions' v-if='showHeaderActions'>
        <button class='header-action-btn' @click='readDb'>Read DB</button>
        <!-- <button class='header-action-btn' :class='{ "header-action-btn-active": showCreatePanel }' @click='() => showCreatePanel = !showCreatePanel'>Create</button> -->
        <!-- <button class='header-action-btn' :class='{ "header-action-btn-active": showEditPanel }' @click='() => showEditPanel = !showEditPanel'>Edit</button> -->
    </div>

    <div class='spacer-50' />

    <!-- <div v-if='showEditPanel' style='border-bottom: 1px solid white; margin-bottom: 25px;padding-bottom: 25px;'>
      <h3 style='margin-bottom: 15px;'>Mode:Edit</h3>
      <section>
        <h5>Lights</h5>
        <div v-for='light in lights' :key='"edit-light-" + light.id' class='acc-edit-row'>
          <button @click='() => deleteLight(light.id)'><i class="material-icons remove-icon">remove_circle_outline</i></button>
          <input type='text' class='edit-accessory-input' v-model='light.name' />
          <button @click='() => updateLight(light)'><i class="material-icons save-icon">check_circle_outline</i></button>
        </div>
      </section>
      <section style='margin-top: 30px;'>
        <h5>Scenes</h5>
        <div v-for='scene in scenes' :key='"edit-scene-" + scene.id' class='acc-edit-row'>
          //<button @click='() => deleteScene(scene.id)'><i class="material-icons remove-icon">remove_circle_outline</i></button>
          <input type='text' class='edit-accessory-input' v-model='scene.name' />
          <button @click='() => updateScene(scene)'><i class="material-icons save-icon">check_circle_outline</i></button>
        </div>
      </section>
    </div> -->

    <!-- <div v-if='showCreatePanel'  style='border-bottom: 1px solid white; margin-bottom: 25px;padding-bottom: 25px;'>
      <h3 style='margin-bottom: 15px;'>Mode:Create</h3>
      <form @submit='evt => evt.preventDefault()'>
        <input required v-model='createSceneObj.name' class='create-acc-input' placeholder='Scene name'/>

        <v-container>
          <h4>Available lights</h4>
          <v-layout row wrap justify-center align-center>
            <v-flex xs4 sm3 md2 v-for='light in lights' :key='"create-scene-" + light.id' class='create-scene-light-container' @click='() => {
              if (createSceneObj.lights.find(l => l.id === light.id)) {
                createSceneObj.lights = createSceneObj.lights.filter(l => l.id !== light.id)
                createSceneObj.activeLights = createSceneObj.activeLights.filter(l => l.id !== light.id);
                return;
              }  
              createSceneObj.lights = createSceneObj.lights.concat(light);
            }'>
              {{ light.name }}
            </v-flex>

          </v-layout>

          <h4 style='margin-top: 20px;'>Selected Lights</h4>
          <v-layout row wrap justify-center align-center>
            <v-flex 
            xs4 
            sm3 
            md2 
            v-for='light in createSceneObj.lights' 
            :key='"create-scene-" + light.id' 
            class='create-scene-light-container' 
            :class='{ "light-selected": createSceneObj.activeLights.find(l => l.id === light.id) }' 
            @click='() => {
              if (createSceneObj.activeLights.find(l => l.id === light.id)) {
                createSceneObj.activeLights = createSceneObj.activeLights.filter(l => l.id !== light.id)
                return;
              }
              createSceneObj.activeLights = createSceneObj.activeLights.concat(light)
            }'
            >              
              {{ light.name }}
            </v-flex>
          </v-layout>
        </v-container>

        <v-container>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ createSceneObj.rSliderVal }}
            </v-flex>	
            <v-flex xs11>
              <input type="range" min="0" max="255" v-model='createSceneObj.rSliderVal' class="slider" id="redSlider">
            </v-flex>
          </v-layout>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ createSceneObj.gSliderVal }}
            </v-flex>	
            <v-flex xs11>
              <input type="range" min="0" max="255" v-model='createSceneObj.gSliderVal' class="slider" id="greenSlider">
            </v-flex>
          </v-layout>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ createSceneObj.bSliderVal }}
            </v-flex>	
            <v-flex xs11>
              <input type="range" min="0" max="255" v-model='createSceneObj.bSliderVal' class="slider" id="blueSlider">
            </v-flex>
          </v-layout>
        </v-container>
        
        <button class='create-btn' @click='createScene()' >Create!</button>
        <p style='margin-top: 10px;' v-text='createSceneMessage'></p>
      </form>
    </div> -->

    <div class='modal' v-if='showUpdateSceneModal || showDeleteSceneModal'>
      <div class="modal-body">
        <!-- close button for all modals -->
        <button class="modal-exit-btn" @click='handleModalClose'>
          <v-icon>close</v-icon>
        </button>

        <scene-update 
        v-if='showUpdateSceneModal'
        :scene='sceneToModify'
        :handleCancel='handleModalClose'
        :handleConfirm='handleUpdateScene'
        :connectedDevices='connectedDevices'
        />

        <scene-delete
        v-if='showDeleteSceneModal'
        :scene='sceneToModify'
        :handleCancel='handleModalClose'
        :handleConfirm='handleDeleteScene'
        />
      </div>
    </div>  

    <div>
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

        <!-- <v-container style='padding-top: 0'>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ redSliderValue }}
            </v-flex>	
            <v-flex xs11 class='slider-row'>
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('red', redSliderValue - 1)">
                <v-icon>keyboard_arrow_left</v-icon>
              </button>
              <input @input='evt => handleRgbSliderChange("red", parseInt(evt.target.value))' type="range" min="0" max="255" :value='redSliderValue' class="slider" id="redSlider">
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('red', redSliderValue + 1)">
                <v-icon>keyboard_arrow_right</v-icon>
              </button>
            </v-flex>
          </v-layout>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ greenSliderValue }}
            </v-flex>	
            <v-flex xs11 class='slider-row'>
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('green', greenSliderValue - 1)">
                <v-icon>keyboard_arrow_left</v-icon>
              </button>
              <input @input='evt => handleRgbSliderChange("green", parseInt(evt.target.value))' type="range" min="0" max="255" v-model='greenSliderValue' class="slider" id="greenSlider">
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('green', greenSliderValue + 1)">
                <v-icon>keyboard_arrow_right</v-icon>
              </button>
            </v-flex>
          </v-layout>
          <v-layout row justify-center align-center>
            <v-flex xs1>
              {{ blueSliderValue }}
            </v-flex>	
            <v-flex xs11 class='slider-row'>
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('blue', blueSliderValue - 1)">
                <v-icon>keyboard_arrow_left</v-icon>
              </button>
              <input @input='evt => handleRgbSliderChange("blue", parseInt(evt.target.value))' type="range" min="0" max="255" v-model='blueSliderValue' class="slider" id="blueSlider">
              <button class='slider-value-change-btn' @click="() => handleRgbSliderChange('blue', blueSliderValue + 1)">
                <v-icon>keyboard_arrow_right</v-icon>
              </button>
            </v-flex>
          </v-layout>
        </v-container> -->
      </div>
      
      <div class="section">
        <h1>Scenes</h1>
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
              <!-- :selected='selectedScenes.includes(scene.id)' -->
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
      socket: io(mainServerUrl),
      db: {},

      selectedMultiColorLights: [],
      showHeaderActions: false,
      // lights: [],
      // scenes: [],
      // groups: [],
      // allLights: [],
      // connectedLights: [],
      // switchesToggledOn: [],
      selectedScenes: [],

      // createLightObj: {
      //   id: null,
      //   name: '',
      //   active: false,
      //   connected: false,
      //   rgb: {
      //     red: 0,
      //     green: 0,
      //     blue: 0
      //   },
      //   groups: []
      // },
      // createSceneObj: {
      //   id: null,
      //   name: '',
      //   image: '',
      //   active: false,
      //   lights: [],

      //   // these will be filtered out when sent to the backend
      //   activeLights: [],
      //   rSliderVal: 0,
      //   gSliderVal: 0,
      //   bSliderVal: 0,
      // },
      // createSceneMessage: '',
      // createGroupObj: {

      // },

      redSliderValue: 0,
      greenSliderValue: 0,
      blueSliderValue: 0,
      // brightnessSliderValue: 0,

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
        // .map(cd => cd.id);
      // console.log(this.connectedDevices)
      return activated;
    }

  },

  watch: {
    // redSliderValue: function(val) {
    //   this.updateMultiColorLights();
    //   console.log('hello')
    // },
    // greenSliderValue: function(val) {
    //   this.updateMultiColorLights();
    // },
    // blueSliderValue: function(val) {
    //   this.updateMultiColorLights();
    // },
    // brightnessSliderValue: function(val) {
    // 	console.log(val / (this.redSliderValue / 255))
    //   this.redSliderValue = Math.floor((this.redSliderValue / 255) * val);
    //   this.greenSliderValue = Math.floor((this.greenSliderValue / 255) * val);
    //   this.blueSliderValue = Math.floor((this.blueSliderValue / 255) * val);
    //   this.runLights();
    // },

    // update the lights for the 'create a scene' object
    // 'createSceneObj.rSliderVal': function(redVal) {
    //   this.updateNewSceneLights();
    // },
    // 'createSceneObj.gSliderVal': function(greenVal) {
    //   this.updateNewSceneLights();
    // },
    // 'createSceneObj.bSliderVal': function(blueVal) {
    //   this.updateNewSceneLights();
    // },
  },

  mounted() {
    // re-instantiate the lights and scenes
    this.socket.on('browser-init', data => {
      this.db = data;
    })

    // set a light button that could have been changed by another user
    // this.socket.on('update-light', data => {
    //   const { id, active } = data;
    //   const found = this.switchesToggledOn.find(val => val === id);
    //   if (found && !active) {
    //     this.switchesToggledOn = this.switchesToggledOn.filter(val => val !== id);
    //   } else if (!found && active) {
    //     this.switchesToggledOn = this.switchesToggledOn.concat(id);
    //   }
    //   // const found = this.selectedLights.find(val => val === id);
    //   // if (found && !active) {
    //   //   this.selectedLights = this.selectedLights.filter(val => val !== id);
    //   // } else if (!found && active) {
    //   //   this.selectedLights = this.selectedLights.concat(id);
    //   // }
    // })

    // this.socket.on('light-deleted', data => {
    //   const { id } = data;
    //   this.lights = this.lights.filter(l => l.id !== id);
    // })

    // this.socket.on('update-light-info', data => {
    //   const { light } = data;
    //   this.lights = this.lights.map(l => {
    //     if (l.id === light.id) {
    //       return light;
    //     }
    //     return l;
    //   })
    // })

    // this.socket.on('scene-deleted', data => {
    //   const { id } = data;
    //   this.scenes = this.scenes.filter(s => s.id !== id);
    // })

    // this.socket.on('scene-updated', data => {
    //   const { scene } = data;
    //   this.scenes = this.scenes.map(s => {
    //     if (s.id === scene.id) {
    //       return scene;
    //     }
    //     return s;
    //   })
    // }),

    // this.socket.on('get-light-rgb-status-for-sliders', data => {
    //   const { rgb } = data.light;
    //   this.redSliderValue = rgb.red;
    //   this.greenSliderValue = rgb.green;
    //   this.blueSliderValue = rgb.blue; 
    // })

  },

  methods: {
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

    setSelectedLightsToCurrentColor: function() {
      this.updateMultiColorLights();
    },

    toggleHeaderActionBar: function() {
      this.showHeaderActions = !this.showHeaderActions;
    },

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

    handlePowerSwitchClick: function(device) {
      device.active = !device.active;
      this.socket.emit('toggle-device', { device });
    },
    
    handleMultiColorLightCheckboxClick: function(light) {
      // this.socket.emit('update-light-color', { id });

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

    handleRgbSliderChange: function(color, value) {
      if (value < 0 || value > 255) return;

      if (color === 'red') this.redSliderValue = value;
      if (color === 'green') this.greenSliderValue = value;
      if (color === 'blue') this.blueSliderValue = value;
      this.updateMultiColorLights();
    },
    
    handleSceneClick: function(id) {
      this.socket.emit('run-scene', { id });
    },

    // handleShowSceneCreate: function(evt, scene) {
    //   evt.cancelBubble = true;
    //   this.showCreateSceneModal = true;
    // },

    handleShowSceneUpdate: function(evt, scene) {
      evt.cancelBubble = true;
      this.sceneToModify = scene;
      this.showUpdateSceneModal = true;
    },

    handleShowSceneDelete: function(evt, scene) {
      evt.cancelBubble = true;
      this.sceneToModify = scene;
      this.showDeleteSceneModal = true;
    },

    handleDeleteScene: function(scene) {
      this.socket.emit('delete-scene', { scene })
      this.handleModalClose();
    },

    // TODO: JB - add name validation for updating a scene (make sure it doesn't already exist)
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
  height: 100vh;
  z-index: 5;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.modal-body {
  position: relative;
  width: 90%;
  background-color: #272a31;
  padding: 25px;
  border-radius: 15px;
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
