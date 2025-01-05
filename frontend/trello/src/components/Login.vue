<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" label="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  try {

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "email": email.value, "password":password.value }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login bem-sucedido!');
      window.location.href = '/dashboard';
    } else {
      error.value = data.message || 'Erro no login.';
    }
  } catch (err) {
    error.value = err;
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  display: block;
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #ff69b4; /* Rosa claro */
  outline: none;
}

button {
  background-color: #ff69b4; /* Rosa claro */
  color: #fff;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #db5fa5; /* Rosa mais escuro */
}

p {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
