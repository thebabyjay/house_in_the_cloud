<template>
    <v-container style='padding-top: 0'>
        <v-layout row justify-center align-center>
        <v-flex xs1>
            {{ redSliderValue }}
        </v-flex>	
        <v-flex xs11 class='slider-row'>
            <button class='slider-value-change-btn' @click="() => handleChange('red', redSliderValue - 1)">
            <v-icon>keyboard_arrow_left</v-icon>
            </button>
            <input @input='evt => handleChange("red", parseInt(evt.target.value))' type="range" min="0" max="255" :value='redSliderValue' class="slider" id="redSlider">
            <button class='slider-value-change-btn' @click="() => handleChange('red', redSliderValue + 1)">
            <v-icon>keyboard_arrow_right</v-icon>
            </button>
        </v-flex>
        </v-layout>
        <v-layout row justify-center align-center>
        <v-flex xs1>
            {{ greenSliderValue }}
        </v-flex>	
        <v-flex xs11 class='slider-row'>
            <button class='slider-value-change-btn' @click="() => handleChange('green', greenSliderValue - 1)">
            <v-icon>keyboard_arrow_left</v-icon>
            </button>
            <input @input='evt => handleChange("green", parseInt(evt.target.value))' type="range" min="0" max="255" :value='greenSliderValue' class="slider" id="greenSlider">
            <button class='slider-value-change-btn' @click="() => handleChange('green', greenSliderValue + 1)">
            <v-icon>keyboard_arrow_right</v-icon>
            </button>
        </v-flex>
        </v-layout>
        <v-layout row justify-center align-center>
        <v-flex xs1>
            {{ blueSliderValue }}
        </v-flex>	
        <v-flex xs11 class='slider-row'>
            <button class='slider-value-change-btn' @click="() => handleChange('blue', blueSliderValue - 1)">
            <v-icon>keyboard_arrow_left</v-icon>
            </button>
            <input @input='evt => handleChange("blue", parseInt(evt.target.value))' type="range" min="0" max="255" :value='blueSliderValue' class="slider" id="blueSlider">
            <button class='slider-value-change-btn' @click="() => handleChange('blue', blueSliderValue + 1)">
            <v-icon>keyboard_arrow_right</v-icon>
            </button>
        </v-flex>
        </v-layout>
        <!-- <v-layout row justify-center align-center>
        <svg class='slider-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 76c48.1 0 93.3 18.7 127.3 52.7S436 207.9 436 256s-18.7 93.3-52.7 127.3S304.1 436 256 436c-48.1 0-93.3-18.7-127.3-52.7S76 304.1 76 256s18.7-93.3 52.7-127.3S207.9 76 256 76m0-28C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"/></svg>
        <input type="range" min="0" max="255" v-model='brightnessSliderValue' class="slider" id="brightnessSlider">
        <svg class='slider-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 387c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4v-46.2c0-8.5-6.9-15.4-15.4-15.4zM256 48c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4V63.4c0-8.5-6.9-15.4-15.4-15.4zM125 256c0-8.5-6.9-15.4-15.4-15.4H63.4c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4zM448.6 240.6h-46.2c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4s-6.9-15.4-15.4-15.4zM152.5 344.1c-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5l32.7-32.7c6-6 6-15.8 0-21.8-2.9-2.9-6.8-4.5-10.9-4.5zM359.5 167.9c4.1 0 8-1.6 10.9-4.5l32.7-32.7c2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5zM130.7 108.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-2.9 2.9-4.5 6.8-4.5 10.9 0 4.1 1.6 8 4.5 10.9l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7zM370.4 348.6c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-6 6-6 15.8 0 21.8l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7zM256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96z"/></svg>
        </v-layout> -->
    </v-container>
</template>

<script>
export default {
    name: 'RgbSliders',
    props: {
        redSliderValue: { type: Number, required: true },
        greenSliderValue: { type: Number, required: true },
        blueSliderValue: { type: Number, required: true },

        handleChange: { type: Function, required: true },
    },
}
</script>

<style scoped>

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

</style>
