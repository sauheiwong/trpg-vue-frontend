<script setup>
import { onMounted } from 'vue';
import { useHistoryStore } from '@/stores/historyStore';

import GameList from '@/components/gameList.vue';

const historyStore = useHistoryStore();

onMounted(() => {
    historyStore.fetchGames()
})

</script>

<template>
    <div id="chat-layout">
    <div class="main-content">
        <h2>Game History</h2>
        <div class="games-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Updated At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <GameList
                    v-for="game in historyStore.games"
                    :game="game"
                    :key="game._id"
                    />
                </tbody>
            </table>
        </div>
        <div class="button-container">
            <router-link :to="'/chat'" >New Game</router-link>
            <router-link :to="'/home'" >Back</router-link>
        </div>
    </div>
  </div>
</template>

<style scoped>

#chat-layout {
  display: flex;
  height: 100vh; /* 讓佈局佔滿整個視窗高度 */
  justify-content: center;
  align-items: center;
}

h2{
    border-bottom: 1px solid white;
    padding-bottom: 10px;
    width: 100%;
    text-align: center;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80%;
  width: 80%;
  gap: 25px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color);
  font-size: x-large;
}

.games-container {
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #444;
}

td {
    background-color: gray;
}

th {
    font-weight: bold;
    background-color: black;
}

th:last-child, td:last-child {
    text-align: right;
}

.button-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}

.button-container *{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--highlight2-color);
    color: var(--text-color);
    border: none;
    padding: 15px 30px;
    cursor: pointer;
    font-size: large;
    border-radius: 8px;
    transition: var(--fast-transition);
    text-decoration: none;
    height: 50px;
}

.button-container *:hover{
    background-color: var(--highlight1-color);
}

</style>