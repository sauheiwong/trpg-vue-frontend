<script setup>
import { useHistoryStore } from '@/stores/historyStore';
import { storeToRefs } from 'pinia';

const historyStore = useHistoryStore();

const { activeCharacter, isLoading } = storeToRefs(historyStore);

</script>

<template>
    <div v-if="isLoading" class="loading-container">
        <p>Loading Character...</p>
    </div>
    <div class="character-container" v-else-if="activeCharacter">
        <img :src="activeCharacter.img || '/images/characters/test.png'" alt="character image" class="character-img">
        <h2>Name: {{ activeCharacter.name }}</h2>
        <h4>Class: {{ activeCharacter.class }}</h4>
        <p>Level: {{ activeCharacter.level }}</p>
        <hr>
        <div class="attributes-container">
            <div v-for="(value, key, index) in activeCharacter.attributes" :key="index">
                <p>{{ key }}: {{ value }}</p>
            </div>
        </div>
        <hr>
        <div class="skills-container">
            <div v-for="(value, key, index) in activeCharacter.skills" :key="index" >
                <p>{{ key }}: {{ value }}</p>
            </div>
        </div>
    </div>
    <div v-else class="no-character-container">
        <p>Character has not been created or selected in this game.</p>
        <button v-on:click="historyStore.getCharacterByGameId">Get Character Information</button>
    </div>
</template>

<style scoped>
.loading-container, .no-character-container, .character-container {
    padding: 20px;
    text-align: center;
    color: #888
}

.attributes-container, .skills-container {
    display: grid;
    gap: 10px;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
}


.character-img {
    max-height: 256px;
}

</style>