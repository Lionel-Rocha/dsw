<template>
  <div class="boards">
    <router-link to="/change-password">Trocar a senha</router-link>
    <button @click="logout">Logout</button>
    <h2>Meus Quadros</h2>
    <ul>
      <li
          v-for="board in boards"
          :key="board._id"
          @click="goToBoard(board._id)"
          class="board-item"
          :style="{ backgroundcolor: board.backgroundcolor, color: board.titlecolor }"
      >
        {{ board.title }}
      </li>
    </ul>
    <button @click="openCreateBoardModal" class="create-board-button">+ Criar Quadro</button>
  </div>

  <!-- Modal para criação de quadros -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>Criar Novo Quadro</h3>
      <form @submit.prevent="createBoard">
        <div>
          <label for="title">Título:</label>
          <input type="text" v-model="newBoard.title" required />
        </div>
        <div>
          <label for="backgroundColor">Cor de Fundo:</label>
          <input type="color" v-model="newBoard.backgroundcolor" />
        </div>
        <div>
          <label for="titleColor">Cor do Título:</label>
          <input type="color" v-model="newBoard.titlecolor" />
        </div>
        <div class="modal-actions">
          <button type="submit">Criar</button>
          <button type="button" @click="closeCreateBoardModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import router from "../../router/index.js";
import ChangePassword from "./ChangePassword.vue";

const boards = ref([]);
const showModal = ref(false);
const newBoard = ref({
  title: '',
  backgroundcolor: '#ffffff',
  titlecolor: '#000000',
});

function logout() {
  localStorage.removeItem('token'); // Remove o token do armazenamento local
  router.push('/login');
}
// Carregar os quadros do usuário
async function fetchBoards() {
  try {
    const response = await fetch('http://localhost:3000/user/boards', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    boards.value = data;
  } catch (error) {
    console.error('Erro ao carregar quadros:', error);
  }
}

// Navegar para o quadro selecionado
function goToBoard(boardId) {
  router.push(`/board/${boardId}`);
}

// Abrir modal para criação de quadros
function openCreateBoardModal() {
  showModal.value = true;
}

// Fechar modal para criação de quadros
function closeCreateBoardModal() {
  showModal.value = false;
  newBoard.value = {
    title: '',
    backgroundcolor: '#ffffff',
    titlecolor: '#000000',
  };
}

// Criar um novo quadro
async function createBoard() {
  try {
    console.log(newBoard.value);
    const response = await fetch('http://localhost:3000/board/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newBoard.value)
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Erro ao criar quadro');
    }

    const createdBoard = await response.json();
    boards.value.push(createdBoard);
    closeCreateBoardModal();
  } catch (error) {
    console.error('Erro ao criar quadro:', error);
  }
}

onMounted(fetchBoards);
</script>

<style scoped>

h2 {
  text-align: center;
}

.boards {
  padding: 20px;
}

.board-item {
  padding: 10px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  transition: transform 0.2s ease-in-out;
}

.board-item:hover {
  transform: scale(1.05);
}

.create-board-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  background-color: #6200ee;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-board-button:hover {
  background-color: #3700b3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

li {
  list-style-type: none;
}
</style>
