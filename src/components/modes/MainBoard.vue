<template>
  <section class="main-board grid gap-4 md:grid-cols-[1fr_3fr_1fr]">
    <WordListPanel :words="state.words" @toggle="$emit('toggle', $event)" />
    <WordDisplayPanel
      :wrongWord="state.wrongWord"
      :pointsAdded="state.pointsAdded"
      :wordChars="state.wordChars"
      :dynamicFontSize="state.dynamicFontSize"
    />
    <BonusPanel
      :superSuiteBonus="state.superSuiteBonus"
      :superShrinkBonus="state.superShrinkBonus"
      :palindromeActive="state.palindromeActive"
      :scoreValue="state.scoreValue"
      :scoreFontSize="state.scoreFontSize"
    />
  </section>
</template>

<script setup>
import BonusPanel from '../BonusPanel.vue'
import WordDisplayPanel from '../WordDisplayPanel.vue'
import WordListPanel from '../WordListPanel.vue'

defineProps({
  state: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle'])
</script>
