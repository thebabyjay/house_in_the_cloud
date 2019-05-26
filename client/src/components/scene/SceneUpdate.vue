<template>
    <div style='font-size: 18px;'>
        <device-checkboxes
        :devices='connectedDevices'
        :selectedDevices='selectedDevices'
        :handleClick='handleDeviceSelection'
        />
        <!-- :handleClick=''
        :selectedDevices -->
        
        <rgb-sliders
        :redSliderValue='redSliderValue'
        :greenSliderValue='greenSliderValue'
        :blueSliderValue='blueSliderValue'
        :handleChange='handleSliderChange'
        />

        <div class="action-btns">
            <button class="action-btn cancel-btn" @click='() => handleCancel(scene)'>Cancel</button>
            <button class="action-btn submit-btn" @click='() => handleConfirm(scene)'>{{ scene ? 'Save' : 'Create' }}</button>
        </div>
    </div>
</template>

<script>
import RgbSliders from '../RgbSliders';
import DeviceCheckboxes from '../DeviceCheckboxes';

export default {
    name: 'SceneUpdate',
    components: {
        RgbSliders,
        DeviceCheckboxes,
    },
    props: {
        scene: {
            type: Object,
            required: true
        },
        handleConfirm: {
            type: Function,
            required: true
        },
        handleCancel: {
            type: Function,
            required: true
        },
        connectedDevices: {
            type: Array,
            required: true
        },
    },

    data() {
        return {
            redSliderValue: 0,
            greenSliderValue: 0,
            blueSliderValue: 0,

            selectedDevices: [],
        }
    },

    computed: {
        multicolorLights: function() {
            return this.connectedDevices.filter(d => d.deviceType === 'LIGHT_MULTICOLOR')
        }
    },

    methods: {
        handleSliderChange: function(color, value) {
            if (value < 0 || value > 255) return;

            if (color === 'red') this.redSliderValue = value;
            if (color === 'green') this.greenSliderValue = value;
            if (color === 'blue') this.blueSliderValue = value;
        },

        handleDeviceSelection: function(device) {
            const found = this.selectedDevices.find(d => d.id === device.id);

            if (!found) {
                this.selectedDevices = this.selectedDevices.connectedDevices(device);
                return;
            }

            // else remove it
            this.selectedDevices = this.selectedDevices.filter(d => d.id !== device.id);
        }
    }

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
</style>
