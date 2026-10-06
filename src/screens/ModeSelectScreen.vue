<template>
  <ScreenShell title="Choisis ton mode" :showBack="true" @back="$emit('back')">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="solo"
        title="Solo"
        description="Un mot aléatoire, puis toi seul face au chrono."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="pvc"
        title="Joueur VS Ordinateur"
        description="Affronte l'IA avec des mots aléatoires."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="pvp"
        title="Joueur VS Joueur"
        description="Tour par tour en local, sur le même clavier."
        @select="$emit('select', $event)"
      />
    </div>
  </ScreenShell>
</template>

<script setup>
import ScreenShell from '../components/ui/ScreenShell.vue'
import SelectCard from '../components/ui/SelectCard.vue'

defineEmits(['select', 'back'])
</script>
