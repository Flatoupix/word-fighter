<template>
  <button
    type="button"
    class="rounded-md border border-neon-pink/70 bg-black/30 px-3 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40 sm:px-4 sm:py-5"
    @click="$emit('select', minutes)"
  >
    <div class="font-display text-xl text-neon-yellow sm:text-2xl">{{ minutes }} min</div>
    <p class="mt-2 font-ui text-xs text-neon-yellow/70 sm:text-sm">{{ description }}</p>
  </button>
</template>

<script setup>
defineProps({
  minutes: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
</script>
