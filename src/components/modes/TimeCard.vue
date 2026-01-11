<template>
  <button type="button" class="mode-card" @click="$emit('select', minutes)">
    <div class="mode-title">{{ minutes }} min</div>
    <p class="mode-desc">{{ description }}</p>
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
