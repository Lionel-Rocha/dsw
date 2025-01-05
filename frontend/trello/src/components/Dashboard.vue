<template>
  <div>
    <h2>Dashboard</h2>
    <p>Bem-vindo à área protegida!</p>
    <div class="actions">
      <button @click="changePassword">Trocar Senha</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';

const data = ref([]);

async function fetchData() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você não está autenticado!');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      alert('Token expirado ou inválido. Faça login novamente.');
      window.location.href = '/login';
      return;
    }

    const result = await response.json();
    data.value = result;
  } catch (err) {
    console.error('Erro ao buscar dados protegidos:', err);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

function changePassword() {
  // Redirecionar para a página de troca de senha
  window.location.href = '/change-password'; // Certifique-se de que essa rota exista no seu app
}

onMounted(fetchData);
</script>

<style scoped>
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}
</style>
