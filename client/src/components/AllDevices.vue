<template>
    <v-container>
        <v-layout row wrap justify-center>
            <power-switch
            v-for='device in devices' 
            :key='`light_switch_${device.id}`' 
            :showSwitch='showSwitch'
            :device='device' 
            :handlePowerSwitchClick='handleClick'
            :selected='switchesActivated.find(sw => sw.id === device.id) ? true : false'
            :class='{ "switch-disabled": !connectedDevices.find(l => l.id === device.id) }'
            :disabled='!connectedDevices.find(l => l.id === device.id)'
            />
            <!-- :selected='switchesActivated.includes(device.id)' -->
            
        </v-layout>
    </v-container>
</template>


<script>
import PowerSwitch from './PowerSwitch';

export default {
    name: 'AllDevices',
    components: {
        PowerSwitch
    },
    props: {
        devices: { type: Array, required: true },
        showSwitch: { type: Boolean, default: false },
        handleClick: { type: Function, required: true },
        connectedDevices: { type: Array, required: true },
        switchesActivated: { type: Array, required: true },
    },
    data() {
        return {

        }
    },

    methods: {

    }
}
</script>

<style scoped>
.switch-disabled {
	pointer-events: none;
	opacity: 0.5;
}

</style>
