<template>
  <div class="min-h-screen text-neon-yellow">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 text-glow fade-in">
      <header class="text-center">
        <h1 class="font-display text-5xl tracking-wide text-neon-purple">Word Fighter</h1>
        <p class="mt-2 text-sm text-neon-yellow/80">Tape un mot pour marquer des points.</p>
      </header>

      <section class="grid gap-4 md:grid-cols-3">
        <WordListPanel :words="wordListDisp" @toggle="toggleWordVisibility" />
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
        />
      </section>

      <ScoreBoard
        v-model:wordInput="wordInput"
        :playerPoints="playerPoints"
        :comPoints="comPoints"
        :wrongWord="wrongWord"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import BonusPanel from './components/BonusPanel.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import WordDisplayPanel from './components/WordDisplayPanel.vue'
import WordListPanel from './components/WordListPanel.vue'
import { useGameState } from './composables/useGameState'

const {
  wordInput,
  wordListDisp,
  wordChars,
  dynamicFontSize,
  wrongWord,
  pointsAdded,
  superSuiteBonus,
  superShrinkBonus,
  palindromeActive,
  scoreValue,
  playerPoints,
  comPoints,
  addWord,
  toggleWordVisibility,
} = useGameState()

const onSubmit = () => {
  addWord(wordInput.value)
}
</script>
