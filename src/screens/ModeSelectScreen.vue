<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[30rem]">
    <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">
      Choisis ton mode
    </h2>
    <div class="mt-4 grid gap-4">
      <ModeCard
        mode="pvc"
        title="Player VS Computer"
        description="Affronte l'IA avec des mots aléatoires."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="pvp"
        title="Player VS Player"
        description="Tour par tour en local, même clavier."
        @select="$emit('select', $event)"
      />
      <ModeCard
        mode="online"
        title="Online Battle"
        description="Bientôt dispo, prépare-toi."
        @select="$emit('select', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import ModeCard from '../components/modes/ModeCard.vue'

defineEmits(['select'])
</script>
