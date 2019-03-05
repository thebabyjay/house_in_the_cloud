<template>
    <v-flex xs6 sm4 md2>
        <div 
        class="light-button flex-centered" 
        :class='{ "light-button-selected": selected }'
        @click='() => toggleLightClick(light.id)'
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
        toggleLightClick: Function
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
}
.light-button-selected {
    border: 2px solid rgba(100,230,100, 0.7);
}
</style>

