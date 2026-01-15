<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[30rem]">
    <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">
      Choisis comment jouer
    </h2>
    <div class="mt-4 grid gap-4">
      <ModeCard
        mode="online"
        title="Rejoindre un salon"
        description="Acces direct avec un code ou un lien."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="local"
        title="Jouer en local"
        description="Continue avec les modes offline."
        @select="$emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import ModeCard from '../components/modes/ModeCard.vue'

defineEmits(['select'])
</script>
