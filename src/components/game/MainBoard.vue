<template>
  <section class="grid h-auto gap-3 md:h-[clamp(20rem,52vh,32rem)] md:gap-4 md:grid-cols-[1fr_3fr_1fr]">
    <div class="grid grid-cols-2 gap-3 md:contents">
      <div class="order-1 md:order-1">
        <WordListPanel :words="state.words" @toggle="$emit('toggle', $event)" />
      </div>
      <div class="order-2 md:order-3">
        <BonusPanel
          :superSuiteBonus="state.superSuiteBonus"
          :superShrinkBonus="state.superShrinkBonus"
          :palindromeActive="state.palindromeActive"
          :scoreValue="state.scoreValue"
          :scoreFontSize="state.scoreFontSize"
        />
      </div>
    </div>
    <div class="order-3 col-span-2 md:order-2 md:col-span-1">
      <WordDisplayPanel
        :wrongWord="state.wrongWord"
        :pointsAdded="state.pointsAdded"
        :wordChars="state.wordChars"
        :dynamicFontSize="state.dynamicFontSize"
      />
    </div>
  </section>
</template>

<script setup>
import BonusPanel from './BonusPanel.vue'
import WordDisplayPanel from './WordDisplayPanel.vue'
import WordListPanel from './WordListPanel.vue'

defineProps({
  state: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle'])
</script>
