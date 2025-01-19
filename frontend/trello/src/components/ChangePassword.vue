<template>
  <div class="change-password">
    <h2>Trocar Senha</h2>
    <form @submit.prevent="handleChangePassword">
      <div>
        <label for="current-password">Senha Atual:</label>
        <br>
        <input type="password" v-model="currentPassword" required />
      </div>
      <div>
        <label for="new-password">Nova Senha:</label>
        <br>
        <input type="password" v-model="newPassword" required />
      </div>
      <div>
        <label for="confirm-password">Confirme a Nova Senha:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit">Atualizar Senha</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');

async function handleChangePassword() {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As novas senhas não coincidem.';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/user/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userToken: token,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });

    if (!response.ok) {
      const resData = await response.json();
      error.value = resData.message || 'Erro ao trocar senha.';
      return;
    }

    success.value = 'Senha alterada com sucesso!';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    error.value = '';
  } catch (err) {
    error.value = 'Erro ao conectar ao servidor.';
  }
}
</script>

<style scoped>
.change-password {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

h2{
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #333;
}

label {
  font-size: 14px;
}

input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #db5fa5;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>