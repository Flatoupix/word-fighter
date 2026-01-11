<template>
  <button type="button" class="mode-card" @click="$emit('select', mode)">
    <div class="mode-title">{{ title }}</div>
    <p class="mode-desc">{{ description }}</p>
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
