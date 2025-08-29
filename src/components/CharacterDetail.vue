<script setup>
import { useHistoryStore } from '@/stores/historyStore';
import { storeToRefs } from 'pinia';

const historyStore = useHistoryStore();

const { activeCharacter, isLoading } = storeToRefs(historyStore);

import { ref } from 'vue';
import COCCharacterList from './COCCharacterList.vue';

const isDetailVisible = ref(false);
const isMemoVisble = ref(false);

function toggleDetails() {
    isDetailVisible.value = !isDetailVisible.value;
}

function toggleMemo() {
    isMemoVisble.value = !isMemoVisble.value;
}

const localMemo = ref(historyStore.memo);

function handleSaveMemo() {
    historyStore.saveMemo(localMemo.value);
}

const localCharacterQuery = ref("");

function handleSearchCharacter() {
    historyStore.getAvailableCharacters(localCharacterQuery.value);
}

function autoFill (character) {
    historyStore.userMessage = `this is my character: ${JSON.stringify(character)}`
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
                <img v-if="activeCharacter.imageUrl" :src="activeCharacter.imageUrl" alt="character image" class="character-img">
                <p v-else>Character Avatar Feature coming soon</p>
                <h2>Name: {{ activeCharacter.name }}</h2>
                <h4>Class: {{ activeCharacter.class }}</h4>
                <p>Level: {{ activeCharacter.level }}</p>
                <hr>
                <h4>HP: {{ activeCharacter.hp.current }} / {{ activeCharacter.hp.max }}</h4>
                <h4>MP: {{ activeCharacter.mp.current }} / {{ activeCharacter.mp.max }}</h4>
                <h4>SAN: {{ activeCharacter.san }}</h4>
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
                <small v-if="historyStore.memoSaveStatus">{{ historyStore.memoSaveStatus }}</small>
            </div>
        </div>
    </div>
    <div v-else class="no-character-container">
        <p>Character has not been created in this game.</p>
        <p>You can select these characters which were created.</p>
        <input type="text" v-model="localCharacterQuery" @keydown.enter="handleSearchCharacter"></input>
        <div v-if="historyStore.availableCharacters" class="character-list-container">
            <table>
                <tr>
                    <th>Name</th>
                    <th>Class</th>
                </tr>
                <COCCharacterList 
                v-for="activeCharacter in historyStore.availableCharacters"
                :key="activeCharacter._id"
                :name="activeCharacter.name"
                :characterClass="activeCharacter.class"
                @click="autoFill(activeCharacter)"
                />
            </table>
        </div>
        <div v-else>
            <p>No Available Character. Please create a new character with KP.</p>
        </div>
        <button v-on:click="historyStore.getCharacterByGameId">Get Character Information</button>
    </div>
</template>

<style scoped>
.loading-container, .no-character-container, .character-and-memo-container {
    padding: 20px;
    text-align: center;
    color: #888
}

.character-list-container {
    display: flex;
    justify-content: center;
    padding: 20px;
}

table, th {
    border: 1px solid white;
}

table {
    width: 80%;
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