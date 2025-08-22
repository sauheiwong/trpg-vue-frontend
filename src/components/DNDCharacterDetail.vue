<script setup>
import { useDNDStore } from '@/stores/DNDGameStore';
import { storeToRefs } from 'pinia';

const DNDGameStore = useDNDStore();

const { activeCharacter, isLoading } = storeToRefs(DNDGameStore);

import { ref } from 'vue';

const isDetailVisible = ref(false);
const isMemoVisble = ref(false);

function toggleDetails() {
    isDetailVisible.value = !isDetailVisible.value;
}

function toggleMemo() {
    isMemoVisble.value = !isMemoVisble.value;
}

const localMemo = ref(DNDGameStore.memo);

function handleSaveMemo() {
    DNDGameStore.saveMemo(localMemo.value);
}
</script>

<template>
    <div v-if="isLoading" class="loading-container">
        <p>Loading Character...</p>
    </div>
    <div class="character-and-memo-container" v-else-if="activeCharacter">
        <div class="collapisble-section">
            <h3 @click="toggleDetails" class="section-header">
                Character Detail <span>{{ isDetailVisible ? '[-]' : '[+]' }}</span>
            </h3>
            <div class="character-container section-content" v-if="isDetailVisible">
                <img :src="activeCharacter.img || '/images/characters/test.png'" alt="character image" class="character-img">
                <h2>Name: {{ activeCharacter.name }}</h2>
                <h4>Class: {{ activeCharacter.class }}</h4>
                <p>Level: {{ activeCharacter.level }}</p>
                <hr>
                <div class="attributes-container">
                    <div v-for="(value, key, index) in activeCharacter.attributes" :key="index">
                        <p>{{ key }}: {{ value.score }} (+{{ value.modifier }})</p>
                    </div>
                </div>
                <hr>
                <div class="skills-container">
                    <div v-for="(value, key, index) in activeCharacter.skills" :key="index" >
                        <p>{{ key }}</p>
                    </div>
                </div>
            </div>
        </div>
        <hr></hr>
        <div class="collapisble-section">
            <h3 @click="toggleMemo" class="section-header">
                Memo Note
                <span>{{ isMemoVisble ? '[-]' : '[+]' }}</span>
            </h3>
            <div class="memo-container section-content" v-if="isMemoVisble">
                <textarea 
                class="meno" 
                placeholder="your memo note" 
                v-model="localMemo" 
                @blur="handleSaveMemo"
                ></textarea>
                <small v-if="DNDGameStore.memoSaveStatus">{{ DNDGameStore.memoSaveStatus }}</small>
            </div>
        </div>
    </div>
    <div v-else class="no-character-container">
        <p>Character has not been created in this game.</p>
        <p>You can select these characters which were created.</p>
        <button v-on:click="DNDGameStore.getCharacterByGameId">Get Character Information</button>
    </div>
</template>

<style scoped>
.loading-container, .no-character-container, .character-and-memo-container {
    padding: 20px;
    text-align: center;
    color: #888
}

.collapsible-section {
    margin-bottom: 1rem;
}

.section-header {
    color: var(--text-color);
    background-color: var(--highlight2-color);
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
}

.attributes-container, .skills-container {
    display: grid;
    gap: 10px;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
}

textarea {
    width: 100%;
    min-height: 150px;
    background-color: var(--highlight1-color);
    color: var(--text-color);
}

.character-img {
    max-height: 256px;
}

</style>