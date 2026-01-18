<template>
  <ScreenShell
    :title="readyLabel"
    :showBack="showBack"
    :backLabel="backLabel"
    :maxWidthClass="maxWidthClass"
  >
    <div class="mt-3 text-center font-numbers text-3xl text-neon-yellow sm:text-4xl">
      {{ formattedTime }}
    </div>
    <PrimaryButton class="mt-4 sm:py-5" @click="$emit('start')">
      <span class="font-display text-xl text-neon-yellow sm:text-2xl">{{ startLabel }}</span>
    </PrimaryButton>
  </ScreenShell>
</template>

<script setup>
import PrimaryButton from '../components/ui/PrimaryButton.vue'
import ScreenShell from '../components/ui/ScreenShell.vue'

defineProps({
  formattedTime: {
    type: String,
    required: true,
  },
  readyLabel: {
    type: String,
    default: 'Prêt ?',
  },
  startLabel: {
    type: String,
    default: 'Start',
  },
  backLabel: {
    type: String,
    default: '← Back',
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  maxWidthClass: {
    type: String,
    default: 'md:max-w-[33vw]',
  },
})

defineEmits(['start', 'back'])
</script>
