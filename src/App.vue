<template>
  <div class="min-h-screen text-neon-yellow">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-3 py-4 text-glow fade-in sm:gap-6 sm:px-4 sm:py-6">
      <header class="text-center">
        <h1 class="font-display text-3xl tracking-wide text-neon-purple sm:text-4xl md:text-5xl">
          Word Fighter
        </h1>
        <p class="mt-2 text-xs text-neon-yellow/80 sm:text-sm">Tape un mot pour marquer des points.</p>
      </header>

      <ResultScreen
        v-if="showResults"
        :winnerLabel="resultWinnerLabel"
        :winnerScore="resultWinnerScore"
        :playerScore="resultPlayerScore"
        :computerScore="resultComputerScore"
        :playerLabel="playerOneLabel"
        :opponentLabel="playerTwoLabel"
        @restart="resetMode"
        @back="goBack"
      />

      <OnlineRoomScreen
        v-else-if="(selectedMode === 'online' || hasRoomParam) && !isStarted"
        :gameType="gameType"
        :grammarTag="grammarTag"
        @start="startOnlineSession"
        @syncSettings="syncOnlineSettings"
        @syncPlayers="syncOnlinePlayers"
        @syncRoom="syncOnlineRoom"
        @back="goBack"
      />

      <EntryScreen v-else-if="!entryChoice" @select="selectEntry" />

      <GameTypeSelectScreen v-else-if="entryChoice === 'local' && !gameType" @select="selectGameType" />

      <GrammarTagSelectScreen
        v-else-if="gameType === 'grammar-war' && !grammarTag"
        @select="selectGrammarTag"
        @back="goBack"
      />

      <ModeSelectScreen v-else-if="!selectedMode" @select="selectMode" @back="goBack" />

      <PlayerNamesScreen
        v-else-if="selectedMode === 'pvp' && !namesConfirmed"
        :playerOneName="playerOneName"
        :playerTwoName="playerTwoName"
        @confirm="confirmNames"
        @back="goBack"
      />

      <TimeSelectScreen
        v-else-if="!selectedDuration && selectedMode !== 'online'"
        @select="selectDuration"
        @back="goBack"
      />

      <template v-else>
        <section
          v-if="!isStarted"
          class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[33vw]"
        >
          <button
            type="button"
            class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
            @click="goBack"
          >
            ← Back
          </button>
          <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">Prêt ?</h2>
          <div class="mt-3 text-center font-numbers text-3xl text-neon-yellow sm:text-4xl">
            {{ formattedTime }}
          </div>
          <button
            type="button"
            class="mt-4 w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-4 text-center transition hover:border-neon-purple/80 hover:bg-black/40 sm:py-5"
            @click="startTimer"
          >
            <span class="font-display text-xl text-neon-yellow sm:text-2xl">Start</span>
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
            :playerLabel="playerOneLabel"
            :opponentLabel="playerTwoLabel"
            :isOnline="selectedMode === 'online'"
            :onlinePlayers="onlinePlayers"
            :activePlayerId="activeOnlinePlayerId"
            :onlineScores="onlineScores"
            :disabled="
              isTyping ||
              !isStarted ||
              (selectedMode === 'online'
                ? !isLocalOnlineTurn
                : (selectedMode !== 'pvp' && selectedMode !== 'solo') && computerTurn)
            "
            @submit="onSubmit"
          />
          <div class="text-center text-xs text-neon-yellow/60">
            Mode: {{ modeLabel }} · Temps: {{ durationLabel
            }}<template v-if="grammarTagLabel"> · Tag: {{ grammarTagLabel }}</template>
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
import MainBoard from './components/game/MainBoard.vue'
import ScoreBoard from './components/game/ScoreBoard.vue'
import EntryScreen from './screens/EntryScreen.vue'
import GameTypeSelectScreen from './screens/GameTypeSelectScreen.vue'
import GrammarTagSelectScreen from './screens/GrammarTagSelectScreen.vue'
import ModeSelectScreen from './screens/ModeSelectScreen.vue'
import OnlineRoomScreen from './screens/OnlineRoomScreen.vue'
import PlayerNamesScreen from './screens/PlayerNamesScreen.vue'
import ResultScreen from './screens/ResultScreen.vue'
import TimeSelectScreen from './screens/TimeSelectScreen.vue'
import { useGameState } from './composables/useGameState'
import { supabase } from './lib/supabaseClient'

