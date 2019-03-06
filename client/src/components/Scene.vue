<template>
    <v-flex xs6 sm4 md2 align-self-center>
        <div 
            class="scene-button flex-centered" 
            :class="[selected ? 'scene-active' : 'scene-inactive']"
            @click='() => handleSceneClick(scene.id)'
        >
            <img :src='getImage(scene.image)' class='background-image' />
            <div class='scene-content'>{{ scene.name }}</div>
        </div>
    </v-flex>
</template>

<script>
import goodnight from '../assets/goodmorning.jpg';

export default {
    name: 'Scene',
    props: {
        scene: Object,
        selected: Boolean,
        handleSceneClick: Function
    },
    data() {
        return {
            images: {
                goodnight
            }
        }
    },

    methods: {
        getImage: function(name) {
            return require('../assets/' + name);
        }
    }
}
</script>

<style scoped>
.flex-centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.scene-wrapper {
    width: 25%;
}

.scene-button {
    position: relative;
    border: 2px solid gray;
    cursor: pointer;
    /* width: 150px; */
    flex: 1;
    height: 75px;
    margin: 5px;
    border-radius: 10px;
    color: white;
}
.scene-button:hover {
    background-color: rgba(100,100,200,0.4);
}

.scene-inactive {
    border: 2px solid rgba(0,0,0, 0.7);
}

.scene-active {
    border: 2px solid rgba(20,230,20, 0.7);    
    /* background-color: rgba(0,250,0,0.2); */
}

.scene-content {
    z-index: 2;
    font-size: 24px;
}

.background-image {
    position: absolute;
    background-color: rgba(0,0,0,0.2);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    z-index: 1;
}


</style>

