<template>
  <div class="list">
    <div class="list-header">
      <!-- Campo para edição do título da lista -->
      <input v-model="title" @blur="updateTitle" />
      <button @click="emit('remove-list', index)">🗑</button>
    </div>

    <!-- Botões para mover a lista -->
    <div class="list-move">
      <button @click="emit('move-list', index, -1)">⬆</button>
      <button @click="emit('move-list', index, 1)">⬇</button>
    </div>

    <!-- Listagem dos cartões -->
    <ul>
      <li v-for="(card, cardIndex) in list.cards" :key="card.id">
        <p>{{ card.content }}</p>
        <small>Created: {{ card.createdAt }}</small>
        <small>Last updated: {{ card.updatedAt }}</small>
        <button @click="removeCard(cardIndex)">X</button>
      </li>
    </ul>

    <!-- Campo para adicionar novo cartão -->
    <input v-model="newCardContent" placeholder="New card" />
    <button @click="addCard">Add Card</button>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';

const props = defineProps({ list: Object, index: Number });
const emit = defineEmits(['edit-list', 'add-card', 'remove-list', 'move-list']);

const { list, index } = toRefs(props);
const title = ref(list.value.title);
const newCardContent = ref('');

function updateTitle() {
  emit('edit-list', index.value, title.value);
}

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

function removeCard(cardIndex) {
  list.value.cards.splice(cardIndex, 1);
}
</script>

<style scoped>
.list {
  border: 1px solid #ccc;
  padding: 10px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-move {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

button {
  cursor: pointer;
  font-size: 1em;
  margin-top: 5px;
}
</style>
