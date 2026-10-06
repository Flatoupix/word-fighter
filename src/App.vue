<template>
  <div :class="['min-h-screen text-neon-yellow transition-transform duration-100', triggerShake ? 'arcade-shake' : '']">
    <div class="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-3 py-4 text-glow fade-in sm:gap-6 sm:px-4 sm:py-6">
      <!-- Universal Arcade Header -->
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-neon-pink/30 pb-3">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="text-left font-display text-2xl tracking-wide text-neon-yellow hover:text-white sm:text-3xl"
            @click="handleQuitGame"
          >
            WORD FIGHTER
          </button>
          <span class="rounded-full border border-neon-yellow/30 bg-black/40 px-2 py-0.5 text-[10px] font-ui text-neon-yellow/70">
            v{{ GAME_VERSION }}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs font-ui">
          <!-- Audio Toggle -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full border border-neon-yellow/40 bg-black/40 px-3 py-1 text-neon-yellow/80 transition hover:border-neon-yellow hover:text-neon-yellow"
            :title="isMuted ? 'Activer le son' : 'Couper le son'"
            @click="toggleSound"
          >
            <span>{{ isMuted ? '🔇' : '🔊' }}</span>
            <span class="hidden sm:inline">{{ isMuted ? 'Muet' : 'Son On' }}</span>
          </button>

          <!-- Rules -->
          <button
            type="button"
            class="rounded-full border border-neon-pink/60 bg-black/40 px-3 py-1 text-neon-yellow/80 transition hover:border-neon-purple hover:text-neon-yellow"
            @click="openOverlay('rules')"
          >
            {{ uiText.header.buttons.rules }}
          </button>

          <!-- Changelog -->
          <button
            type="button"
            class="rounded-full border border-neon-pink/60 bg-black/40 px-3 py-1 text-neon-yellow/80 transition hover:border-neon-purple hover:text-neon-yellow"
            @click="openOverlay('changelog')"
          >
            {{ uiText.header.buttons.changelog }}
          </button>
        </div>
      </header>

      <!-- SCREEN 1: RESULTS SCREEN -->
      <ResultScreen
        v-if="showResults"
        :playerScore="resultPlayerScore"
        :computerScore="resultComputerScore"
        :playerLabel="'Toi'"
        :opponentLabel="aiOpponent.name"
        :isSolo="selectedMode === 'solo'"
        :isNewRecord="isNewRecord"
        :wordsCount="resultWordsCount"
        :maxCombo="resultMaxCombo"
        :bestWord="resultBestWord"
        @restart="resetMode"
        @rematch="rematchGame"
      />

      <!-- SCREEN 2: BATTLE ARENA (IN-GAME) -->
      <main v-else-if="isStarted" class="flex flex-col gap-4">
        <!-- Main Board with Animated Typing, Floating Combat Popups and Bonus Panel -->
        <MainBoard :state="mainBoardState" @toggle="toggleWordVisibility" />

        <!-- Score Board with Duel Header and Live Word Input Preview -->
        <ScoreBoard
          ref="scoreBoardRef"
          v-model:wordInput="wordInput"
          :playerPoints="playerPoints"
          :comPoints="comPoints"
          :wrongWord="wrongWord"
          :formattedTime="formattedTime"
          :speedElapsed="speedElapsedDisplay"
          :speedBonus="speedBonus"
          :playerLabel="'Toi'"
          :opponentLabel="aiOpponent.name"
          :isSolo="selectedMode === 'solo'"
          :highScore="stats.soloHighScore"
          :aiAvatar="aiOpponent.avatar"
          :aiStatus="aiStatus"
          :comboStreak="comboStreak"
          :comboMultiplier="comboMultiplier"
          :analyzeInput="analyzeInput"
          :disabled="isTyping || (selectedMode === 'pvc' && computerTurn)"
          @submit="onSubmit"
        />

        <!-- Arena Footer Actions -->
        <div class="flex items-center justify-between text-xs font-ui text-neon-yellow/60">
          <div>
            Mode : <span class="text-neon-yellow">{{ selectedMode === 'solo' ? 'Solo Rush' : `Duel vs ${aiOpponent.name}` }}</span>
            · Round : <span class="text-neon-yellow">{{ selectedDuration }} min</span>
          </div>
          <button
            type="button"
            class="text-neon-pink/70 hover:text-neon-pink hover:underline"
            @click="handleQuitGame"
          >
            Abandonner le match ✕
          </button>
        </div>
      </main>

      <!-- SCREEN 3: ARCADE MENU (MAIN) -->
      <ArcadeMenuScreen v-else @start="startMatch" />
    </div>

    <!-- Info Overlay Dialog (Rules & Changelog) -->
    <div
      v-if="overlayVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="closeOverlay"
    >
      <div
        class="flex w-full max-w-xl flex-col rounded-lg border border-neon-pink/80 bg-black/80 p-5 text-left text-neon-yellow shadow-[0_0_30px_rgba(140,30,255,0.4)] max-h-[85vh]"
      >
        <div class="flex items-center justify-between gap-3 border-b border-neon-pink/30 pb-3">
          <h2 class="font-display text-2xl tracking-wide text-neon-purple sm:text-3xl">
            {{ overlayTitle }}
          </h2>
          <button
            type="button"
            class="rounded bg-black/40 px-2 py-1 text-xs font-ui uppercase tracking-wide text-neon-yellow/70 hover:text-neon-yellow"
            @click="closeOverlay"
          >
            {{ uiText.overlay.close }} ✕
          </button>
        </div>

        <div class="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2 font-ui text-sm text-neon-yellow/80">
          <template v-if="overlayType === 'changelog'">
            <div v-for="entry in changelogEntries" :key="entry.version" class="space-y-1.5 border-b border-white/5 pb-3">
              <div class="text-xs font-ui uppercase tracking-wide text-neon-yellow/60 font-bold">
                {{ uiText.overlay.versionLabel }} {{ entry.version }}
              </div>
              <ul class="space-y-1 text-xs text-neon-yellow/70 sm:text-sm">
                <li v-for="item in entry.items" :key="item">• {{ item }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <section class="space-y-2">
              <h3 class="text-xs font-ui uppercase tracking-wider text-neon-yellow font-bold">
                {{ uiText.overlay.sections.flow }}
              </h3>
              <ul class="space-y-1 text-xs text-neon-yellow/80 sm:text-sm">
                <li v-for="item in rulesFlow" :key="item">• {{ item }}</li>
              </ul>
            </section>
            <section class="mt-4 space-y-2">
              <h3 class="text-xs font-ui uppercase tracking-wider text-neon-yellow font-bold">
                {{ uiText.overlay.sections.bonus }}
              </h3>
              <ul class="space-y-1 text-xs text-neon-yellow/80 sm:text-sm">
                <li v-for="item in rulesScoring" :key="item">• {{ item }}</li>
              </ul>
            </section>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import ArcadeMenuScreen from './screens/ArcadeMenuScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import MainBoard from './components/game/MainBoard.vue'
import ScoreBoard from './components/game/ScoreBoard.vue'
import { useGameState } from './composables/useGameState'
import { GAME_VERSION } from './config/constants'
import { getStats, saveStats } from './lib/storage'
import { sounds } from './lib/soundFx'
import uiText from './content/uiText.json'

const selectedMode = ref('solo')
const selectedAi = ref('medium')
const selectedDuration = ref(1)
const isStarted = ref(false)
const showResults = ref(false)
const timeLeft = ref(60)
let timerId = null

const isMuted = ref(sounds.isMuted())
const stats = ref(getStats())

const toggleSound = () => {
  isMuted.value = sounds.toggleMute()
}

// Result metrics
const resultPlayerScore = ref(0)
const resultComputerScore = ref(0)
const resultWordsCount = ref(0)
const resultMaxCombo = ref(1)
const resultBestWord = ref('')
const isNewRecord = ref(false)

const opponents = uiText.aiOpponents
const aiOpponent = computed(() => opponents[selectedAi.value] || opponents.medium)

// Overlay
const overlayVisible = ref(false)
const overlayType = ref('rules')
const changelogEntries = uiText.changelog
const rulesFlow = uiText.rules.flow
const rulesScoring = uiText.rules.bonus
const overlayTitle = computed(() =>
  overlayType.value === 'changelog' ? uiText.overlay.changelogTitle : uiText.overlay.rulesTitle
)
const openOverlay = (type) => {
  overlayType.value = type
  overlayVisible.value = true
}
const closeOverlay = () => {
  overlayVisible.value = false
}

// Game State Composable
const {
  wordInput,
  wordListDisp,
  wordChars,
  dynamicFontSize,
  wrongWord,
  pointsAdded,
  superSuiteBonus,
  superShrinkBonus,
  anagramBonus,
  doubleLetterBonus,
  palindromeActive,
  scoreValue,
  speedElapsed,
  speedBonus,
  scoreFontSize,
  playerPoints,
  comPoints,
  computerTurn,
  isTyping,
  comboStreak,
  comboMultiplier,
  feverActive,
  combatPopups,
  triggerShake,
  aiStatus,
  analyzeInput,
  startGame,
  stopGame,
  resetGame,
  addWord,
  toggleWordVisibility,
} = useGameState({
  modeRef: selectedMode,
  aiDifficultyRef: selectedAi,
  onFailPenalty: () => {
    if (timeLeft.value > 0) timeLeft.value -= 1
  },
})

const scoreBoardRef = ref(null)

const speedElapsedDisplay = computed(() => speedElapsed.value.toFixed(1))

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const mainBoardState = computed(() => ({
  words: wordListDisp.value,
  wrongWord: wrongWord.value,
  pointsAdded: pointsAdded.value,
  wordChars: wordChars.value,
  dynamicFontSize: dynamicFontSize.value,
  superSuiteBonus: superSuiteBonus.value,
  superShrinkBonus: superShrinkBonus.value,
  anagramBonus: anagramBonus.value,
  doubleLetterBonus: doubleLetterBonus.value,
  palindromeActive: palindromeActive.value,
  scoreValue: scoreValue.value,
  scoreFontSize: scoreFontSize.value,
  combatPopups: combatPopups.value,
  feverActive: feverActive.value,
  playerColors: {},
}))

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

const startTimer = () => {
  stopTimer()
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
      if (timeLeft.value <= 5 && timeLeft.value > 0) {
        sounds.playTick()
      }
    } else {
      finishGame()
    }
  }, 1000)
}

