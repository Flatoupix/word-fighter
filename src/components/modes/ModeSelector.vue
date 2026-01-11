<template>
  <section class="panel mode-panel">
    <h2 class="panel-title">Choisis ton mode</h2>
    <div class="mode-grid">
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
import ModeCard from './ModeCard.vue'

defineEmits(['select'])
</script>
