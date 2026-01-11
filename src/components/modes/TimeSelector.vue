<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm md:max-w-[33vw]">
    <button
      type="button"
      class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
      @click="$emit('back')"
    >
      ← Back
    </button>
    <h2 class="text-center font-display text-2xl tracking-wide text-neon-yellow">Durée de la partie</h2>
    <div class="mt-4 grid gap-4">
      <TimeCard :minutes="1" description="Partie rapide pour s'échauffer." @select="$emit('select', $event)" />
      <TimeCard :minutes="3" description="Le format idéal pour enchaîner." @select="$emit('select', $event)" />
      <TimeCard :minutes="5" description="Longue session pour monter le score." @select="$emit('select', $event)" />
    </div>
  </section>
</template>

<script setup>
import TimeCard from './TimeCard.vue'

defineEmits(['select', 'back'])
</script>
