<template>
    <div style='font-size: 18px;'>
        <p>Are you sure you want to delete `{{ scene.name }}`</p>
        <div class="action-btns">
            <button class="action-btn cancel-btn" @click='() => handleCancel(scene)'>No</button>
            <button class="action-btn submit-btn" @click='() => handleConfirm(scene)'>Yes</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SceneDelete',
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
</style>
