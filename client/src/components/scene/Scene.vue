<template>
    <v-flex xs6 sm4 md2 align-self-center>
        <div 
            class="scene-button " 
            :class="[selected ? 'scene-active' : 'scene-inactive']"
            @click='() => handleSceneClick(scene.id)'
        >
            <img :src='getImage(scene.image)' class='background-image' />
            <div class='scene-content'>
                <div class='scene-action-btns'>
                    <button class="action-btn" @click='(evt) => handleShowSceneUpdate(evt, scene)'>
                        <v-icon>edit</v-icon>
                    </button>
                    <button class="action-btn" @click='(evt) => handleShowSceneDelete(evt, scene)'>
                        <v-icon>delete</v-icon>
                    </button>
                </div>
                <div class='scene-details flex-centered'>
                    {{ scene.name }}
                </div>
            </div>
        </div>
    </v-flex>
</template>

<script>
// import goodnightImg from '../../assets/images/goodnight.jpg';
// import goodmorningImg from '../../assets/images/goodmorning.jpg';

export default {
    name: 'Scene',
    props: {
        scene: { type: Object, required: true },
        selected: { type: Boolean, default: false },
        handleSceneClick: { type: Function, required: true },
        handleShowSceneUpdate: { type: Function, required: true },
        handleShowSceneDelete: { type: Function, required: true },
    },
    data() {
        return {
            images: {
                // goodnight: goodnightImg,
                // goodmorning: goodmorningImg
            }
        }
    },

    methods: {
        getImage: function(name) {
            let img;
            try {
                img = require('../../assets/' + name)
            } catch (error) {
                img = "https://placehold.it/200x100"
            }
            return img;
        },

        handleEditButtonClick: function(evt) {
            evt.cancelBubble = true;
        },

        handleDeleteButtonClick: function(evt) {
            evt.cancelBubble = true;
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
    background: black;
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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.scene-action-btns {
    z-index: inherit;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 5px;
    padding-left: 5px;
}

.action-btn {
    z-index: 2;
}
.action-btn i {
    margin: 0;
    padding: 0;
    font-size: 20px;
    color: white;
}
.action-btn i:hover {
    color: red;
}

.scene-details {
    z-index: inherit;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: 'Advent Pro', sans-serif;
    color: white;
}

.background-image {
    position: absolute;
    /* background-color: rgba(0,0,0,0.2); */
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    z-index: 0;
    border-radius: 5px;
}


</style>

