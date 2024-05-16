import { createRouter, createWebHistory } from 'vue-router';


import Register from '../components/Register.vue';
import Index from '../components/Index.vue';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';


const routes = [
    { path: '/', name: "index", component: Index },
    { path: '/register', name: "register", component: Register },
    { path: '/login', name: "login", component: Login },
    { path: '/home', name: "home", component: Home }
   
];



const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;