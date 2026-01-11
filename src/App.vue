<template>
  <div class="min-h-screen text-neon-yellow">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 text-glow fade-in">
      <header class="text-center">
        <h1 class="font-display text-5xl tracking-wide text-neon-purple">Word Fighter</h1>
        <p class="mt-2 text-sm text-neon-yellow/80">Tape un mot pour marquer des points.</p>
      </header>

      <ModeSelector v-if="!selectedMode" @select="selectMode" />

      <TimeSelector v-else-if="!selectedDuration" @select="selectDuration" />

      <template v-else>
        <MainBoard
          :words="wordListDisp"
          :wrongWord="wrongWord"
          :pointsAdded="pointsAdded"
          :wordChars="wordChars"
          :dynamicFontSize="dynamicFontSize"
          :superSuiteBonus="superSuiteBonus"
          :superShrinkBonus="superShrinkBonus"
          :palindromeActive="palindromeActive"
          :scoreValue="scoreValue"
          :scoreFontSize="scoreFontSize"
          @toggle="toggleWordVisibility"
        />

        <ScoreBoard
          v-model:wordInput="wordInput"
          :playerPoints="playerPoints"
          :comPoints="comPoints"
          :wrongWord="wrongWord"
          :disabled="computerTurn || isTyping"
          @submit="onSubmit"
        />
        <div class="text-center text-xs text-neon-yellow/60">
          Mode: {{ modeLabel }} · Temps: {{ durationLabel }}
          <button type="button" class="ml-2 text-neon-purple/80 hover:text-neon-purple" @click="resetMode">
            changer
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import MainBoard from './components/modes/MainBoard.vue'
import ModeSelector from './components/modes/ModeSelector.vue'
import TimeSelector from './components/modes/TimeSelector.vue'
import ScoreBoard from './components/ScoreBoard.vue'
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
  scoreFontSize,
  playerPoints,
  comPoints,
  computerTurn,
  isTyping,
  addWord,
  toggleWordVisibility,
} = useGameState()

const selectedMode = ref('')
const selectedDuration = ref(0)
const modeLabel = computed(() => {
  if (selectedMode.value === 'pvc') return 'Player VS Computer'
  if (selectedMode.value === 'pvp') return 'Player VS Player'
  if (selectedMode.value === 'online') return 'Online Battle'
  return ''
})
const durationLabel = computed(() => (selectedDuration.value ? `${selectedDuration.value} min` : ''))

const selectMode = (mode) => {
  selectedMode.value = mode
}

const selectDuration = (minutes) => {
  selectedDuration.value = minutes
}

const resetMode = () => {
  selectedMode.value = ''
  selectedDuration.value = 0
}

const onSubmit = () => {
  addWord(wordInput.value)
}
</script>
