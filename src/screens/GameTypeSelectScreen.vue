<template>
  <ScreenShell title="Choisis ton jeu" class="my-auto">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="word-fight"
        title="Word Fight"
        description="Règles classiques, mots libres."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="kamoulox"
        title="Kamoulox"
        description="Plus l'écart est grand, plus tu scores."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="grammar-war"
        title="Grammar War"
        description="Un type grammatical imposé."
        @select="$emit('select', $event)"
      />
    </div>
  </ScreenShell>
</template>

<script setup>
import ScreenShell from '../components/ui/ScreenShell.vue'
import SelectCard from '../components/ui/SelectCard.vue'

defineEmits(['select'])
</script>
