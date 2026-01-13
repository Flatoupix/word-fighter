<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[30rem]">
    <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">
      Choisis ton jeu
    </h2>
    <div class="mt-4 grid gap-4">
      <ModeCard
        mode="word-fight"
        title="Word Fight"
        description="Règles classiques, mots libres."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="kamoulox"
        title="Kamoulox"
        description="Plus l'écart est grand, plus tu scores."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="grammar-war"
        title="Grammar War"
        description="Un type grammatical imposé."
        @select="$emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import ModeCard from '../components/modes/ModeCard.vue'

defineEmits(['select'])
</script>
