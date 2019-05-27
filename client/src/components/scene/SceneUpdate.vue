<template>
    <div style='font-size: 18px;'>
    	<div>
    		<h6>Scene Name</h6>	
	    	<input 
	    	type='text' 
	    	v-model='sceneName' 
	    	class='textbox' 
	    	placeholder='e.g. Family Room' 
	    	/>	
    	</div>
    	<div>
    		<h6>Image Filename</h6>
    		<input 
	    	type='text' 
	    	v-model='imageFilename' 
	    	class='textbox' 
	    	placeholder='e.g. goodnight.jpg' 
	    	/>	
    	</div>
    	
        <hr style='margin-bottom: 15px' />
    	<h4>All devices</h4>
    	<p class='note'>- tap on these to add them to the scene</p>
        <device-checkboxes
        :devices='devices'
        :selectedDevices='selectedDevices'
        :handleClick='handleDeviceSelection'
        />

        <hr style='margin-bottom: 15px' />
        <h4>Selected RGB lights</h4>
        <p class='note'>- tap on these and move the sliders to change their colors</p>
        <div v-if='filteredMulticolorLights.length'>
	        <v-container>
	          <v-layout row wrap justify-center>
	            <multi-color-light-checkbox
	              v-for='mcLight in filteredMulticolorLights' 
	              :key='`light_color_${mcLight.id}`' 
	              :light='mcLight' 
	              :selected='selectedMultiColorLights.find(l => l.id === mcLight.id) ? true : false'
	              :handleLightClick='handleMultiColorLightCheckboxClick'
	            />
	          </v-layout>
	        </v-container>

	        <rgb-sliders
	        :redSliderValue='redSliderValue'
	        :greenSliderValue='greenSliderValue'
	        :blueSliderValue='blueSliderValue'
	        :handleChange='handleSliderChange'
	        />
	    </div>

        <div class="action-btns">
            <button class="action-btn cancel-btn" @click='() => handleCancel(scene)'>Cancel</button>
            <button class="action-btn submit-btn" @click='createScene'>{{ scene ? 'Save' : 'Create' }}</button>
        </div>
    </div>
</template>

<script>
import RgbSliders from '../RgbSliders';
import DeviceCheckboxes from '../DeviceCheckboxes';
import MultiColorLightCheckbox from '../MultiColorLightCheckbox';

export default {
    name: 'SceneUpdate',
    components: {
        RgbSliders,
        DeviceCheckboxes,
        MultiColorLightCheckbox
    },
    props: {
        scene: {
            type: Object,
        },
        handleConfirm: {
            type: Function,
            required: true
        },
        handleCancel: {
            type: Function,
            required: true
        },
        devices: {
            type: Array,
            required: true
        },
    },

    data() {
        return {
            redSliderValue: 0,
            greenSliderValue: 0,
            blueSliderValue: 0,

            sceneName: '',
            imageFilename: '',

            selectedDevices: [],
            selectedMultiColorLights: [],	// currently selected multi-color lights (used for setting each light to a different value if needed)
        }
    },

    computed: {
    	// return any devices selected to be in this scene that are multi-color lights
        filteredMulticolorLights: function() {
            return this.selectedDevices.filter(d => d.deviceType === 'LIGHT_MULTICOLOR')
        }
    },

    methods: {
    	createScene: function() {
			const updatedScene = {
				id: this.scene ? this.scene.id : null,
				name: this.sceneName,
				image: this.imageFilename,
				devices: this.selectedDevices,
			}
			this.handleConfirm(updatedScene);
    	},

        handleSliderChange: function(color, value) {
            if (value < 0 || value > 255) return;

            if (color === 'red') this.redSliderValue = value;
            if (color === 'green') this.greenSliderValue = value;
            if (color === 'blue') this.blueSliderValue = value;

            this.updateSelectedMultiColorLights();
        },

        updateSelectedMultiColorLights: function() {
        	this.selectedMultiColorLights.forEach(mcl => {
		        const { redSliderValue, greenSliderValue, blueSliderValue } = this;
        		mcl.status = {
		          red: redSliderValue,
		          green: greenSliderValue,
		          blue: blueSliderValue
		        }
        		const mclIdx = this.filteredMulticolorLights.findIndex(fmcl => fmcl.id === mcl.id);
        		this.filteredMulticolorLights[mclIdx] = mcl;
        	})
        },

        handleDeviceSelection: function(device) {
            const found = this.selectedDevices.find(d => d.id === device.id);

            if (!found) {
                this.selectedDevices = this.selectedDevices.concat(device);
                return;
            }

            // else remove it
            this.selectedDevices = this.selectedDevices.filter(d => d.id !== device.id);
        },

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
    },

    mounted() {
    	// if a scene is passed in, set all the required variables with it
		if (this.scene) {
    		this.selectedDevices = this.scene ? this.scene.devices.map(sceneDevice => {
    			const found = this.devices.find(device => device.id === sceneDevice.id)
    			found.status = sceneDevice.status;
    			return found;
			}) : [];
			this.sceneName = this.scene.name;
			this.imageFilename = this.scene.image;
    	}
    },

}
</script>

<style scoped>
.action-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
}

.action-btn {
    border: 1px solid white;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    color: black;
}

.cancel-btn {
    background-color: rgb(240,100,100);
}
.submit-btn {
    background-color: rgb(100,200,100);
}

.textbox {
	border: 1px solid rgba(255,255,255,0.5);
	border-radius: 10px;
	margin-top: 5px;
	margin-bottom: 15px;
	padding: 5px;
	width: 75%;
	text-align: center;
}

.note {
	font-size: 14px;
	color: rgba(255,255,255,0.5);
	margin-bottom: 0;
}
</style>
