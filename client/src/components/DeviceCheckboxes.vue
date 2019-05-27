<template>
    <v-container>
        <v-layout row wrap justify-center>
            <v-flex 
            v-for='device in devices'
            :key='`device_checkbox_${device.id}`'
            xs6 
            sm4 
            md2 
            algin-self-center
            >
                <div 
                class="device-button flex-centered" 
                :class="[!showSwitch && selectedDevices.find(d => d.id === device.id) ? 'device-selected' : 'device-unselected']"
                @click='() => handleClick(device)'
                >
                    <span>{{ device.name }}</span>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>

export default {
    name: 'DeviceCheckboxes',
    components: {

    },
    props: {
        devices: { type: Array, required: true },
        handleClick: { type: Function, required: true },
        selectedDevices: { type: Array, required: true },
        showSwitch: { type: Boolean, default: false }
    },
    data() {
        return {

        }
    },
}
</script>

<style scoped>
.flex-centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.device-button {
    background-color: rgba(0,0,0,0.2);
    border: 2px solid gray;
    cursor: pointer;
    /* width: 150px; */
    flex: 1;
    /*height: 75px; */
    min-height: 90px;
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    color: white;
    position: relative;
}

.device-unselected {
    border: 2px solid rgba(0,0,0, 0.7);
}

.device-selected {
    border: 2px solid rgba(20,230,20, 0.7);    
    /* background-color: rgba(0,250,0,0.2); */
}

</style>
