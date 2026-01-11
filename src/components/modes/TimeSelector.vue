<template>
  <section class="panel mode-panel">
    <h2 class="panel-title">Durée de la partie</h2>
    <div class="mode-grid">
      <TimeCard :minutes="1" description="Partie rapide pour s'échauffer." @select="$emit('select', $event)" />
      <TimeCard :minutes="3" description="Le format idéal pour enchaîner." @select="$emit('select', $event)" />
      <TimeCard :minutes="5" description="Longue session pour monter le score." @select="$emit('select', $event)" />
    </div>
  </section>
</template>

<script setup>
import TimeCard from './TimeCard.vue'

defineEmits(['select'])
</script>
