<template>
  <button
    type="button"
    class="rounded-md border border-neon-pink/70 bg-black/30 px-4 py-5 text-center transition hover:border-neon-purple/80 hover:bg-black/40"
    @click="$emit('select', mode)"
  >
    <div class="font-display text-2xl text-neon-yellow">{{ title }}</div>
    <p class="mt-2 font-ui text-sm text-neon-yellow/70">{{ description }}</p>
  </button>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
</script>
