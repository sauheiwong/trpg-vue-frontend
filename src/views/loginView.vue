<template>
  <div class="login-container">
      <form @submit.prevent="login">
        <h2 class="title">Login</h2>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? "Logging in..." : "Login" }}</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import apiClient from '../api';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      isLoading: false,
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.isLoading = true;
      try{
        console.log("login start")
        const response = await apiClient.post("/login", {
            username: this.username,
            password: this.password,
        });

        const token = response.data.token;
        localStorage.setItem("user-token", token);

        this.$router.push("/")
      } catch (err){
        this. error = err.response?.data?.message || "Login fail, please check your username and password"
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: black;
}
form {
  display: flex;
  flex-direction: column;
  width: 50%;
  /* height: 40%; */
  gap: 15px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color);
  font-size: x-large;
}
.title{
    font-size: 50px;
    display: flex;
    justify-content: center;
    color: var(--text-color);
}
.form-group {
  display: flex;
  flex-direction: column;
}

input{
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: xx-large;
}

button{
  padding: 10px 20px;
  border: none;
  background-color: var(--highlight2-color);
  transition: 0.5s ease-in-out;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: xx-large;
  transition: var(--fast-transition);
}

button:hover{
  background-color: var(--tips-color);
  color: black
}

.error-message {
  color: red;
  text-align: center;
}
</style>

