<template>
  <ScreenShell title="Choisis ton mode" :showBack="true" @back="$emit('back')">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="solo"
        title="Solo"
        description="Un mot aléatoire, puis toi seul."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="pvc"
        title="Player VS Computer"
        description="Affronte l'IA avec des mots aléatoires."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="pvp"
        title="Player VS Player"
        description="Tour par tour en local, même clavier."
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
