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
      />
    </div>
    <button @click="addList">+ Add List</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import List from './List.vue';

const title = ref('My Board');
const lists = ref([
  { id: 1, title: 'To Do', cards: [] },
  { id: 2, title: 'Doing', cards: [] },
  { id: 3, title: 'Done', cards: [] },
]);

function addList() {
  const newList = { id: Date.now(), title: 'New List', cards: [] };
  lists.value.push(newList);
}

function removeList(index) {
  lists.value.splice(index, 1);
}

function editList(index, newTitle) {
  lists.value[index].title = newTitle;
}

function addCard(index, card) {
  lists.value[index].cards.push(card);
}

function moveCard(cardIndex, fromListIndex, toListIndex) {
  const [card] = lists.value[fromListIndex].cards.splice(cardIndex, 1);
  lists.value[toListIndex].cards.push(card);
}
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
