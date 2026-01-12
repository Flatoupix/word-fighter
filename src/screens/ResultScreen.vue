<template>
  <section
    class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 backdrop-blur-sm sm:p-4 md:max-w-[40vw]"
  >
    <button
      type="button"
      class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
      @click="$emit('back')"
    >
      ← Back
    </button>
    <h2 class="text-center font-display text-2xl text-neon-yellow sm:text-3xl">Résultat</h2>
    <div class="mt-4 text-center">
      <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Gagnant</div>
      <div class="font-display text-3xl text-neon-purple sm:text-4xl">{{ winnerLabel }}</div>
      <div class="mt-2 font-numbers text-4xl text-neon-orange sm:text-5xl">{{ winnerScore }}</div>
    </div>
    <div class="mt-6 grid gap-3 text-center md:grid-cols-2">
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ playerLabel }}</div>
        <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ playerScore }}</div>
      </div>
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ opponentLabel }}</div>
        <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ computerScore }}</div>
      </div>
    </div>
    <button
      type="button"
      class="mt-6 w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40 sm:py-4"
      @click="$emit('restart')"
    >
      <span class="font-display text-xl text-neon-yellow sm:text-2xl">Rejouer</span>
    </button>
  </section>
</template>

<script setup>
defineProps({
  winnerLabel: {
    type: String,
    required: true,
  },
  winnerScore: {
    type: Number,
    required: true,
  },
  playerScore: {
    type: Number,
    required: true,
  },
  computerScore: {
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
})

defineEmits(['restart', 'back'])
</script>
