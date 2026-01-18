<template>
  <ScreenShell title="Bienvenue">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="join"
        title="Rejoindre une partie"
        description="Acces direct avec un code ou un lien."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="create"
        title="Creer une partie"
        description="Choisis ensuite online ou local."
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
