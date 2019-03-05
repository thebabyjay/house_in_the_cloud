<template>
  <div class="wrapper">
    <h1>Your Lights</h1>
    <div class="lights-container">
    <v-container>
      <v-layout row  wrap justify-start>
        <light 
          v-for='light in lights' 
          :key='light.id' 
          :light='light' 
          :selectedArr='selectedLights' 
          :selected='selectedLights.includes(light.id)'
          :toggleLightClick='toggleLightClick'
        />
      </v-layout>
    </v-container>
      
    </div>

    <p>Active: <input type='checkbox' value='active' id='active' checked></p>
    <p><input type="range" min="0" max="255" value="0" class="slider" id="redSlider"></p>
    <p><input type="range" min="0" max="255" value="0" class="slider" id="greenSlider"></p>
    <p><input type="range" min="0" max="255" value="0" class="slider" id="blueSlider"></p>
    <hr>

    
    <hr>
    <h1>Your Scenes</h1>
    <div class="scenes-container">
 
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Light from './Light';

export default {
  name: 'Home',
  components: {
    Light
  },
  data() {
    return {
      socket: io('localhost:3000'),
      lights: [],
      scenes: [],
      groups: [],
      selectedLights: []
    }
  },

  computed: {

  },

  mounted() {
    this.socket.on('browser-init', data => {
      const { lights, scenes } = data;
      this.lights = lights;
      this.scenes = scenes;
    })
  },

  methods: {
    sendChange: function() {
      console.log('sending change')
    },

    toggleLightClick: function(id) {
      const found = this.selectedLights.find(val => val === id);
      if (found !== undefined) {
        this.selectedLights = this.selectedLights.filter(val => val !== id);
      } else {
        this.selectedLights = this.selectedLights.concat(id);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lights-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
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
    height: 15px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }
  
  .slider:hover {opacity: 1;}
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
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
