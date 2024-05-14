<template>
    
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>

        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>

        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>

        <button @click="register">Register</button>
  
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService"
import axios from "axios"
export default {
    data() {
        return {
            name: '',
            username: '',
            password: ''
        };
    },
    methods: {
        async register() {
            await AuthenticationService.register({
                name:this.name,
                username:this.username,
                password:this.password

            })
           
        }
    }
};
</script>