import { defineStore } from "pinia";
import apiClient from '../api';

export const useCharacterStore = defineStore("character", {
    state: () => ({
        characters: [],
        isLoading: false,
        activeCharacterId: "",
        activeChatId: "",
        messages: [],
        userMessage: "",
        title: "Create a new character",
    }),
    actions: {
        async fetchCharacters() {
            try{
                const response = await apiClient.get("/characters");
                console.log(`the number of fetching characters: ${response.data.characters.length}`)
                this.characters = response.data.characters;
            } catch (err){
                console.error("fetch character error is: ", err)
                this.characters = [{_id: 1, title: "error", updatedAt: Date.now()}]
            }
        },
        async selectChat(chatId) {
            if (this.activeChatId === chatId) {
                return;
            }

            console.log("start fetching chat infor with id: ", chatId)

            this.messages = [{
                _id: 1,
                role: "system",
                content: 'Loading...',
            }];

            try{
                this.activeChatId = chatId;

                const response = await apiClient.get(`/chat/characters/${chatId}`);
                console.log("response is: ", response)
                this.messages = response.data.messages;
                this.activeCharacterId = response.data.character._id;
                this.activeChatId = chatId;
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
                this.messages = [{
                    _id: 1,
                    role: "system",
                    content: 'Error ⚠️: Fail to fetch the informaiton of character',
                }]
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

            this.messages.push({
                _id: Date.now() + 1,
                content: "loading...",
                role: "model",
            })

            try{ 

                const response = await apiClient.post(`/gemini/characters/${this.activeChatId}`, {
                    message: sendMessage,
                });

                this.messages[this.messages.length - 1].content = response.data.message;

            } catch (err){
                console.error(`Error ⚠️: ${err}`);
                this.messages[this.messages.length - 1].content = err.response?.data?.message || "fetch fail or server error"
            }
        },
        async newChat(){
            this.messages = [];
            this.title = "Create a new character";

            try{
                const response = await apiClient.get(`/gemini/characters`)

                console.log(`response is ${response}`);

                this.messages.push({
                    _id: new Date(),
                    content: response.data.message,
                    role: "model"
                })

                this.activeCharacterId = response.data.characterId;
                this.activeChatId = response.data.chatId

                return this.activeCharacterId;

            } catch (err) {
                console.error(`Error ⚠️: fail to start a new character chat: ${err}`)
                this.messages.push({
                    _id: new Date(),
                    content: "Error ⚠️: fail to start a new character chat",
                    role: "system"
                });
                return null;
            }
        },
        // async deleteGame(gameId) {
        //     try{
        //         await apiClient.delete(`/game/${gameId}`);
                
        //         this.games = this.games.filter(game => game._id !== gameId)

        //         if (this.activeGameId === gameId) {
        //             this.newChat()
        //         }
        //     } catch (err){
        //         console.error("Error deleting game:", err);
        //         this.title = `Error⚠️`;
        //         this.messages.push({
        //             _id: new Date(),
        //             role: "system",
        //             content: "Error ⚠️: Failed to deleting game"
        //         })
        //     }
        // },
    },
})
