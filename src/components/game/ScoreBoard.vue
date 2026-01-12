<template>
  <section class="grid gap-2 sm:gap-4 md:grid-cols-[1fr_2fr_1fr]">
    <div class="order-1 rounded-md border border-neon-pink/70 bg-black/40 p-2 text-center backdrop-blur-sm sm:p-3 md:order-none">
      <h2 class="font-display text-lg text-neon-yellow sm:text-xl">{{ playerLabel }}</h2>
      <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ playerPoints }}</div>
    </div>
    <div class="order-3 rounded-md border border-neon-pink/70 bg-black/40 p-2 backdrop-blur-sm sm:p-3 md:order-none">
      <input
        ref="inputRef"
        :value="wordInput"
        type="text"
        autocomplete="off"
        :disabled="disabled"
        :class="[
          'w-full rounded-md border border-neon-pink/80 bg-black/30 px-4 py-2 font-display text-xl text-neon-yellow placeholder:text-neon-yellow/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 sm:text-2xl',
          wrongWord ? 'quietMad' : '',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ]"
        @input="$emit('update:wordInput', $event.target.value)"
        @keydown.enter.prevent="$emit('submit')"
        placeholder="Tape ton mot..."
      />
     
      <div class="mt-3 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 sm:text-[10px]">
          <span class="text-neon-yellow/50">Vitesse</span>
          <span class="w-[3.5rem] font-numbers text-sm text-neon-yellow sm:text-sm">{{ speedElapsed }}s</span>
        </div> 
      <div class="flex items-center justify-center gap-3 text-center">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[10px]">Temps</div>
        <div class="font-numbers text-xl text-neon-orange sm:text-xl">{{ formattedTime }}</div>
      </div>
        <div class="flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 sm:text-[10px]">
          <span class="text-neon-yellow/50">Bonus</span>
          <span class="font-numbers text-sm text-neon-orange sm:text-sm">+{{ speedBonus }}</span>
        </div>
      </div>
    </div>
    <div class="order-2 rounded-md border border-neon-pink/70 bg-black/40 p-2 text-center backdrop-blur-sm sm:p-3 md:order-none">
      <h2 class="font-display text-lg text-neon-purple sm:text-xl">{{ opponentLabel }}</h2>
      <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ comPoints }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const inputRef = ref(null)

defineProps({
  playerPoints: {
    type: Number,
    required: true,
  },
  comPoints: {
    type: Number,
    required: true,
  },
  wordInput: {
    type: String,
    required: true,
  },
  wrongWord: {
    type: Boolean,
    required: true,
  },
  speedElapsed: {
    type: String,
    required: true,
  },
  speedBonus: {
    type: Number,
    required: true,
  },
  playerLabel: {
    type: String,
    required: true,
  },
  opponentLabel: {
    type: String,
    required: true,
  },
  formattedTime: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:wordInput', 'submit'])

defineExpose({
  focusInput: () => {
    if (inputRef.value && !inputRef.value.disabled) {
      inputRef.value.focus()
    }
  },
})
</script>
