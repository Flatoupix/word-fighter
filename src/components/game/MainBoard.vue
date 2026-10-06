<template>
  <section class="flex flex-col gap-3 md:grid md:h-[clamp(20rem,52vh,32rem)] md:items-start md:gap-4 md:grid-cols-[1fr_3fr_1fr]">
    <!-- Mobile: WordDisplayPanel on Top; Desktop: Center -->
    <div class="order-1 md:order-2 md:col-span-1">
      <WordDisplayPanel
        :wrongWord="state.wrongWord"
        :pointsAdded="state.pointsAdded"
        :wordChars="state.wordChars"
        :dynamicFontSize="state.dynamicFontSize"
        :combatPopups="state.combatPopups"
        :feverActive="state.feverActive"
      />
    </div>

    <!-- Word List: Mobile order 2 (left/compact) -->
    <div class="order-2 grid grid-cols-2 gap-2 md:contents">
      <div class="self-start md:order-1">
        <WordListPanel :words="state.words" :playerColors="state.playerColors" @toggle="$emit('toggle', $event)" />
      </div>
      <div class="self-start md:order-3">
        <BonusPanel
          :superSuiteBonus="state.superSuiteBonus"
          :superShrinkBonus="state.superShrinkBonus"
          :anagramBonus="state.anagramBonus"
          :doubleLetterBonus="state.doubleLetterBonus"
          :palindromeActive="state.palindromeActive"
          :scoreValue="state.scoreValue"
          :scoreFontSize="state.scoreFontSize"
        />
      </div>
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