const gameType = ref('')
const grammarTag = ref('')
const selectedMode = ref('')
const entryChoice = ref('')
const hasRoomParam = ref(false)
const onlinePlayers = ref([])
const onlineRoomId = ref('')
const onlinePlayerId = ref('')
const onlineTurnIndex = ref(0)
const onlineRoomSettings = ref({ gameType: '', tag: '', duration: 1, turnIndex: 0, state: null })
const onlineRoomState = ref({ words: [], normalized: [], scores: {} })
const isApplyingRemote = ref(false)
const lastSyncedWordIndex = ref(0)
const playerOneName = ref('Player 1')
const playerTwoName = ref('Player 2')
const namesConfirmed = ref(false)
const activeOnlinePlayerId = computed(() => onlinePlayers.value[onlineTurnIndex.value]?.player_id || '')
const isLocalOnlineTurn = computed(() => {
  if (selectedMode.value !== 'online') return true
  if (!onlinePlayers.value.length) return true
  if (!onlinePlayerId.value) return true
  return activeOnlinePlayerId.value === onlinePlayerId.value
})

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
  startSoloSeed,
  addWord,
  toggleWordVisibility,
  setOnlineSnapshot,
} = useGameState({
  modeRef: selectedMode,
  gameTypeRef: gameType,
  grammarTagRef: grammarTag,
  turnActiveRef: isLocalOnlineTurn,
  onFailPenalty: () => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    }
  },
})
const selectedDuration = ref(0)
const isStarted = ref(false)
const timeLeft = ref(0)
const showResults = ref(false)
const resultPlayerScore = ref(0)
const resultComputerScore = ref(0)
const resultWinnerLabel = ref('')
const resultWinnerScore = ref(0)
let timerId = null
let onlineRoomChannel = null
let onlinePlayersChannel = null
const modeLabel = computed(() => {
  if (selectedMode.value === 'solo') return 'Solo'
  if (selectedMode.value === 'pvc') return 'Player VS Computer'
  if (selectedMode.value === 'pvp') return 'Player VS Player'
  if (selectedMode.value === 'online') return 'Online Battle'
  return ''
})
const playerOneLabel = computed(() => (selectedMode.value === 'pvp' ? playerOneName.value : 'Player'))
const playerTwoLabel = computed(() => (selectedMode.value === 'pvp' ? playerTwoName.value : 'Computer'))
const durationLabel = computed(() => (selectedDuration.value ? `${selectedDuration.value} min` : ''))
const onlineScores = computed(() => onlineRoomState.value.scores || {})
const grammarTagLabel = computed(() => {
  if (grammarTag.value === 'VER') return 'Verbes'
  if (grammarTag.value === 'ADJ') return 'Adjectifs'
  if (grammarTag.value === 'NOM') return 'Noms'
  return ''
})
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

const selectGameType = (type) => {
  gameType.value = type
  grammarTag.value = ''
}

const applyOnlineSettings = ({ gameType: type, tag, duration, turnIndex, state }) => {
  if (type) {
    gameType.value = type
    onlineRoomSettings.value.gameType = type
  }
  if (tag !== undefined) {
    grammarTag.value = tag
    onlineRoomSettings.value.tag = tag
  }
  if (duration) {
    selectedDuration.value = duration
    onlineRoomSettings.value.duration = duration
  }
  if (typeof turnIndex === 'number') {
    onlineTurnIndex.value = turnIndex
    onlineRoomSettings.value.turnIndex = turnIndex
  }
  if (state) {
    onlineRoomSettings.value.state = state
    onlineRoomState.value = {
      words: state.words || [],
      normalized: state.normalized || [],
      scores: state.scores || {},
    }
    applyOnlineSnapshot()
  }
}

const selectEntry = (choice) => {
  if (choice === 'online') {
    selectedMode.value = 'online'
    return
  }
  entryChoice.value = 'local'
}

const selectGrammarTag = (tag) => {
  grammarTag.value = tag
}

const selectMode = (mode) => {
  selectedMode.value = mode
  if (mode !== 'pvp') {
    namesConfirmed.value = false
    playerOneName.value = 'Player 1'
    playerTwoName.value = 'Player 2'
  }
}

const syncOnlineSettings = ({ gameType: type, tag, duration, turnIndex, state }) => {
  applyOnlineSettings({ gameType: type, tag, duration, turnIndex, state })
}

const syncOnlinePlayers = (players) => {
  onlinePlayers.value = players || []
}

const syncOnlineRoom = ({ roomId, playerId }) => {
  onlineRoomId.value = roomId || ''
  onlinePlayerId.value = playerId || ''
}

const selectDuration = (minutes) => {
  selectedDuration.value = minutes
  timeLeft.value = minutes * 60
}

