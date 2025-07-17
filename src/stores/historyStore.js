import { defineStore } from "pinia";
import apiClient from '../api';

export const useHistoryStore = defineStore("history", {
    state: () => ({
        conversations: [],
        isLoading: false,
        activeConversationId: "",
        messages: [],
        title: "New Chat",
        isNewConversation: true,
        userMessage: "",
        isEditingTitle: false,
    }),
    actions: {
        async fetchConversations() {
            try{
                const response = await apiClient.get("/chat");
                console.log(`the number of fetching conversations: ${response.data.conversations[0].updatedAt.slice(0,10)}`)
                this.conversations = response.data.conversations;
            } catch (err){
                console.error("fetch conversation error is: ", err)
                this.conversations = [{_id: 1, title: "error", updatedAt: Date.now()}]
            }
        },
        async selectConveresation(conversationId) {
            this.isNewConversation = false;
            if (this.activeConversationId === conversationId) {
                return;
            }

            this.messages = [{
                _id: 1,
                role: "system",
                content: 'Loading...',
            }];

            try{
                this.activeConversationId = conversationId;

                const response = await apiClient.get(`/chat/${conversationId}`);
                this.title = response.data.title;
                this.messages = response.data.messages;
            } catch (err) {
                console.error(`Error ⚠️: ${err}`)
                this.messages = [{
                    _id: 1,
                    role: "system",
                    content: 'Error ⚠️: Fail to fetch the informaiton of conversation',
                }]
            }
        },
        async sendMessage(){
            if (this.isNewConversation){
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

                if (this.isNewConversation){
                    response = await apiClient.post(`/test/chat/`, {
                    message: sendMessage,
                    });
                    this.activeConversationId = response.data.conversationId;
                    this.isNewConversation = false;
                    await this.fetchConversations();
                } else {
                    response = await apiClient.post(`/test/chat/${this.activeConversationId}`, {
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
            this.isNewConversation = true;
            this.messages = [];
            this.title = "New Chat";
        },
        startEditTitle() {
            if (this.isNewConversation) {
                return;
            }
            this.isEditingTitle = true;
        },
        async editTitle(newTitle){
            const trimmedTitle = newTitle.trim();
            if (!trimmedTitle || trimmedTitle === this.title || this.isNewConversation) {
                this.isEditingTitle = false;
                return;
            }

            const conversationId = this.activeConversationId
            const oldTitle = this.title;
            this.title = trimmedTitle;
            this.isEditingTitle = false;

            try{
                await apiClient.put(`/chat/${conversationId}`, 
                    {title: newTitle}
                );
                const conversationInList = this.conversations.find(c => c._id === conversationId)
                if (conversationInList){
                    conversationInList.title = newTitle
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

        }
    },
    getters: {
        groupedConversations: (state) => {
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

            for (const convo of state.conversations) {
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

            return Object.entries(groups).map(([label, conversations]) => ({ label, conversations})).filter(group => group.conversations.length > 0);
        }
    }
})
