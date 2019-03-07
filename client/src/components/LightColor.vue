<template>
    <!-- <div class='flex-centered'> -->
    <v-flex xs6 sm4 md2 algin-self-center>
        <div 
            class="light-button flex-centered" 
            :class="[selected ? 'light-active' : 'light-inactive']"
            @click='() => handleLightClick(light.id)'
        >
            <span>{{ light.name }}</span>
        </div>
    </v-flex>
    <!-- </div> -->
</template>

<script>

export default {
    name: 'LightColor',
    props: {
        light: Object,
        selected: Boolean,
        handleLightClick: Function,
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

.light-wrapper {
    width: 25%;
}

.light-button {
    background-color: rgba(0,0,0,0.2);
    border: 2px solid gray;
    cursor: pointer;
    /* width: 150px; */
    flex: 1;
    height: 75px;
    margin: 5px;
    border-radius: 10px;
    color: white;
    position: relative;
}
.light-button:hover {
    background-color: rgba(100,100,200,0.4);
}

.light-inactive {
    border: 2px solid rgba(0,0,0, 0.7);
}

.light-active {
    border: 2px solid rgba(20,230,20, 0.7);    
    /* background-color: rgba(0,250,0,0.2); */
}

.top-half,
.bottom-half {
    flex: 1;
}

.top-half {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.icon {
    /* padding-left: 10px; */
    color: white;
}
</style>