const resetMode = () => {
  gameType.value = ''
  grammarTag.value = ''
  selectedMode.value = ''
  entryChoice.value = ''
  onlinePlayers.value = []
  onlineRoomId.value = ''
  onlinePlayerId.value = ''
  onlineTurnIndex.value = 0
  onlineRoomSettings.value = { gameType: '', tag: '', duration: 1, turnIndex: 0, state: null }
  onlineRoomState.value = { words: [], normalized: [], scores: {} }
  lastSyncedWordIndex.value = 0
  clearRoomParam()
  selectedDuration.value = 0
  timeLeft.value = 0
  isStarted.value = false
  playerOneName.value = 'Player 1'
  playerTwoName.value = 'Player 2'
  namesConfirmed.value = false
  showResults.value = false
  resultPlayerScore.value = 0
  resultComputerScore.value = 0
  resultWinnerLabel.value = ''
  resultWinnerScore.value = 0
  stopTimer()
  cleanupOnlineChannels()
}

const confirmNames = ({ playerOne, playerTwo }) => {
  playerOneName.value = playerOne
  playerTwoName.value = playerTwo
  namesConfirmed.value = true
}

const goBack = () => {
  if (showResults.value) {
    resetMode()
    return
  }
  if (isStarted.value) {
    return
  }
  if (selectedMode.value === 'online') {
    selectedMode.value = ''
    entryChoice.value = ''
    gameType.value = ''
    grammarTag.value = ''
    onlinePlayers.value = []
    onlineRoomId.value = ''
    onlinePlayerId.value = ''
    onlineTurnIndex.value = 0
    onlineRoomSettings.value = { gameType: '', tag: '', duration: 1, turnIndex: 0, state: null }
    onlineRoomState.value = { words: [], normalized: [], scores: {} }
    lastSyncedWordIndex.value = 0
    clearRoomParam()
    selectedDuration.value = 0
    timeLeft.value = 0
    stopTimer()
    cleanupOnlineChannels()
    return
  }
  if (selectedDuration.value) {
    selectedDuration.value = 0
    timeLeft.value = 0
    stopTimer()
    return
  }
  if (selectedMode.value) {
    selectedMode.value = ''
    clearRoomParam()
    namesConfirmed.value = false
    playerOneName.value = 'Player 1'
    playerTwoName.value = 'Player 2'
    return
  }
  if (gameType.value === 'grammar-war' && grammarTag.value) {
    grammarTag.value = ''
    return
  }
  if (gameType.value) {
    gameType.value = ''
    return
  }
  if (entryChoice.value) {
    entryChoice.value = ''
    return
  }
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
    resultWinnerLabel.value = playerOneLabel.value
    resultWinnerScore.value = playerPoints.value
  } else if (comPoints.value > playerPoints.value) {
    resultWinnerLabel.value = playerTwoLabel.value
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
  if (selectedMode.value === 'solo') {
    startSoloSeed()
  }
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
      return
    }
    finishGame()
  }, 1000)
}

const startOnlineSession = ({ duration }) => {
  if (isStarted.value) {
    return
  }
  if (!duration) {
    return
  }
  selectedDuration.value = duration
  onlineTurnIndex.value = onlineRoomSettings.value.turnIndex || 0
  applyOnlineSnapshot()
  startTimer()
}

const clearRoomParam = () => {
  const url = new URL(window.location.href)
  url.searchParams.delete('room')
  window.history.replaceState({}, '', url.toString())
  hasRoomParam.value = false
}

const onSubmit = () => {
  if (selectedMode.value === 'online' && !isLocalOnlineTurn.value) {
    return
  }
  addWord(wordInput.value)
}

watch(
  () => [computerTurn.value, isTyping.value, isStarted.value, selectedMode.value, isLocalOnlineTurn.value],
  async ([isComputer, typing, started, mode, localTurn]) => {
    if (!started || typing) {
      return
    }
    if (mode === 'online' && !localTurn) {
      return
    }
    if (mode !== 'pvp' && mode !== 'online' && isComputer) {
      return
    }
    await nextTick()
    scoreBoardRef.value?.focusInput?.()
  }
)

onBeforeUnmount(() => {
  stopTimer()
  cleanupOnlineChannels()
})

const initRoomParam = () => {
  const params = new URLSearchParams(window.location.search)
  const roomParam = params.get('room')
  if (roomParam) {
    hasRoomParam.value = true
    selectedMode.value = 'online'
  }
}

initRoomParam()

