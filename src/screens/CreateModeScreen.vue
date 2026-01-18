<template>
  <ScreenShell title="Creer une partie" :showBack="true" @back="$emit('back')">
    <div class="mt-4 grid gap-4">
      <SelectCard
        value="online"
        title="Creer en ligne"
        description="Invite des joueurs avec un lien."
        @select="$emit('select', $event)"
      />
      <SelectCard
        value="local"
        title="Creer en local"
        description="Continue en solo ou versus."
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
