<template>
  <div class="list">
    <!-- Campo para edição do título da lista -->
    <input v-model="title" @blur="updateTitle" />

    <!-- Listagem dos cartões -->
    <ul>
      <li v-for="(card, index) in list.cards" :key="card.id">
        <p>{{ card.content }}</p>
        <small>Created: {{ card.createdAt }}</small>
        <small>Last updated: {{ card.updatedAt }}</small>
        <button @click="removeCard(index)">X</button>
      </li>
    </ul>

    <!-- Campo para adicionar novo cartão -->
    <input v-model="newCardContent" placeholder="New card" />
    <button @click="addCard">Add Card</button>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';

// Recebe propriedades e define eventos emitidos
const props = defineProps({ list: Object, index: Number });
const emit = defineEmits(['edit-list', 'add-card']);

// Faz referência às propriedades reativas
const { list, index } = toRefs(props);

// Define os estados locais
const title = ref(list.value.title);
const newCardContent = ref('');

// Atualiza o título da lista e emite evento
function updateTitle() {
  emit('edit-list', index.value, title.value);
}

// Adiciona um novo cartão à lista e emite evento
function addCard() {
  if (newCardContent.value.trim()) {
    const card = {
      id: Date.now(),
      content: newCardContent.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    emit('add-card', index.value, card);
    newCardContent.value = '';
  }
}

// Remove um cartão da lista pelo índice
function removeCard(cardIndex) {
  list.value.cards.splice(cardIndex, 1);
}
</script>

<style scoped>
.list {
  border: 1px solid #ccc;
  padding: 10px;
}

button {
  cursor: pointer;
  font-size: 1em;
  margin-top: 5px;
}
</style>
