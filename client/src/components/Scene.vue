<template>
    <v-flex xs6 sm4 md2>
        <div 
            class="scene-button flex-centered" 
            :class="[selected ? 'scene-active' : 'scene-inactive']"
            @click='() => handleSceneClick(scene.id)'
        >
            {{ scene.name }}
        </div>
    </v-flex>
</template>

<script>
export default {
    name: 'Scene',
    props: {
        scene: Object,
        selected: Boolean,
        handleSceneClick: Function
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

.scene-wrapper {
    width: 25%;
}

.scene-button {
    background-color: rgba(0,0,0,0.2);
    border: 2px solid gray;
    cursor: pointer;
    width: 150px;
    height: 75px;
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

</style>

