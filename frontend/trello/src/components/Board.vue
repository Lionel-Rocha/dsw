<template>
  <div class="board">
    <h2>{{ title }}</h2>
    <button @click="toggleFavorite" class="favorite-button">
      {{ isFavorite ? '⭐' : '☆' }}
    </button>
    <button @click="openShareModal" class="share-button">🔗 Compartilhar</button>
    <div class="lists">
      <List
          v-for="(list, index) in lists"
          :key="list._id"
          :list="list"
          :list-id="list._id"
          :cards="list.cards"
          :index="index"
          @remove-list="removeList"
          @move-list="moveList"
          @move-card="moveCard"
      />
    </div>
    <button @click="addList">+ Add List</button>

    <div v-if="showShareModal" class="modal">
      <div class="modal-content">
        <h3>Compartilhar Quadro</h3>
        <input v-model="shareEmail" placeholder="Digite o e-mail" />
        <label>
          <input type="checkbox" v-model="shareCanEdit" />
          Pode editar
        </label>
        <button @click="shareBoard">Compartilhar</button>
        <button @click="closeShareModal">Fechar</button>
        <ul>
          <li v-for="(user, index) in sharedUsers" :key="index">
            {{ user.email }} - {{ user.canEdit ? 'Editor' : 'Visualizador' }}
          </li>
        </ul>
      </div>
    </div>
    <button class="delete-btn" @click="deleteBoard">🗑 Delete Board</button>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import List from './List.vue';

const lists = ref([]);
const route = useRoute();
const boardId = route.params.id;
const board = ref([]);
const title = ref('');
const isFavorite = ref(false);

const showShareModal = ref(false);
const shareEmail = ref('');
const shareCanEdit = ref(false);
const sharedUsers = ref([]);
// Função para buscar as informações do quadro
async function fetchBoardInfo() {

  const savedFavorite = localStorage.getItem(`favoriteBoard-${boardId}`);
  isFavorite.value = savedFavorite === 'true';
  const savedShares = localStorage.getItem(`sharedBoard-${boardId}`);
  sharedUsers.value = savedShares ? JSON.parse(savedShares) : [];

  try {
    const response = await fetch(`http://localhost:3000/board/${boardId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    board.value = await response.json();
    title.value = board.value.title;
  } catch (error) {
    console.error('Erro ao buscar quadro:', error);
  }
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  localStorage.setItem(`favoriteBoard-${boardId}`, isFavorite.value.toString());
}

// Função para buscar as listas do quadro
async function fetchLists() {
  try {
    const response = await fetch(`http://localhost:3000/board/${boardId}/lists`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    lists.value = data; // Atualiza as listas
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
}

// Função para adicionar uma nova lista
async function addList() {
  const newList = { title: 'New List' };
  try {
    const response = await fetch(`http://localhost:3000/list/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ boardId, ...newList }),
    });
    if (!response.ok) {
      throw new Error('Erro ao adicionar lista');
    }
    await fetchLists();
  } catch (error) {
    console.error('Erro ao adicionar lista:', error);
  }
}

// Função para remover uma lista
async function removeList(index) {
  const listId = lists.value[index]._id;
  try {
    const response = await fetch(`http://localhost:3000/list/${listId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao remover lista');
    }
    lists.value.splice(index, 1); // Remove a lista localmente
  } catch (error) {
    console.error('Erro ao remover lista:', error);
  }
}

// Função para mover uma lista
function moveList(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < lists.value.length) {
    const temp = lists.value[index];
    lists.value[index] = lists.value[newIndex];
    lists.value[newIndex] = temp;
  }
}

async function moveCard(card, fromListIndex, toListIndex) {
  const cardId = card._id;
  const fromListId = lists.value[fromListIndex]._id;
  const toListId = lists.value[toListIndex]._id;

  try {

    lists.value[fromListIndex].cards = lists.value[fromListIndex].cards.filter(
        (c) => c._id !== cardId
    );
    lists.value[toListIndex].cards.push(card);
  } catch (error) {
    console.error('Erro ao mover o cartão:', error);
  }
}

function openShareModal() {
  showShareModal.value = true;
}
function closeShareModal() {
  showShareModal.value = false;
  shareEmail.value = '';
  shareCanEdit.value = false;
}
function shareBoard() {
  if (!shareEmail.value.trim()) return;
  sharedUsers.value.push({ email: shareEmail.value, canEdit: shareCanEdit.value });
  localStorage.setItem(`sharedBoard-${boardId}`, JSON.stringify(sharedUsers.value));
  closeShareModal();
}

// Função para excluir o board
async function deleteBoard() {
  if (!confirm('Tem certeza de que deseja excluir este board? Essa ação não pode ser desfeita.')) {
    return;
  }

  try {
    // Remover do Local Storage
    localStorage.removeItem(`trelloLists-${boardId}`);

  
    const response = await fetch(`http://localhost:3000/board/${boardId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    if (response.ok) {
      console.log('Board removido com sucesso');
    } else {
      console.error('Erro ao remover o board do backend.');
    }

    // Redirecionar para a página inicial
    router.back();
  } catch (error) {
    console.error('Erro ao remover o board:', error);
  }
}



onMounted(() => {
  fetchBoardInfo();
  fetchLists();
});
</script>

<style scoped>
.favorite-button, .share-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  margin-left: 10px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.board {
  padding: 20px;
}
.lists {
  display: flex;
  gap: 20px;
}

.delete-btn {
  background-color: red;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
}

.delete-btn:hover {
  background-color: darkred;
}
</style>
