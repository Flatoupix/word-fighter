<template>
  <button
    type="button"
    class="rounded-md border border-neon-pink/70 bg-black/30 px-3 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40 sm:px-4 sm:py-5"
    @click="$emit('select', value)"
  >
    <div class="font-display text-xl text-neon-yellow sm:text-2xl">{{ title }}</div>
    <p v-if="description" class="mt-2 font-ui text-xs text-neon-yellow/70 sm:text-sm">
      {{ description }}
    </p>
  </button>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
})

defineEmits(['select'])
</script>
