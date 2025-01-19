<template>
  <div class="list">
    <div class="list-header">
      <h3 v-if="!isEditing">{{ list.title }}<button v-if="!isEditing" @click="editTitle">
        ✏️
      </button></h3>
      <input
          v-if="isEditing"
          v-model="list.title"
          @blur="updateListTitle"
          @keyup.enter="updateListTitle"
      />

    </div>
    <ul>
      <li v-for="card in list.cards" :key="card._id">
        <span>{{ card.title }}</span>
        <button @click="removeCard(card)">X</button>
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
import {onMounted, ref} from 'vue';

const props = defineProps({
  list: Object,       // Lista completa
  listId: String,     // ID da lista, passado de Boards.vue
  index: Number,
  cards: Object
});

const newCard = ref({
  title: '',
  description: '',
  file: null,          // Para armazenar o arquivo (se enviado)
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

async function getCards(){
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
    // Preparando os dados do cartão
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
    props.list.cards.push(addedCard);  // Atualiza os cartões da lista
    resetForm();  // Limpa o formulário
    isAddingCard.value = false;
    console.log('Cartão adicionado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar cartão:', error);
  }
}

// Função para lidar com o upload de arquivo
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    newCard.value.file = file;
  }
}

// Função para limpar o formulário
function resetForm() {
  newCard.value.title = '';
  newCard.value.description = '';
  newCard.value.file = null;
}

// Função para remover um cartão
async function removeCard(cardIndex) {
  const cardId = props.list.cards[cardIndex]._id;
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
    props.list.cards.splice(cardIndex, 1);  // Remove o cartão da lista
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