<template>
  <section
    class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-4 backdrop-blur-sm md:max-w-[40vw]"
  >
    <h2 class="text-center font-display text-3xl text-neon-yellow">Résultat</h2>
    <div class="mt-4 text-center">
      <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Gagnant</div>
      <div class="font-display text-4xl text-neon-purple">{{ winnerLabel }}</div>
      <div class="mt-2 font-numbers text-5xl text-neon-orange">{{ winnerScore }}</div>
    </div>
    <div class="mt-6 grid gap-3 text-center md:grid-cols-2">
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Player</div>
        <div class="font-numbers text-3xl text-neon-yellow">{{ playerScore }}</div>
      </div>
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Computer</div>
        <div class="font-numbers text-3xl text-neon-yellow">{{ computerScore }}</div>
      </div>
    </div>
    <button
      type="button"
      class="mt-6 w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-4 text-center transition hover:border-neon-purple/80 hover:bg-black/40"
      @click="$emit('restart')"
    >
      <span class="font-display text-2xl text-neon-yellow">Rejouer</span>
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
})

defineEmits(['restart'])
</script>
