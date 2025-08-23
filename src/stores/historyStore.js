import { defineStore } from "pinia";
import apiClient from '../api';

import socket from "@/socket";

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
        activeCharacter: null,
        availableCharacters: [],
        characters: [],
        memo: "",
        memoSaveStatus: "",
    }),
    actions: {
        initailizeSocketListeners() {
            console.log("Setting up socket listeners for history store ...");

            socket.on("game:created", (data) => {
                console.log("Event 'game:created' received: ", data);

                this.messages = [{
                    _id: new Date(),
                    content: data.message,
                    role: "model"
                }];
                this.activeGameId = data.gameId;
                this.isLoading = false;

                this.getAvailableCharacters("");
            });

            socket.on("game:creationError", (error) => {
                console.error("Event 'game:creationError' received: ", error);

                this.messages = [{
                    _id: new Date(),
                    content: `Error ⚠️: ${error.message || 'fail to start a new game'}`,
                    role: "system"
                }];
                this.isLoading = false;
            })

            socket.on("message:received", (data) => {
                const { message, role } = data;
                console.log(`Event, 'message:received' received: ${message} with role: ${role}`);

                const loadingMessageIndex = this.messages.findIndex(
                    (msg) => msg.content === "loading..." && msg.role === "model"
                )

                if (loadingMessageIndex !== -1) {
                    this.messages[loadingMessageIndex] = {
                        _id: new Date(),
                        role,
                        content: message,
                    }
                } else {
                    this.messages.push({
                        _id: new Date(),
                        role,
                        content: message,
                    })
                }
            })

            socket.on("message:error", (data) => {
                console.error("Error ⚠️: fail to send message to gemini or sever: ", data.error);

                const loadingMessageIndex = this.messages.findIndex(
                    (msg) => msg.content === "loading..." && msg.role === "model"
                )

                if (loadingMessageIndex !== -1) {
                    this.messages[loadingMessageIndex] = {
                        _id: new Date(),
                        role: "system",
                        content: "Error ⚠️: fail to send message to gemini or sever",
                    }
                } else {
                    this.messages.push({
                        _id: new Date(),
                        role: "system",
                        content: "Error ⚠️: fail to send message to gemini or sever",
                    })
                }
            })

            // other socket.on
        },
        cleanupSocketListeners() {
            console.log("Cleaning up socket listeners for history store ...");
            socket.disconnect();
            socket.off("game:created");
            socket.off("game:creationError")
            // other socket.off
        },
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

                const response = await apiClient.get(`/game/${gameId}`);
                this.title = response.data.title;
                this.messages = response.data.messages;
                this.activeCharacter = response.data.character;
                this.memoSaveStatus = "";
                this.memo = response.data.memo;

                socket.emit("joinGame", this.activeGameId);
                console.log(`socket emit joinGame with id: ${this.activeGameId }`)
                if (!this.activeCharacter) {
                    this.getAvailableCharacters("");
                }
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

            this.messages.push({
                _id: Date.now() + 1,
                content: "loading...",
                role: "model",
            })

            socket.emit("sendMessage", {
                gameId: this.activeGameId,
                message: sendMessage,
            })
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
            this.isLoading = true;
            this.messages = [{
                _id: Date.now(),
                role: "model",
                content: "starting a new advanture..."
            }];
            this.title = "New Game";
            this.activeCharacter = null;
            this.activeGameId = "";
            console.log("before send a start message to backend")
            socket.emit("game:create");
            console.log("after send a start message to backend")
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
        async getCharacterByGameId(){
            try{
                this.isLoading = true;

                console.log("activeGameId is: ", this.activeGameId);

                const response = await apiClient.get(`/game/character/${this.activeGameId}`);
                if (response.data.character !== null) {
                    return;
                }
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
                await apiClient.put(`/game/${this.activeGameId}`, {
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
        async getAvailableCharacters(query) {
            console.log("query is: ", query)
            this.isLoading = true;

            try{
                const response = await apiClient.get(`/coc/characters?name=${query}`);
                this.availableCharacters = response.data.characters;
                console.log("number of available character is: ", this.availableCharacters.length)
            } catch (error) {
                console.error("fail to get available character: ", error);
            } finally {
                this.isLoading = false;
            }
        }
    },
})
