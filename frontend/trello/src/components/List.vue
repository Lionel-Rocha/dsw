<template>
  <div class="list">
    <div class="list-header">
      <h3 v-if="!isEditing">{{ list.title }}<button v-if="!isEditing" @click="editTitle">
        ✏️
      </button></h3>
      <button class="move-btn" @click="emit('move-list', index, -1)">↑</button>
      <button class="move-btn" @click="emit('move-list', index, 1)">↓</button>
      <button class="remove-btn" @click="removeList">🗑️</button>
      <input
          v-if="isEditing"
          v-model="list.title"
          @blur="updateListTitle"
          @keyup.enter="updateListTitle"
          @remove-list="removeList"
          @edit-list="editList"
          @move-card="moveCard"
      />
    </div>
    <ul>
      <li v-for="(card, index) in list.cards" :key="card._id">
        <span>{{ card.title }}</span>
        <p style="font-size: x-small">{{card.description}}</p>
        <p style="font-size: xx-small">Criado em {{card.created}}</p>
        <p style="font-size: xx-small">Modificado por último em {{card.lastModified}}</p>
        <button @click="removeCard(index)">X</button>
      </li>
    </ul>
    <button v-if="!isAddingCard" @click="toggleAddCardForm">+ Add Card</button>
    <!-- Formulário para adicionar cartão (escondido por padrão) -->
    <form v-if="isAddingCard" @submit.prevent="addCard">
      <div>
        <label for="cardTitle">Card Title</label>
        <input v-model="newCard.title" id="cardTitle" required placeholder="Title" />
      </div>
      <div>
        <label for="cardDescription">Card Description (optional)</label>
        <textarea v-model="newCard.description" id="cardDescription" placeholder="Description (optional)"></textarea>
      </div>
      <div>
        <label for="cardFile">Upload File (optional)</label>
        <input type="file" @change="handleFileUpload" />
      </div>
      <button type="submit">Add Card</button>
      <button type="button" @click="toggleAddCardForm">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const emit = defineEmits(['edit-list', 'add-card', 'remove-list', 'move-list', 'move-card']);

const props = defineProps({
  list: Object, // Lista completa
  listId: String, // ID da lista, passado de Boards.vue
  index: Number,
  cards: Object
});

const newCard = ref({
  title: '',
  description: '',
  file: null, // Para armazenar o arquivo (se enviado)
});

const isEditing = ref(false);
const isAddingCard = ref(false);

function editTitle() {
  isEditing.value = true;
}

function toggleAddCardForm() {
  isAddingCard.value = !isAddingCard.value;
}

// Função para atualizar o título da lista
async function updateListTitle() {
  try {
    const response = await fetch(`http://localhost:3000/list/${props.listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title: props.list.title }),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar título');
    }
    isEditing.value = false;
    console.log('Título atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar título:', error);
  }
}

// Função para remover a lista

function removeList(index) {
  const listId = props.list._id;

  // Confirmar a exclusão antes de proceder
  if (!confirm('Você tem certeza que deseja excluir esta lista?')) {
    return; // Se o usuário cancelar, não faz nada
  }

  fetch(`http://localhost:3000/list/${listId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao excluir lista');
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error('Erro ao remover lista:', error);
      });
}

function editList(index, newTitle) {
  const listId = props.list._id;
  fetch(`http://localhost:3000/list/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ title: newTitle }),
  })
      .then(() => {
        props.list.title = newTitle; // Atualiza localmente
      })
      .catch(error => console.error('Erro ao editar lista:', error));
}

function moveCard(cardIndex, fromListIndex, toListIndex) {
  const [card] = props.list.cards.splice(cardIndex, 1);
  props.list.cards.push(card);
  emit('move-card', card, fromListIndex, toListIndex);
}

async function getCards() {
  try {
    const response = await fetch(`http://localhost:3000/list/${props.listId}/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      props.list.cards = data.cards;
    }
  } catch (err) {
    console.error('Erro durante a requisição:', err);
  }
}

async function addCard() {
  try {
    const cardData = {
      listId: props.listId,
      title: newCard.value.title,
      description: newCard.value.description || null,
      file: newCard.value.file || null,
    };
    const response = await fetch('http://localhost:3000/card/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(cardData),
    });
    if (!response.ok) {
      throw new Error('Erro ao adicionar cartão');
    }
    const addedCard = await response.json();
    window.location.reload(); // Se preferir usar reload após adicionar o card
    resetForm();  // Limpa o formulário
    isAddingCard.value = false;
    console.log('Cartão adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar cartão:', error);
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    newCard.value.file = file;
  }
}

function resetForm() {
  newCard.value.title = '';
  newCard.value.description = '';
  newCard.value.file = null;
}

// Função para remover um cartão
async function removeCard(index) {
  const cardId = props.list.cards[index]._id;
  try {
    const response = await fetch(`http://localhost:3000/card/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });
    if (!response.ok) {
      throw new Error('Erro ao remover cartão');
    }
    window.location.reload();
  } catch (error) {
    console.error('Erro ao remover cartão:', error);
  }
}

onMounted(getCards);
</script>

<style scoped>
.list {
  border: 1px solid #ccc;
  padding: 10px;
}
button {
  cursor: pointer;
  font-size: 1.2em;
}
</style>
