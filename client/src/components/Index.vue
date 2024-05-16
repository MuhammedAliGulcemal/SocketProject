<template>
    <div class="wrapper">
        <button  @click="navigateTo({ name: 'login' })">Login</button>
        <button  @click="navigateTo({ name: 'register' })">Register</button>
    </div>
</template>

<script>
export default {
    methods: {
        navigateTo(route) {
            this.$router.push({ name: route.name });
        }
    }
};
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    background-color: #f0f0f0;
}


button {
    background-color: #ffc107;
    color: #333;
    padding: 1%;
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
