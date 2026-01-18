<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40',
      disabled ? 'cursor-not-allowed opacity-60' : '',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
