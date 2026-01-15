<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[30rem]">
    <button
      type="button"
      class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
      @click="$emit('back')"
    >
      ← Back
    </button>
    <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">
      Creer une partie
    </h2>
    <div class="mt-4 grid gap-4">
      <ModeCard
        mode="online"
        title="Creer en ligne"
        description="Invite des joueurs avec un lien."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="local"
        title="Creer en local"
        description="Continue en solo ou versus."
        @select="$emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import ModeCard from '../components/modes/ModeCard.vue'

defineEmits(['select', 'back'])
</script>