const finishGame = () => {
  stopTimer()
  stopGame()

  resultPlayerScore.value = playerPoints.value
  resultComputerScore.value = comPoints.value
  resultWordsCount.value = wordListDisp.value.filter((w) => w.text !== 'FAIL').length
  resultMaxCombo.value = Math.max(comboStreak.value, 1)

  // Find longest/best word
  let best = ''
  wordListDisp.value.forEach((w) => {
    if (w.text && w.text !== 'FAIL' && w.text.length > best.length) {
      best = w.text
    }
  })
  resultBestWord.value = best

  // Check and save high score
  const prevStats = getStats()
  const prevRecord = selectedMode.value === 'solo' ? prevStats.soloHighScore : prevStats.aiHighScore
  isNewRecord.value = playerPoints.value > prevRecord && playerPoints.value > 0

  stats.value = saveStats(playerPoints.value, selectedMode.value, resultWordsCount.value, resultMaxCombo.value)
  showResults.value = true
}

const startMatch = ({ mode, aiDifficulty, duration }) => {
  selectedMode.value = mode
  selectedAi.value = aiDifficulty
  selectedDuration.value = duration
  timeLeft.value = duration * 60

  showResults.value = false
  resetGame()
  isStarted.value = true
  startGame()
  startTimer()

  nextTick(() => {
    if (scoreBoardRef.value) scoreBoardRef.value.focusInput()
  })
}

const rematchGame = () => {
  stopTimer()
  resetGame()
  showResults.value = false
  isStarted.value = true
  timeLeft.value = selectedDuration.value * 60
  startGame()
  startTimer()

  nextTick(() => {
    if (scoreBoardRef.value) scoreBoardRef.value.focusInput()
  })
}

const resetMode = () => {
  stopTimer()
  resetGame()
  isStarted.value = false
  showResults.value = false
  stats.value = getStats()
}

const handleQuitGame = () => {
  if (isStarted.value) {
    if (window.confirm('Voulez-vous abandonner la partie en cours et retourner au menu ?')) {
      resetMode()
    }
  } else {
    resetMode()
  }
}

const onSubmit = () => {
  if (!wordInput.value || isTyping.value) return
  addWord(wordInput.value)
}
</script>
