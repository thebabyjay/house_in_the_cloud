<template>
  <div class="wrapper">
    <h1>Your Lights</h1>
    <v-container>
      <v-layout row wrap>
        <light 
          v-for='light in lights' 
          :key='`light_${light.id}`' 
          :light='light' 
          :selectedArr='selectedLights' 
          :selected='selectedLights.includes(light.id)'
          :handleLightClick='handleLightClick'
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
    </v-container>
    <!-- <hr> -->

    
    <h1>Your Scenes</h1>
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
import Light from './Light';
import Scene from './Scene';

export default {
  name: 'Home',
  components: {
    Light,
    Scene
  },
  data() {
    const mainServerUrl = `${window.location.hostname}:3000`
    return {
      socket: io(mainServerUrl),
      lights: [],
      scenes: [],
      groups: [],
      selectedLights: [],
      selectedScenes: [],

      redSliderValue: 0,
      greenSliderValue: 0,
      blueSliderValue: 0,
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
    }
  },

  mounted() {
    // re-instantiate the lights and scenes
    this.socket.on('browser-reset', data => {
      const { lights, scenes } = data;
      this.lights = lights;
      this.scenes = scenes;
      console.log(scenes)
    })

    // set a light button that could have been changed by another user
    this.socket.on('new-light-status', data => {
      const { id, active } = data;
      const found = this.selectedLights.find(val => val === id);
      if (found && !active) {
        this.selectedLights = this.selectedLights.filter(val => val !== id);
      } else if (!found && active) {
        this.selectedLights = this.selectedLights.concat(id);
      }
    })
  },

  methods: {
    runLights: function() {
      this.socket.emit('update', {
        lights: this.selectedLights,
        rgb: {
          red: this.redSliderValue,
          green: this.greenSliderValue,
          blue: this.blueSliderValue,
        }
      })
    },



    // EVENT HANDLERS
    handleLightClick: function(id) {
      this.socket.emit('update-light-status', { id });
      // const found = this.selectedLights.find(val => val === id);
      // if (found !== undefined) {
      //   this.selectedLights = this.selectedLights.filter(val => val !== id);
      // } else {
      //   this.selectedLights = this.selectedLights.concat(id);
      // }
    },
    
    handleSceneClick: function(id) {

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

</style>
