<template>
  <div class="board">
    <h2>{{ title }}</h2>
    <div class="lists">
      <List
          v-for="(list, index) in lists"
          :key="list._id"
          :list="list"
          :list-id="list._id"
          :cards= "list.cards"
      :index="index"
      @add-card="addCard"
      @remove-list="removeList"
      @edit-list="editList"
      @move-card="moveCard"
      />
    </div>
    <button @click="addList">+ Add List</button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import List from './List.vue';


const lists = ref([]);

// Obtém o `boardId` da rota
const route = useRoute();
const boardId = route.params.id;
const board = ref([]);

const title = ref('');
async function fetchBoardInfo() {
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
async function fetchLists() {
  try {
    // Chamada à API para obter as listas do quadro
    const response = await fetch(`http://localhost:3000/board/${boardId}/lists`);
    if (!response.ok) {
      throw new Error('Erro ao buscar listas');
    }
    const data = await response.json();
    lists.value = data; // Atualiza as listas
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
}

async function addList() {
  const newList = {
    title: 'New List'
  };
  try {
    const response = await fetch(`http://localhost:3000/list/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ boardId, ...newList }),  // Envia o ID do board junto com as informações da lista
    });
    if (!response.ok) {
      throw new Error('Erro ao adicionar lista');
    }
    await fetchLists();  // Recarrega as listas após adicionar
  } catch (error) {
    console.error('Erro ao adicionar lista:', error);
  }
}

function removeList(index) {
  const listId = lists.value[index]._id;

  fetch(`http://localhost:3000/list/${listId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
      .then(() => {
        lists.value.splice(index, 1); // Remove a lista localmente
      })
      .catch(error => console.error('Erro ao remover lista:', error));
}

function editList(index, newTitle) {
  const listId = lists.value[index]._id;

  fetch(`http://localhost:3000/list/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ title: newTitle }),
  })
      .then(() => {
        lists.value[index].title = newTitle; // Atualiza localmente
      })
      .catch(error => console.error('Erro ao editar lista:', error));
}

function addCard(index, card) {
  const listId = lists.value[index]._id;

  fetch(`http://localhost:3000/card/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ listId, ...card }),
  })
      .then(response => response.json())
      .then(data => {
        lists.value[index].cards.push(data); // Atualiza localmente
      })
      .catch(error => console.error('Erro ao adicionar card:', error));
}

function moveCard(cardIndex, fromListIndex, toListIndex) {
  const [card] = lists.value[fromListIndex].cards.splice(cardIndex, 1);
  lists.value[toListIndex].cards.push(card);
}

onMounted(async () => {
  await fetchBoardInfo();
  await fetchLists();
});

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
