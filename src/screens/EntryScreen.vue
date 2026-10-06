<template>
  <ScreenShell title="Bienvenue">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="join"
        title="Rejoindre une partie"
        description="Accès direct avec un code ou un lien."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="create"
        title="Créer une partie"
        description="Choisis ensuite en ligne ou en local."
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
