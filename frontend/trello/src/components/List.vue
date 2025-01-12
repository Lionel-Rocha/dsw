<template>
  <div class="list">
    <input v-model="title" @blur="updateTitle" />
    <ul>
      <li v-for="(card, index) in list.cards" :key="card.id">
        {{ card.content }}
        <button @click="removeCard(index)">X</button>
      </li>
    </ul>
    <input v-model="newCardContent" placeholder="New card" />
    <button @click="addCard">Add Card</button>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
const props = defineProps({ list: Object, index: Number });
const { list, index } = toRefs(props);

const title = ref(list.value.title);
const newCardContent = ref('');

function updateTitle() {
  emit('edit-list', index.value, title.value);
}

function addCard() {
  if (newCardContent.value.trim()) {
    emit('add-card', index.value, { id: Date.now(), content: newCardContent.value });
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
</style>
