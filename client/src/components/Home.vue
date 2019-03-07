<template>
  <div class="wrapper">
    <h1>Switches</h1>
    <v-container>
      <v-layout row wrap justify-center>
        <light-switch
          v-for='light in lights' 
          :key='`light_switch_${light.id}`' 
          :light='light' 
          :selected='switchesToggledOn.includes(light.id)'
          :handleLightClick='handleLightSwitchClick'
          :showSwitch='true'
        />
      </v-layout>
    </v-container>


    <h1 style='margin-top: 30px;'>Change the Colors!</h1>
    <v-container>
      <v-layout row wrap justify-center>
        <light-color
          v-for='light in lights' 
          :key='`light_color_${light.id}`' 
          :light='light' 
          :selected='selectedLights.includes(light.id)'
          :handleLightClick='handleLightColorClick'
        />
      </v-layout>
    </v-container>
      
    <v-container>
      <v-layout row justify-center align-center>
        <v-flex xs12>
          <input type="range" min="0" max="255" v-model='redSliderValue' class="slider" id="redSlider">
        </v-flex>
      </v-layout>
      <v-layout row justify-center align-center>
        <v-flex xs12>
          <input type="range" min="0" max="255" v-model='greenSliderValue' class="slider" id="greenSlider">
        </v-flex>
      </v-layout>
      <v-layout row justify-center align-center>
        <v-flex xs12>
          <input type="range" min="0" max="255" v-model='blueSliderValue' class="slider" id="blueSlider">
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
</template>

<script>
import io from 'socket.io-client';
import LightSwitch from './LightSwitch';
import LightColor from './LightColor';
import Scene from './Scene';

export default {
  name: 'Home',
  components: {
    LightSwitch,
    LightColor,
    Scene
  },
  data() {
    const mainServerUrl = `${window.location.hostname}:3000`
    return {
      socket: io(mainServerUrl),
      lights: [],
      scenes: [],
      groups: [],
      switchesToggledOn: [],
      selectedLights: [],
      selectedScenes: [],

      redSliderValue: 0,
      greenSliderValue: 0,
      blueSliderValue: 0,
      brightnessSliderValue: 0,
    }
  },

  watch: {
    redSliderValue: function(val) {
      this.runLights();
    },
    greenSliderValue: function(val) {
      this.runLights();
    },
    blueSliderValue: function(val) {
      this.runLights();
    },
    brightnessSliderValue: function(val) {
    	console.log(val / (this.redSliderValue / 255))
      this.redSliderValue = Math.floor((this.redSliderValue / 255) * val);
      this.greenSliderValue = Math.floor((this.greenSliderValue / 255) * val);
      this.blueSliderValue = Math.floor((this.blueSliderValue / 255) * val);
      this.runLights();
    }
  },

  mounted() {
    // re-instantiate the lights and scenes
    this.socket.on('browser-reset', data => {
      // console.log(data)
      const { lights, scenes } = data;
      this.lights = lights;
      this.scenes = scenes;
      this.selectedLights = lights.filter(l => l.active).map(l => l.id);
      // console.log(scenes)
    })

    // set a light button that could have been changed by another user
    this.socket.on('update-light', data => {
      const { id, active } = data;
      const found = this.switchesToggledOn.find(val => val === id);
      if (found && !active) {
        this.switchesToggledOn = this.switchesToggledOn.filter(val => val !== id);
      } else if (!found && active) {
        this.switchesToggledOn = this.switchesToggledOn.concat(id);
      }
      // const found = this.selectedLights.find(val => val === id);
      // if (found && !active) {
      //   this.selectedLights = this.selectedLights.filter(val => val !== id);
      // } else if (!found && active) {
      //   this.selectedLights = this.selectedLights.concat(id);
      // }
    })
  },

  methods: {
    runLights: function() {
      this.socket.emit('update-lights', {
        lights: this.selectedLights,
        rgb: {
          red: this.redSliderValue,
          green: this.greenSliderValue,
          blue: this.blueSliderValue,
        }
      })
    },



    // EVENT HANDLERS
    handleLightSwitchClick: function(id) {
      this.socket.emit('toggle-light-switch', { id })
    },
    
    handleLightColorClick: function(id) {
      // this.socket.emit('update-light-color', { id });

      // hold all lights being changed locally
      const found = this.selectedLights.find(val => val === id);
      if (found !== undefined) {
        this.selectedLights = this.selectedLights.filter(val => val !== id);
      } else {
        this.selectedLights = this.selectedLights.concat(id);
      }
    },
    
    handleSceneClick: function(id) {
      this.socket.emit('run-scene', { id });
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  padding-top: 50px;
  color: white;
}

.light-row {
  padding: 15px;
  border: 1px solid gray;
  background-color: rgba(0,0,0,0.2);
  cursor: pointer;
}
.light-row-active {
  background-color: rgba(0,150,0,0.6);
}

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
