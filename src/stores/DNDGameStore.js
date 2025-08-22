import { defineStore } from "pinia";
import apiClient from '../api';

export const useDNDStore = defineStore("DNDGame", {
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
        activeCharacter: null,
        characters: [],
        memo: "",
        memoSaveStatus: "",
    }),
    actions: {
        async fetchGames() {
            try{
                const response = await apiClient.get("/dnd/game");
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

            this.isLoading = true;
            this.activeCharacter = null;
            this.messages = [{
                _id: 1,
                role: "system",
                content: 'Loading...',
            }];

            try{
                this.activeGameId = gameId;
                this.currenPage = 1;

                const response = await apiClient.get(`/dnd/game/${gameId}`);
                this.title = response.data.title;
                this.messages = response.data.messages;
                this.activeCharacter = response.data.character;
                this.memoSaveStatus = '';
                this.memo = response.data.memo;
                console.log("activeCharacter is:", this.activeCharacter);
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
                this.messages = [{
                    _id: 1,
                    role: "system",
                    content: 'Error ⚠️: Fail to fetch the informaiton of game',
                }]
            } finally {
                this.isLoading = false;
            }
        },
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

                const response = await apiClient.post(`/dnd/gemini/${this.activeGameId}`, {
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

                    const response = await apiClient.post(`/dnd/gemini/${this.activeGameId}`, {
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
                const response = await apiClient.get(`/dnd/gemini`)

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
                await apiClient.put(`/dnd/game/${gameId}`, 
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
                await apiClient.delete(`/dnd/game/${gameId}`);
                
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
        async getCharacterByGameId(){
            try{
                this.isLoading = true;

                console.log("activeGameId is: ", this.activeGameId);

                const response = await apiClient.get(`/dnd/game/character/${this.activeGameId}`);
                this.activeCharacter = response.data.character;
                console.log("activeCharacter is:", this.activeCharacter);
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
            } finally {
                this.isLoading = false;
            }
        },
        async saveMemo(newMemoContent) {
            const newMemoContentTrimed = newMemoContent.trim();
            if (!this.activeGameId || newMemoContentTrimed === this.memo) {
                console.log("not need to save memo");
                return;
            }
            this.memoSaveStatus = "saving...";

            try{
                await apiClient.put(`/dnd/game/${this.activeGameId}`, {
                    memo: newMemoContentTrimed
                })
                this.memo = newMemoContentTrimed;
                this.memoSaveStatus = "save successful";
            } catch {
                console.error("fail to save memo: ", error);
                this.memoSaveStatus = "fail to save memo";
            }

            setTimeout(() => {
                this.memoSaveStatus = ''
            }, 3000);

        },
    },
})
