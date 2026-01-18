<template>
  <ScreenShell
    title="Durée de la partie"
    :showBack="true"
    maxWidthClass="md:max-w-[33vw]"
    @back="$emit('back')"
  >
    <div class="mt-4 grid gap-4">
      <SelectCard :value="1" title="1 min" description="Partie rapide pour s'échauffer." @select="$emit('select', $event)" />
      <SelectCard :value="3" title="3 min" description="Le format idéal pour enchaîner." @select="$emit('select', $event)" />
      <SelectCard :value="5" title="5 min" description="Longue session pour monter le score." @select="$emit('select', $event)" />
    </div>
  </ScreenShell>
</template>

<script setup>
import ScreenShell from '../components/ui/ScreenShell.vue'
import SelectCard from '../components/ui/SelectCard.vue'

defineEmits(['select', 'back'])
</script>
