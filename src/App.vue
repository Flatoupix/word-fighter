<template>
  <div class="min-h-screen text-neon-yellow">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 text-glow fade-in">
      <header class="text-center">
        <h1 class="font-display text-5xl tracking-wide text-neon-purple">Word Fighter</h1>
        <p class="mt-2 text-sm text-neon-yellow/80">Tape un mot pour marquer des points.</p>
      </header>

      <ResultScreen
        v-if="showResults"
        :winnerLabel="resultWinnerLabel"
        :winnerScore="resultWinnerScore"
        :playerScore="resultPlayerScore"
        :computerScore="resultComputerScore"
        @restart="resetMode"
      />

      <ModeSelector v-else-if="!selectedMode" @select="selectMode" />

      <TimeSelector v-else-if="!selectedDuration" @select="selectDuration" />

      <template v-else>
        <section
          v-if="!isStarted"
          class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm md:max-w-[33vw]"
        >
          <h2 class="text-center font-display text-2xl tracking-wide text-neon-yellow">Prêt ?</h2>
          <div class="mt-3 text-center font-numbers text-4xl text-neon-yellow">{{ formattedTime }}</div>
          <button
            type="button"
            class="mt-4 w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-5 text-center transition hover:border-neon-purple/80 hover:bg-black/40"
            @click="startTimer"
          >
            <span class="font-display text-2xl text-neon-yellow">Start</span>
          </button>
        </section>

        <template v-else>
          <MainBoard :state="mainBoardState" @toggle="toggleWordVisibility" />

          <ScoreBoard
            ref="scoreBoardRef"
            v-model:wordInput="wordInput"
            :playerPoints="playerPoints"
            :comPoints="comPoints"
            :wrongWord="wrongWord"
            :formattedTime="formattedTime"
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
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import MainBoard from './components/modes/MainBoard.vue'
import ModeSelector from './components/modes/ModeSelector.vue'
import ResultScreen from './components/modes/ResultScreen.vue'
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
  resetGame,
  addWord,
  toggleWordVisibility,
} = useGameState()

const selectedMode = ref('')
const selectedDuration = ref(0)
const isStarted = ref(false)
const timeLeft = ref(0)
const showResults = ref(false)
const resultPlayerScore = ref(0)
const resultComputerScore = ref(0)
const resultWinnerLabel = ref('')
const resultWinnerScore = ref(0)
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
const scoreBoardRef = ref(null)

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
  showResults.value = false
  resultPlayerScore.value = 0
  resultComputerScore.value = 0
  resultWinnerLabel.value = ''
  resultWinnerScore.value = 0
  stopTimer()
}

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  stopGame()
}

const finishGame = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
  resultPlayerScore.value = playerPoints.value
  resultComputerScore.value = comPoints.value
  if (playerPoints.value > comPoints.value) {
    resultWinnerLabel.value = 'Player'
    resultWinnerScore.value = playerPoints.value
  } else if (comPoints.value > playerPoints.value) {
    resultWinnerLabel.value = 'Computer'
    resultWinnerScore.value = comPoints.value
  } else {
    resultWinnerLabel.value = 'Égalité'
    resultWinnerScore.value = playerPoints.value
  }
  isStarted.value = false
  timeLeft.value = 0
  showResults.value = true
  resetGame()
}

const startTimer = () => {
  if (!selectedDuration.value) {
    return
  }
  stopTimer()
  timeLeft.value = selectedDuration.value * 60
  isStarted.value = true
  showResults.value = false
  startGame()
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
      return
    }
    finishGame()
  }, 1000)
}

const onSubmit = () => {
  addWord(wordInput.value)
}

watch(
  () => [computerTurn.value, isTyping.value, isStarted.value],
  async ([isComputer, typing, started]) => {
    if (!started || isComputer || typing) {
      return
    }
    await nextTick()
    scoreBoardRef.value?.focusInput?.()
  }
)

onBeforeUnmount(() => {
  stopTimer()
})
</script>