const cleanupOnlineChannels = () => {
  if (!supabase) return
  if (onlineRoomChannel) {
    supabase.removeChannel(onlineRoomChannel)
    onlineRoomChannel = null
  }
  if (onlinePlayersChannel) {
    supabase.removeChannel(onlinePlayersChannel)
    onlinePlayersChannel = null
  }
}

const fetchOnlinePlayers = async () => {
  if (!supabase || !onlineRoomId.value) return
  const { data } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', onlineRoomId.value)
    .order('joined_at', { ascending: true })
  onlinePlayers.value = data || []
}

const fetchOnlineRoom = async () => {
  if (!supabase || !onlineRoomId.value) return
  const { data } = await supabase.from('rooms').select('*').eq('id', onlineRoomId.value).single()
  if (!data) return
  applyOnlineSettings({
    gameType: data.settings?.gameType || 'word-fight',
    tag: data.settings?.tag || '',
    duration: data.settings?.duration || 1,
    turnIndex: data.settings?.turnIndex ?? 0,
    state: data.settings?.state || { words: [], normalized: [], scores: {} },
  })
}

watch(
  () => [onlineRoomId.value, selectedMode.value],
  ([roomId, mode]) => {
    cleanupOnlineChannels()
    if (!supabase || !roomId || mode !== 'online') return
    fetchOnlineRoom()
    fetchOnlinePlayers()
    onlineRoomChannel = supabase
      .channel(`room-game-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          const data = payload.new
          applyOnlineSettings({
            gameType: data.settings?.gameType || 'word-fight',
            tag: data.settings?.tag || '',
            duration: data.settings?.duration || 1,
            turnIndex: data.settings?.turnIndex ?? 0,
            state: data.settings?.state || { words: [], normalized: [], scores: {} },
          })
        }
      )
      .subscribe()
    onlinePlayersChannel = supabase
      .channel(`players-game-${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
        () => {
          fetchOnlinePlayers()
        }
      )
      .subscribe()
  }
)

const syncOnlineWordIfNeeded = async () => {
  if (selectedMode.value !== 'online' || !isStarted.value) return
  if (!supabase || !onlineRoomId.value) return
  if (isApplyingRemote.value) return
  if (!isLocalOnlineTurn.value) return
  if (!onlinePlayers.value.length) return
  if (isTyping.value) return
  const currentLength = wordListDisp.value.length
  if (currentLength <= lastSyncedWordIndex.value) return

  const latestWord = wordListDisp.value[wordListDisp.value.length - 1]
  const ownerId = onlinePlayerId.value
  const newWord = {
    text: latestWord.text,
    normalized: latestWord.normalized,
    description: latestWord.description,
    tags: latestWord.tags || [],
    ownerId,
    visible: false,
  }
  const nextIndex = (onlineTurnIndex.value + 1) % onlinePlayers.value.length
  const updatedScores = {
    ...onlineRoomState.value.scores,
    [ownerId]: playerPoints.value,
  }
  const updatedState = {
    words: [...onlineRoomState.value.words, newWord],
    normalized: [...onlineRoomState.value.normalized, latestWord.normalized],
    scores: updatedScores,
  }
  onlineTurnIndex.value = nextIndex
  onlineRoomState.value = updatedState
  onlineRoomSettings.value = { ...onlineRoomSettings.value, turnIndex: nextIndex, state: updatedState }
  lastSyncedWordIndex.value = currentLength
  await supabase.from('rooms').update({ settings: onlineRoomSettings.value }).eq('id', onlineRoomId.value)
}

watch(
  () => wordListDisp.value.length,
  async (next, prev) => {
    if (next <= prev) return
    await syncOnlineWordIfNeeded()
  }
)

watch(
  () => isTyping.value,
  async (typing) => {
    if (typing) return
    await syncOnlineWordIfNeeded()
  }
)

watch(
  () => onlinePlayers.value.length,
  (length) => {
    if (!length) return
    if (onlineTurnIndex.value >= length) {
      onlineTurnIndex.value = 0
    }
  }
)

const applyOnlineSnapshot = () => {
  isApplyingRemote.value = true
  const words = onlineRoomState.value.words.map((word) => ({
    ...word,
    owner: word.ownerId && word.ownerId === onlinePlayerId.value ? 'player' : 'computer',
  }))
  setOnlineSnapshot({
    words,
    normalized: onlineRoomState.value.normalized,
    playerScore: onlineRoomState.value.scores?.[onlinePlayerId.value] || 0,
    opponentScore: 0,
  })
  lastSyncedWordIndex.value = words.length
  isApplyingRemote.value = false
}
</script>
