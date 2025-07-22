<template>
  <div id="chat-layout">
    <div class="main-content">
        <h2>Setting</h2>
        <div v-if="isLoading" class="loading-container">
            <p>Loading your setting...</p>
        </div>
        <div v-else class="setting-container">
            <SettingOption 
            v-for="option in options"
            :option="option"
            @update-value="updateValue"
            :key="option.id"
            />
        </div>
        <div class="button-container">
            <button @click="saveSetting" :disabled="isLoading">Save</button>
            <router-link :to="'/home'" >Back</router-link>
        </div>
    </div>
  </div>
</template>

<script>
import SettingOption from '@/components/SettingOption.vue';
import apiClient from '@/api';

export default {
    name: "SettingView",
    components: {
        SettingOption
    },
    created() {
        this.buildInfor();
    },
    methods: {
        async buildInfor() {
            await this.getUserInfor();
            Object.entries(this.infor).forEach(([key, value], index) => {
                this.options.push({
                    id: index,
                    value: value,
                    label: key,
                    placeholder: `your ${value}`,
                    type: "text",
                })
            })
        },
        updateValue(label, value) {
            this.infor[label] = value;
        },
        async getUserInfor() {
            console.log("start get user infor");

            try{
                this.isLoading = true
                const response = await apiClient.get("/user")
                this.infor = response.data;
            } catch (error) {
                console.error(`Error ⚠️: fail to get user infor: ${error}`)
            } finally {
                this.isLoading = false;
            }
        },
        async saveSetting(){
            console.log("this.infor is: ",this.infor)
            try {
                console.log("start save new settings.");
                await apiClient.put("/user", this.infor);
                this.$router.push("/home");
            } catch (error) {
                console.error(`Error ⚠️: fail to update user infor: ${error}`)
            }
        }
    },
    data(){
        return {
            options: [],
            infor: {},
            isLoading: false,
        }
    },
}

</script>

<style scoped>

#chat-layout {
  display: flex;
  height: 100vh; /* 讓佈局佔滿整個視窗高度 */
  justify-content: center;
  align-items: center;
}

h2{
    border-bottom: 1px solid white;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50%;
  width: 80%;
  gap: 15px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color);
  font-size: x-large;
}

.setting-container{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
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