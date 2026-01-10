<template>
  <aside class="panel">
    <h2 class="panel-title">Mots</h2>
    <ul class="mt-3 space-y-2">
      <li v-for="(word, index) in words" :key="index">
        <button type="button" class="word-item font-accent" @click="$emit('toggle', index)">
          {{ word.text }}
        </button>
        <p v-if="word.visible && word.description" class="mt-1 text-sm text-neon-orange/90">
          {{ word.description }}
        </p>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  words: {
    type: Array,
    required: true,
  },
})

defineEmits(['toggle'])
</script>
