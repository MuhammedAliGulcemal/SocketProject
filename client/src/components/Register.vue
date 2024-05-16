<template>
    <div class="wrapper">
      <div class="form">
        <h1>REGISTER PAGE</h1>
        <div class="input-holder">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" required>
        </div>
        <div class="input-holder">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="input-holder">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
      <button @click="register">Register</button>
      <button @click="login">Go Login</button>
      </div>
      
    </div>
  </template>
  
  <script>
  import AuthenticationService from "@/services/AuthenticationService";
  import router from "@/router";
  
  export default {
    data() {
      return {
        name: "",
        username: "",
        password: "",
        error: null,
      };
    },
    methods: {
      async register() {
        try {
          await AuthenticationService.register({
            name: this.name,
            username: this.username,
            password: this.password,
          });
          router.push({ name: "login" });
        } catch (error) {
          this.error = error.response.data.error;
        }
      },
      async login() {
      router.push({ name: "login" });
    },
    },
  };
  </script>
  
  <style scoped>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: auto;
    background-color: #f0f0f0;
  }
  
  
.form {
  display: flex;
  flex-direction: column;
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  .input-holder {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  label {
    font-weight: bold;
  }
  
  .error {
    color: red;
    margin-bottom: 1rem;
  }
  
  button {
    background-color: #ffc107;
    color: #333;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 10px;
  }
  
  button:hover {
    background-color: #ffca28;
  }
  </style>
  