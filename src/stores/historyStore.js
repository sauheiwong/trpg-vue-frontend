import { defineStore } from "pinia";
import apiClient from '../api';

export const useHistoryStore = defineStore("history", {
    state: () => ({
        games: [],
        isLoading: false,
        isLoadingMore: false,
        activeGameId: "",
        messages: [],
        title: "New Game",
        userMessage: "",
        isEditingTitle: false,
        currenPage: 1,
        totalPages: 1,
    }),
    actions: {
        async fetchGames() {
            try{
                const response = await apiClient.get("/game");
                console.log(`the number of fetching games: ${response.data.games.length}`)
                this.games = response.data.games;
            } catch (err){
                console.error("fetch game error is: ", err)
                this.games = [{_id: 1, title: "error", updatedAt: Date.now()}]
            }
        },
        async selectGame(gameId) {
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
                this.currenPage = 1;

                const response = await apiClient.get(`/game/${gameId}`);
                this.title = response.data.title;
                this.messages = response.data.messages;
                this.totalPages = response.data.totalPages;
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
                this.messages = [{
                    _id: 1,
                    role: "system",
                    content: 'Error ⚠️: Fail to fetch the informaiton of game',
                }]
            }
        },
        // async fetchMoreMessages() {
        //     if (this.isLoadingMore || this.currenPage >= this.totalPages) {
        //         return;
        //     }

        //     this.isLoadingMore = true;
        //     try {
        //         const nextPage = this.currenPage + 1;
        //         const response = await apiClient.get(`/game/${this.activeGameId}?page=${nextPage}`);

        //         this.messages = [
        //             {
        //                 _id: 1,
        //                 role: "system",
        //                 content: "scroll\nup\nto\nget\nmore\nmessage\n🆙"
        //             },
        //             ...response.data.messages,
        //             ...this.messages.slice(1)];
        //         this.currenPage = nextPage;
        //     } catch (err) {
        //         console.error(`Error ⚠️: fail to fetch more message: ${err}`)
        //         this.messages = [{
        //             _id: 1,
        //             role: "system",
        //             content: 'Error ⚠️: Fail to fetch more message',
        //         }, ...this.messages]
        //     } finally {
        //         this.isLoadingMore = false;
        //     }
        // },
        async sendMessage(){

            const sendMessage = this.userMessage;
            this.userMessage = "";

            this.messages.push({
                _id: Date.now(),
                content: sendMessage,
                role: "user",
            })

            if (sendMessage.trim().startsWith("/roll ")) {
                this.handleRollCommand(sendMessage);
                return;
            }

            this.messages.push({
                _id: Date.now() + 1,
                content: "loading...",
                role: "model",
            })

            try{ 

                const response = await apiClient.post(`/gemini/${this.activeGameId}`, {
                    message: sendMessage,
                });

                console.log(`response is ${response}`);

                this.messages[this.messages.length - 1].content = response.data.message;

            } catch (err){
                console.error(`Error ⚠️: ${err}`);
                this.messages[this.messages.length - 1].content = err.response?.data?.message || "fetch fail or server error"
            }
        },
        async handleRollCommand(command) {

            const diceString = command.substring("/roll ".length).trim();
            if (!diceString) return;

            this.messages.push({
                _id: Date.now() + 1,
                content: `Rolling ${diceString}...`,
                role: "system",
            })

            try {
                const response = await apiClient.post("/roll", {
                    dice: diceString
                })

                const { message, total } = response.data;
                const lastMessageIndex = this.messages.length - 1;
                this.messages[lastMessageIndex].content = `🎲 ${diceString} ➔  [ ${total} ]\n( ${message} )`

                try{ 

                    this.messages.push({
                        _id: Date.now() + 1,
                        content: "loading...",
                        role: "model",
                    })

                    const response = await apiClient.post(`/gemini/${this.activeGameId}`, {
                        userMessage: command,
                        message: `[System Rolling Result] ${diceString} ➔  [ ${total} ]\n( ${message} )`,
                        role: "system"
                    });

                    console.log(`response is ${response}`);

                    this.messages[this.messages.length - 1].content = response.data.message;

                } catch (err){
                    console.error(`Error ⚠️: ${err}`);
                    this.messages[this.messages.length - 1].content = err.response?.data?.message || "fetch fail or server error"
                }

            } catch (error){
                console.error(`Error ⚠️: fail to roll a dice: ${error}`)
                const lastMessageIndex = this.messages.length - 1;
                this.messages[lastMessageIndex].content = `Error ⚠️: fail to roll a dice`
            }

        },
        async newGame(){
            this.messages = [];
            this.title = "New Game";

            try{
                const response = await apiClient.get(`/gemini`)

                console.log(`response is ${response}`);

                this.messages.push({
                    _id: new Date(),
                    content: response.data.message,
                    role: "model"
                })

                this.activeGameId = response.data.gameId;

                return this.activeGameId;

            } catch (err) {
                console.error(`Error ⚠️: fail to start a new game: ${err}`)
                this.messages.push({
                    _id: new Date(),
                    content: "Error ⚠️: fail to start a new game",
                    role: "system"
                });
                return null;
            }
        },
        startEditTitle() {
            this.isEditingTitle = true;
        },
        async editTitle(newTitle){
            const trimmedTitle = newTitle.trim();
            if (!trimmedTitle || trimmedTitle === this.title) {
                this.isEditingTitle = false;
                return;
            }

            const gameId = this.activeGameId
            const oldTitle = this.title;
            this.title = trimmedTitle;
            this.isEditingTitle = false;

            try{
                await apiClient.put(`/game/${gameId}`, 
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
                await apiClient.delete(`/game/${gameId}`);
                
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
