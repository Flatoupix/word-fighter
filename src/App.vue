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
        <section v-if="!isStarted" class="panel mode-panel">
          <h2 class="panel-title">Prêt ?</h2>
          <div class="game-timer">{{ formattedTime }}</div>
          <button type="button" class="mode-card mt-4" @click="startTimer">Start</button>
        </section>

        <template v-else>
          <div class="game-meta">
            <div class="game-meta__label">Temps</div>
            <div class="game-meta__time">{{ formattedTime }}</div>
          </div>
        <MainBoard :state="mainBoardState" @toggle="toggleWordVisibility" />

          <ScoreBoard
            v-model:wordInput="wordInput"
            :playerPoints="playerPoints"
            :comPoints="comPoints"
            :wrongWord="wrongWord"
            :speedElapsed="isStarted ? speedElapsedDisplay : '0.0'"
            :speedBonus="isStarted ? speedBonus : 0"
            :disabled="computerTurn || isTyping || !isStarted"
            @submit="onSubmit"
          />
          <div class="text-center text-xs text-neon-yellow/60">
            Mode: {{ modeLabel }} · Temps: {{ durationLabel }}
            <button type="button" class="ml-2 text-neon-purple/80 hover:text-neon-purple" @click="resetMode">
              changer
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
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
  speedElapsed,
  speedBonus,
  scoreFontSize,
  playerPoints,
  comPoints,
  computerTurn,
  isTyping,
  startGame,
  stopGame,
  addWord,
  toggleWordVisibility,
} = useGameState()

const selectedMode = ref('')
const selectedDuration = ref(0)
const isStarted = ref(false)
const timeLeft = ref(0)
let timerId = null
const modeLabel = computed(() => {
  if (selectedMode.value === 'pvc') return 'Player VS Computer'
  if (selectedMode.value === 'pvp') return 'Player VS Player'
  if (selectedMode.value === 'online') return 'Online Battle'
  return ''
})
const durationLabel = computed(() => (selectedDuration.value ? `${selectedDuration.value} min` : ''))
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
const speedElapsedDisplay = computed(() => speedElapsed.value.toFixed(1))
const mainBoardState = computed(() => ({
  words: wordListDisp.value,
  wrongWord: wrongWord.value,
  pointsAdded: pointsAdded.value,
  wordChars: wordChars.value,
  dynamicFontSize: dynamicFontSize.value,
  superSuiteBonus: superSuiteBonus.value,
  superShrinkBonus: superShrinkBonus.value,
  palindromeActive: palindromeActive.value,
  scoreValue: scoreValue.value,
  scoreFontSize: scoreFontSize.value,
}))

const selectMode = (mode) => {
  selectedMode.value = mode
}

const selectDuration = (minutes) => {
  selectedDuration.value = minutes
  timeLeft.value = minutes * 60
}

const resetMode = () => {
  selectedMode.value = ''
  selectedDuration.value = 0
  timeLeft.value = 0
  isStarted.value = false
  stopTimer()
}

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  stopGame()
}

const startTimer = () => {
  if (!selectedDuration.value) {
    return
  }
  stopTimer()
  timeLeft.value = selectedDuration.value * 60
  isStarted.value = true
  startGame()
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
      return
    }
    timeLeft.value = 0
    isStarted.value = false
    stopTimer()
  }, 1000)
}

const onSubmit = () => {
  addWord(wordInput.value)
}

onBeforeUnmount(() => {
  stopTimer()
})
</script>
