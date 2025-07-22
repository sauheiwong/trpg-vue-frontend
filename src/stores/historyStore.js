import { defineStore } from "pinia";
import apiClient from '../api';

export const useHistoryStore = defineStore("history", {
    state: () => ({
        games: [],
        isLoading: false,
        activeGameId: "",
        messages: [],
        title: "New Chat",
        isNewGame: true,
        userMessage: "",
        isEditingTitle: false,
    }),
    actions: {
        async fetchGames() {
            try{
                const response = await apiClient.get("/chat");
                console.log(`the number of fetching games: ${response.data.games[0].updatedAt.slice(0,10)}`)
                this.games = response.data.games;
            } catch (err){
                console.error("fetch game error is: ", err)
                this.games = [{_id: 1, title: "error", updatedAt: Date.now()}]
            }
        },
        async selectConveresation(gameId) {
            this.isNewGame = false;
            if (this.activeGameId === gameId) {
                return;
            }

            this.messages = [{
                _id: 1,
                role: "system",
                content: 'Loading...',
            }];

            try{
                this.activeGameId = gameId;

                const response = await apiClient.get(`/chat/${gameId}`);
                this.title = response.data.title;
                this.messages = response.data.messages;
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
                this.messages = [{
                    _id: 1,
                    role: "system",
                    content: 'Error ⚠️: Fail to fetch the informaiton of game',
                }]
            }
        },
        async sendMessage(){
            if (this.isNewGame){
                this.messages = [];
            }

            const sendMessage = this.userMessage;
            this.userMessage = "";

            this.messages.push({
                _id: Date.now(),
                content: sendMessage,
                role: "user",
            })

            this.messages.push({
                _id: Date.now() + 1,
                content: "loading...",
                role: "assistant",
            })

            try{ 

                let response;

                if (this.isNewGame){
                    response = await apiClient.post(`/test/chat/`, {
                    message: sendMessage,
                    });
                    this.activeGameId = response.data.gameId;
                    this.isNewGame = false;
                    await this.fetchGames();
                } else {
                    response = await apiClient.post(`/test/chat/${this.activeGameId}`, {
                    message: sendMessage,
                    });
                }

                console.log(`response is ${response}`)

                this.messages[this.messages.length - 1].content = response.data.message;

            } catch (err){
                console.error(`Error ⚠️: ${err}`);
                this.messages[this.messages.length - 1].content = err.response?.data?.message || "fetch fail or server error"
            }
        },
        newChat(){
            this.isNewGame = true;
            this.messages = [];
            this.title = "New Chat";
        },
        startEditTitle() {
            if (this.isNewGame) {
                return;
            }
            this.isEditingTitle = true;
        },
        async editTitle(newTitle){
            const trimmedTitle = newTitle.trim();
            if (!trimmedTitle || trimmedTitle === this.title || this.isNewGame) {
                this.isEditingTitle = false;
                return;
            }

            const gameId = this.activeGameId
            const oldTitle = this.title;
            this.title = trimmedTitle;
            this.isEditingTitle = false;

            try{
                await apiClient.put(`/chat/${gameId}`, 
                    {title: newTitle}
                );
                const gameInList = this.games.find(c => c._id === gameId)
                if (gameInList){
                    gameInList.title = newTitle
                }
            } catch (err){
                console.error(`Error ⚠️: ${err}`)
                this.messages.push({
                    _id: new Date(),
                    role: "system",
                    content: "Error ⚠️: Failed to update the new title"
                })
                this.title = oldTitle;
            }

        },
        async deleteGame(gameId) {
            try{
                await apiClient.delete(`/chat/${gameId}`);
                
                this.games = this.games.filter(game => game._id !== gameId)

                if (this.activeGameId === gameId) {
                    this.newChat()
                }
            } catch (err){
                console.error("Error deleting game:", err);
                this.title = `Error⚠️`;
                this.messages.push({
                    _id: new Date(),
                    role: "system",
                    content: "Error ⚠️: Failed to deleting game"
                })
            }
        },
    },
    getters: {
        groupedGames: (state) => {
            const groups = {
                "Today": [],
                "Yesterday": [],
                "Last-7-days": [],
                "Earlier": [],
            };

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            for (const convo of state.games) {
                const convoDate = new Date(convo.updatedAt.slice(0,10));
                console.log(`convoDate is: ${convoDate}`)
                if (convoDate >= today) {
                    groups.Today.push(convo);
                } else if (convoDate >= yesterday) {
                    groups.Yesterday.push(convo);
                } else if (convoDate >= sevenDaysAgo) {
                    groups["Last-7-days"].push(convo)
                } else {
                    groups.Earlier.push(convo)
                }
            }

            return Object.entries(groups).map(([label, games]) => ({ label, games})).filter(group => group.games.length > 0);
        }
    }
})
