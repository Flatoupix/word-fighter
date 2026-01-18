<template>
  <section
    :class="[
      'mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 backdrop-blur-sm',
      paddingClass,
      maxWidthClass,
    ]"
  >
    <button
      v-if="showBack"
      type="button"
      class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
      @click="$emit('back')"
    >
      {{ backLabel }}
    </button>
    <h2 v-if="title" :class="['text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl', titleClass]">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  backLabel: {
    type: String,
    default: '← Back',
  },
  maxWidthClass: {
    type: String,
    default: 'md:max-w-[30rem]',
  },
  paddingClass: {
    type: String,
    default: 'p-3 py-6 sm:p-4',
  },
  titleClass: {
    type: String,
    default: '',
  },
})

defineEmits(['back'])
</script>
