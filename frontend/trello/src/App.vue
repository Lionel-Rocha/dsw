<template>
  <div id="app">
    <header>
      <nav>

        <!--        <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>-->
        <!--        <button v-if="isAuthenticated" @click="logout">Logout</button>-->
      </nav>
    </header>
    <main>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(localStorage.getItem('token') !== null);

function logout() {
  localStorage.removeItem('token'); // Remove o token do armazenamento local
  isAuthenticated.value = false;
  router.push('/login'); // Redireciona para a página de login
}
</script>

<style scoped>


#app {
  font-family: Arial, sans-serif;
  padding: 20px;

}

header nav {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

header nav a {
  text-decoration: none;
  color: #007bff;
}

header nav a:hover {
  text-decoration: underline;
}

button {
  border: none;
  background-color: transparent;
  color: #007bff;
  cursor: pointer;
  font-size: 1em;
}

button:hover {
  text-decoration: underline;
}
</style>