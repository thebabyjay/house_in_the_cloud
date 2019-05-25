 <template>
  <div class="wrapper">
    <div class="header">
      <div>
        <h1>House in the Cloud</h1>
      </div>
      <div>
        <!-- <button class='header-action-btn' @click='() => rereadDb'>Read DB</button>
        <button class='header-action-btn' :class='{ "header-action-btn-active": showCreatePanel }' @click='() => showCreatePanel = !showCreatePanel'>Create</button>
        <button class='header-action-btn' :class='{ "header-action-btn-active": showEditPanel }' @click='() => showEditPanel = !showEditPanel'>Edit</button> -->
      </div>
    </div>

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

    <div v-if='!showCreatePanel && !showEditPanel'>
      <h1>Devices</h1>
      <v-container>
        <v-layout row wrap justify-center>
          <power-switch
            v-for='device in devices' 
            :key='`light_switch_${device.id}`' 
            :showSwitch='true'
            :device='device' 
            :handlePowerSwitchClick='handlePowerSwitchClick'
            :selected='switchesActivated.find(sw => sw.id === device.id) ? true : false'
            :class='{ "switch-disabled": !connectedDevices.find(l => l.id === device.id) }'
            :disabled='!connectedDevices.find(l => l.id === device.id)'
          />
            <!-- :selected='switchesActivated.includes(device.id)' -->
            
        </v-layout>
      </v-container>


      <h1 style='margin-top: 30px;'>Custom Lighting</h1>
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
        
      <v-container style='padding-top: 0'>
        <v-layout row justify-center align-center>
          <v-flex xs1>
            {{ redSliderValue }}
          </v-flex>	
          <v-flex xs11>
            <input @input='evt => rgbSliderOnChange("red", evt.target.value)' type="range" min="0" max="255" :value='redSliderValue' class="slider" id="redSlider">
          </v-flex>
        </v-layout>
        <v-layout row justify-center align-center>
          <v-flex xs1>
            {{ greenSliderValue }}
          </v-flex>	
          <v-flex xs11>
            <input @input='evt => rgbSliderOnChange("green", evt.target.value)' type="range" min="0" max="255" v-model='greenSliderValue' class="slider" id="greenSlider">
          </v-flex>
        </v-layout>
        <v-layout row justify-center align-center>
          <v-flex xs1>
            {{ blueSliderValue }}
          </v-flex>	
          <v-flex xs11>
            <input @input='evt => rgbSliderOnChange("blue", evt.target.value)' type="range" min="0" max="255" v-model='blueSliderValue' class="slider" id="blueSlider">
          </v-flex>
        </v-layout>
        <!-- <v-layout row justify-center align-center>
          <svg class='slider-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"/></svg>
          <input type="range" min="0" max="255" v-model='brightnessSliderValue' class="slider" id="brightnessSlider">
          <svg class='slider-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 387c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4v-46.2c0-8.5-6.9-15.4-15.4-15.4zM256 48c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4V63.4c0-8.5-6.9-15.4-15.4-15.4zM125 256c0-8.5-6.9-15.4-15.4-15.4H63.4c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4zM448.6 240.6h-46.2c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4s-6.9-15.4-15.4-15.4zM152.5 344.1c-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5l32.7-32.7c6-6 6-15.8 0-21.8-2.9-2.9-6.8-4.5-10.9-4.5zM359.5 167.9c4.1 0 8-1.6 10.9-4.5l32.7-32.7c2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5zM130.7 108.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-2.9 2.9-4.5 6.8-4.5 10.9 0 4.1 1.6 8 4.5 10.9l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7zM370.4 348.6c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-6 6-6 15.8 0 21.8l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7zM256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96z"/></svg>
        </v-layout> -->
      </v-container>
      <!-- <hr> -->

    
      <h1 style='margin-top: 30px;'>Scenes</h1>
      <v-container>
        <v-layout row wrap justify-center>
          <scene 
            v-for='scene in scenes'
            :key='`scene_${scene.id}`'
            :scene='scene'
            :selected='selectedScenes.includes(scene.id)'
            :handleSceneClick='handleSceneClick'
          />
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import PowerSwitch from './PowerSwitch';
import MultiColorLightCheckbox from './MultiColorLightCheckbox';
import Scene from './Scene';

export default {
  name: 'Home',
  components: {
    PowerSwitch,
    MultiColorLightCheckbox,
    Scene
  },
  data() {
    const mainServerUrl = `${window.location.hostname}:3000`
    return {
      socket: io(mainServerUrl),
      db: {},

      selectedMultiColorLights: [],
      // lights: [],
      // scenes: [],
      // groups: [],
      // allLights: [],
      // connectedLights: [],
      // switchesToggledOn: [],
      // selectedScenes: [],

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

      showEditPanel: false,
      showCreatePanel: false,
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

    rgbSliderOnChange: function(color, value) {
      if (color === 'red') this.redSliderValue = value;
      if (color === 'green') this.greenSliderValue = value;
      if (color === 'blue') this.blueSliderValue = value;
      this.updateMultiColorLights();
    },

    setSelectedLightsToCurrentColor: function() {
      this.updateMultiColorLights();
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

    // deleteScene: function(id) {
    //   this.socket.emit('delete-scene', {
    //     id
    //   })
    // },

    // updateScene: function(scene) {
    //   this.socket.emit('update-scene', {
    //     scene
    //   })
    // },


    // createScene: function() {
    //   if (!this.createScene.name) {
    //     return;
    //   }
      
    //   const found = this.scenes.find(scene => scene.name === this.createSceneObj.name);

    //   if (found) {
    //     this.createSceneMessage = 'Scene name already used!';
    //     setTimeout(() => {
    //       this.createSceneMessage = ''
    //     }, 1500);
    //     return;
    //   } 

    //   const { id, name, image, active, lights } = this.createSceneObj;
    //   const scene = {
    //       id,
    //       name,
    //       image,
    //       active,
    //       lights
    //   }

    //   this.socket.emit('add-scene', {
    //     scene
    //   })
    //   this.createSceneMessage = 'Scene created successfully!';
    //   setTimeout(() => {
    //     this.createSceneMessage = ''
    //   }, 1500);
    // },

    // updateNewSceneLights: function() {
    //   const { rSliderVal, gSliderVal, bSliderVal } = this.createSceneObj;
    //   this.createSceneObj.lights = this.createSceneObj.lights.map(selectedLight => {
    //     if (this.createSceneObj.activeLights.find(activeLight => activeLight.id === selectedLight.id)) {
    //       selectedLight.rgb.red = rSliderVal;
    //       selectedLight.rgb.green = gSliderVal;
    //       selectedLight.rgb.blue = bSliderVal;
    //     }
    //     return selectedLight;
    //   })
    // },



    // // EVENT HANDLERS
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
    
    // handleSceneClick: function(id) {
    //   this.socket.emit('run-scene', { id });
    // },

    // setAllSelectedLightsToColor: function() {
    //   runLights();
    // },

    // rereadDb: function() {
    //   this.socket.emit('reread-db');
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  /* padding-top: 50px; */
  color: white;
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

</style>
