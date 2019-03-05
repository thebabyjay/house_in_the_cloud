<template>
    <v-flex xs6 sm4 md2>
        <div 
            class="light-button flex-centered" 
            :class="[selected ? 'light-active' : 'light-inactive']"
            @click='() => handleLightClick(light.id)'
        >
            {{ light.name }}
        </div>
    </v-flex>
</template>

<script>
export default {
    name: 'Light',
    props: {
        light: Object,
        selected: Boolean,
        handleLightClick: Function
    },
}
</script>

<style scoped>
.flex-centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.light-wrapper {
    width: 25%;
}

.light-button {
    background-color: rgba(0,0,0,0.2);
    border: 2px solid gray;
    cursor: pointer;
    width: 150px;
    height: 125px;
    border-radius: 10px;
    color: white;
}

.light-inactive {
    border: 2px solid rgba(0,0,0, 0.7);
}

.light-active {
    border: 2px solid rgba(20,230,20, 0.7);    
    /* background-color: rgba(0,250,0,0.2); */
}

</style>

