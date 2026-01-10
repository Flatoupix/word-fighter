<template>
  <section class="grid gap-4 md:grid-cols-[1fr_2fr_1fr]">
    <div class="panel text-center">
      <h2 class="font-display text-xl text-neon-orange">Player</h2>
      <div class="score">{{ playerPoints }}</div>
    </div>
    <div class="panel">
      <input
        :value="wordInput"
        type="text"
        autocomplete="off"
        :class="['input-field', wrongWord ? 'quietMad' : '']"
        @input="$emit('update:wordInput', $event.target.value)"
        @keydown.enter.prevent="$emit('submit')"
        placeholder="Tape ton mot..."
      />
    </div>
    <div class="panel text-center">
      <h2 class="font-display text-xl text-neon-orange">Computer</h2>
      <div class="score">{{ comPoints }}</div>
    </div>
  </section>
</template>

<script setup>
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
})

defineEmits(['update:wordInput', 'submit'])
</script>
