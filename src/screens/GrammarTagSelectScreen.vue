<template>
  <ScreenShell title="Type grammatical" :showBack="true" @back="$emit('back')">
    <div class="mt-4 grid gap-4">
      <SelectCard value="VER" title="Verbes" description="Seulement des verbes." @select="$emit('select', $event)" />
      <SelectCard
        value="ADJ"
        title="Adjectifs"
        description="Seulement des adjectifs."
        @select="$emit('select', $event)"
      />
      <SelectCard value="NOM" title="Noms" description="Seulement des noms." @select="$emit('select', $event)" />
    </div>
  </ScreenShell>
</template>

<script setup>
import ScreenShell from '../components/ui/ScreenShell.vue'
import SelectCard from '../components/ui/SelectCard.vue'

defineEmits(['select', 'back'])
</script>
