<template>
  <div class="board">
    <h2>{{ title }}</h2>
    <div class="lists">
      <List
        v-for="(list, index) in lists"
        :key="list.id"
        :list="list"
        :index="index"
        @add-card="addCard"
        @remove-list="removeList"
        @edit-list="editList"
        @move-card="moveCard"
        @move-list="moveList"
      />
    </div>
    <button @click="addList">+ Add List</button>
    <button @click="saveBoard">Save Board</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import List from './List.vue';

const title = ref('My Board');
const lists = ref([]);
const route = useRoute();
const boardId = route.params.id;

// Função para carregar o estado inicial do backend ou do Local Storage
async function fetchBoardInfo() {
  try {
    const savedLists = localStorage.getItem(`trelloLists-${boardId}`);
    if (savedLists) {
      lists.value = JSON.parse(savedLists);
    } else {
      const response = await fetch(`http://localhost:3000/board/${boardId}/lists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        lists.value = data;
        saveBoard();
      } else {
        console.error('Erro ao buscar listas do backend.');
      }
    }
  } catch (error) {
    console.error('Erro ao buscar informações do quadro:', error);
  }
}

function saveBoard() {
  localStorage.setItem(`trelloLists-${boardId}`, JSON.stringify(lists.value));
}

function addList() {
  const newList = { id: Date.now(), title: 'New List', cards: [] };
  lists.value.push(newList);
  saveBoard();
}

function removeList(index) {
  lists.value.splice(index, 1);
  saveBoard();
}

function editList(index, newTitle) {
  lists.value[index].title = newTitle;
  saveBoard();
}

function addCard(index, card) {
  lists.value[index].cards.push(card);
  saveBoard();
}

function moveCard(cardIndex, fromListIndex, toListIndex) {
  const [card] = lists.value[fromListIndex].cards.splice(cardIndex, 1);
  lists.value[toListIndex].cards.push(card);
  card.updatedAt = new Date().toISOString();
  saveBoard();
}

// Função para mover uma lista para cima ou para baixo
function moveList(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < lists.value.length) {
    const temp = lists.value[index];
    lists.value[index] = lists.value[newIndex];
    lists.value[newIndex] = temp;
    saveBoard();
  }
}

onMounted(fetchBoardInfo);
</script>

<style scoped>
.board {
  padding: 20px;
}

.lists {
  display: flex;
  gap: 20px;
}
</style>
