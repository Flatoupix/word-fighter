<template>
  <section class="main-board grid gap-4 md:grid-cols-[1fr_3fr_1fr]">
    <WordListPanel :words="words" @toggle="$emit('toggle', $event)" />
    <WordDisplayPanel
      :wrongWord="wrongWord"
      :pointsAdded="pointsAdded"
      :wordChars="wordChars"
      :dynamicFontSize="dynamicFontSize"
    />
    <BonusPanel
      :superSuiteBonus="superSuiteBonus"
      :superShrinkBonus="superShrinkBonus"
      :palindromeActive="palindromeActive"
      :scoreValue="scoreValue"
      :scoreFontSize="scoreFontSize"
    />
  </section>
</template>

<script setup>
import BonusPanel from '../BonusPanel.vue'
import WordDisplayPanel from '../WordDisplayPanel.vue'
import WordListPanel from '../WordListPanel.vue'

defineProps({
  words: {
    type: Array,
    required: true,
  },
  wrongWord: {
    type: Boolean,
    required: true,
  },
  pointsAdded: {
    type: Array,
    required: true,
  },
  wordChars: {
    type: Array,
    required: true,
  },
  dynamicFontSize: {
    type: String,
    required: true,
  },
  superSuiteBonus: {
    type: Number,
    required: true,
  },
  superShrinkBonus: {
    type: Number,
    required: true,
  },
  palindromeActive: {
    type: Boolean,
    required: true,
  },
  scoreValue: {
    type: Number,
    required: true,
  },
  scoreFontSize: {
    type: String,
    required: true,
  },
})

defineEmits(['toggle'])
</script>
