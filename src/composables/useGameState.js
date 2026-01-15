import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import scrabble from '../assets/words/scrabble.json'
import wooshUrl from '../assets/audio/woosh.mp3'
import failUrl from '../assets/audio/fail.mp3'
import minusUrl from '../assets/audio/minus.mp3'
import { formatFrequency, normalizeWord, pickWeightedWord, resolveEntry } from './useDictionary'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const objectLetters = scrabble.letters

export const useGameState = ({
  modeRef = ref('pvc'),
  gameTypeRef = ref('word-fight'),
  grammarTagRef = ref(''),
  turnActiveRef = ref(true),
  onFailPenalty = () => {},
} = {}) => {
  const wordInput = ref('')
  const wordList = ref([])
  const wordListDisp = ref([])
  const refWord = ref('')
  const isTyping = ref(false)
  const wordPlayed = ref('')
  const computerTurn = ref(true)
  const index = ref(0)
  const wrongWord = ref(false)
  const gameActive = ref(false)
  const speedElapsed = ref(0)
  const speedBonusAwarded = ref(0)
  const prefixRepeatLength = ref(0)
  const frequencyBonus = ref(0)
  const ignoreNextPrefix = ref(false)
  let speedTimerId = null

  const playerPoints = ref(0)
  const comPoints = ref(0)
  const calcPoints = ref(0)
  const superSuiteBonus = ref(0)
  const superShrinkBonus = ref(0)
  const pointsAdded = ref([])

  const wordChars = computed(() => wordPlayed.value.split(''))

  const dynamicFontSize = computed(() => {
    if (wordPlayed.value.length > 12) {
      const multiplier = (wordPlayed.value.length - 12) * 0.2
      const defaultSize = 3
      const finalSize = defaultSize - multiplier
      return `${finalSize}em`
    }
    return '3em'
  })

  const isSoloMode = computed(() => modeRef.value === 'solo')
  const isVsComputer = computed(() => modeRef.value === 'pvc')
  const isOnlineMode = computed(() => modeRef.value === 'online')
  const isGrammarWar = computed(() => gameTypeRef.value === 'grammar-war')
  const isKamoulox = computed(() => gameTypeRef.value === 'kamoulox')

  const wordFail = () => {
    playAtDuring(failUrl)
    onFailPenalty()
    const owner = isOnlineMode.value
      ? 'player'
      : isSoloMode.value
        ? 'player'
        : isVsComputer.value
          ? computerTurn.value
            ? 'computer'
            : 'player'
          : computerTurn.value
            ? 'player2'
            : 'player1'
    wordListDisp.value.push({
      index: wordListDisp.value.length,
      text: 'FAIL',
      normalized: '',
      description: 'Mot invalide',
      visible: false,
      owner,
      tags: [],
    })
    wrongWord.value = true
    if (speedTimerId) {
      clearInterval(speedTimerId)
      speedTimerId = null
    }
    speedElapsed.value = 0
    speedBonusAwarded.value = 0
    prefixRepeatLength.value = 0
    frequencyBonus.value = 0
    ignoreNextPrefix.value = true
    setTimeout(() => {
      wrongWord.value = false
      wordPlayed.value = ''
      calcPoints.value = 0
      superSuiteBonus.value = 0
      superShrinkBonus.value = 0
      wordInput.value = ''
      pointsAdded.value = []
      isTyping.value = false
      if (gameActive.value) {
        if (isOnlineMode.value) {
          computerTurn.value = false
        } else if (isSoloMode.value) {
          computerTurn.value = false
        } else if (computerTurn.value) {
          computerTurn.value = false
        } else {
          computerTurn.value = true
          if (isVsComputer.value) {
            comPlay()
          }
        }
      }
    }, 500)
  }

  const playAtDuring = (audio, at, during) => {
    const audioPlay = new Audio(audio)

    if (at !== undefined) {
      audioPlay.currentTime = at
    }
    audioPlay.play()

    if (during !== undefined) {
      setTimeout(() => {
        audioPlay.pause()
      }, during)
    }
  }

  const isGreaterOrTinierWord = (firstWord, secondWord) => {
    if (wordList.value.length > 1) {
      if (firstWord.length + 1 === secondWord.length || firstWord.length - 1 === secondWord.length) {
        if (superShrinkBonus.value === 0) {
          superShrinkBonus.value = 5
        } else {
          superShrinkBonus.value *= 2
          calcPoints.value += superShrinkBonus.value
        }
      } else {
        superShrinkBonus.value = 0
      }
    }
  }

  const addPoint = (currentLetter, forcedPoints = null) => {
    const letter = objectLetters[currentLetter]
    if (!letter) {
      return
    }

    const points = forcedPoints === null ? letter.points : forcedPoints
    pointsAdded.value.push(points)
    calcPoints.value += points
    setTimeout(() => {
      pointsAdded.value.shift()
    }, 3000)
  }

  const addBonusPoints = (points) => {
    if (!points) {
      return
    }
    pointsAdded.value.push(points)
    setTimeout(() => {
      pointsAdded.value.shift()
    }, 3000)
  }

  const isAdjacentLetter = (firstWord, secondWord) => {
    if (wordList.value.length > 1) {
      const firstIndex = letters.indexOf(firstWord[0])
      const secondIndex = letters.indexOf(secondWord[0])

      if (firstIndex === -1 || secondIndex === -1) {
        superSuiteBonus.value = 0
        return false
      }

      if (firstIndex + 1 === secondIndex || firstIndex - 1 === secondIndex) {
        if (superSuiteBonus.value === 0) {
          superSuiteBonus.value = 5
        } else {
          superSuiteBonus.value *= 2
          calcPoints.value += superSuiteBonus.value
        }
        return true
      }

      superSuiteBonus.value = 0
    }
    return false
  }

  const isPalindrome = (word) => {
    const normalized = normalizeWord(word)
    if (normalized.split('').reverse().join('') === normalized) {
      return 10
    }
    return 0
  }

  const totalLetters = (word) => {
    let totalPoints = 0
    for (let i = 0; i < word.length; i += 1) {
      const normalizedLetter = normalizeWord(word[i])
      const letter = objectLetters[normalizedLetter]
      if (letter) {
        totalPoints += letter.points
      }
    }
    return totalPoints
  }

  const scoreValue = computed(() => totalLetters(wordPlayed.value))
  const computeFrequencyBonus = (freqForm, freqLemma) => {
    const form = Number(freqForm) || 0
    const lemma = Number(freqLemma) || 0
    const value = form > 0 ? form : lemma
    if (value <= 0) {
      return 0
    }
    const bonus = Math.round(Math.log10(value + 1) * 4)
    return Math.min(10, bonus)
  }
  const speedBonus = computed(() => {
    const maxTime = 5
    const maxBonus = 10
    const capped = Math.min(speedElapsed.value, maxTime)
    const ratio = 1 - capped / maxTime
    return Math.max(0, Math.round(maxBonus * ratio))
  })
  const scoreFontSize = computed(() => {
    const baseSize = 1.25
    const maxSize = 2.4
    const capped = Math.min(scoreValue.value, 30)
    const ratio = capped / 30
    const size = baseSize + ratio * (maxSize - baseSize)
    return `${size}rem`
  })
  const palindromeActive = computed(
    () => isPalindrome(wordPlayed.value) > 5 && wordPlayed.value !== '' && !isTyping.value
  )

  const howManyLettersBetween = (firstWord, secondWord) => {
    const firstIndex = letters.indexOf(firstWord[0])
    const secondIndex = letters.indexOf(secondWord[0])
    if (firstIndex === -1 || secondIndex === -1) {
      return 0
    }
    return Math.abs(firstIndex - secondIndex)
  }

  const pointsCount = () => {
    if (wordList.value.length > 1) {
      const lastIndex = wordList.value.length - 1
      const prevIndex = lastIndex - 1
      calcPoints.value += howManyLettersBetween(wordList.value[lastIndex], wordList.value[prevIndex])
      isAdjacentLetter(wordList.value[lastIndex], wordList.value[prevIndex])
      isGreaterOrTinierWord(wordList.value[lastIndex], wordList.value[prevIndex])
    }

    calcPoints.value += isPalindrome(wordPlayed.value)
    if (speedBonusAwarded.value > 0) {
      calcPoints.value += speedBonusAwarded.value
      speedBonusAwarded.value = 0
    }
    if (frequencyBonus.value > 0) {
      calcPoints.value += frequencyBonus.value
      frequencyBonus.value = 0
    }
    if (isKamoulox.value) {
      const current = wordListDisp.value[wordListDisp.value.length - 1]
      const previous = wordListDisp.value[wordListDisp.value.length - 2]
      if (current && previous) {
        const currentTags = current.tags || []
        const previousTags = previous.tags || []
        const lengthDiff = Math.abs(current.text.length - previous.text.length)
        const hasTagOverlap = currentTags.some((tag) => previousTags.includes(tag))
        const lemmaDiff =
          (current.normalized || normalizeWord(current.text)) !==
          (previous.normalized || normalizeWord(previous.text))
        let bonus = 0
        if (currentTags.length && previousTags.length && !hasTagOverlap) {
          bonus += 1
        }
        if (lengthDiff >= 2) {
          bonus += 1
        }
        if (lemmaDiff) {
          bonus += 1
        }
        if (lengthDiff >= 4 && bonus > 0) {
          bonus *= 2
        }
        if (bonus > 0) {
          calcPoints.value += bonus
          addBonusPoints(bonus)
        }
      }
    }
  }

  const randomDelay = (max) => Math.floor(max * Math.random())
  const getCommonPrefixLength = (first, second) => {
    const limit = Math.min(first.length, second.length)
    let length = 0
    while (length < limit && first[length] === second[length]) {
      length += 1
    }
    return length
  }

  const typeWriter = (word) => {
    if (!gameActive.value) {
      isTyping.value = false
      refWord.value = ''
      index.value = 0
      return
    }
    if (index.value === 0) {
      refWord.value = word || wordInput.value
      const prevWord = wordList.value.length ? wordList.value[wordList.value.length - 1] : ''
      const normalizedCurrent = normalizeWord(refWord.value)
      prefixRepeatLength.value = ignoreNextPrefix.value ? 0 : prevWord ? getCommonPrefixLength(prevWord, normalizedCurrent) : 0
      ignoreNextPrefix.value = false
    }
    wordInput.value = ''

    if (index.value < refWord.value.length) {
      isTyping.value = true
      const nextLetterRaw = refWord.value.charAt(index.value)
      const nextLetterNormalized = normalizeWord(nextLetterRaw)
      const isPrefixRepeat = prefixRepeatLength.value > 0 && index.value < prefixRepeatLength.value

      wordPlayed.value += nextLetterRaw
      if (isPrefixRepeat) {
        addPoint(nextLetterNormalized, 0)
        playAtDuring(minusUrl)
      } else {
        addPoint(nextLetterNormalized)
      }
      index.value += 1
      playAtDuring(wooshUrl)
      setTimeout(() => typeWriter(), randomDelay(300))
    } else if (index.value === refWord.value.length && refWord.value !== '') {
      pointsCount()
      refWord.value = ''
      isTyping.value = false
      index.value = 0

      if (isOnlineMode.value) {
        playerPoints.value += calcPoints.value
        computerTurn.value = false
      } else if (computerTurn.value === true) {
        computerTurn.value = false
        comPoints.value += calcPoints.value
      } else {
        playerPoints.value += calcPoints.value
        computerTurn.value = true
        if (isVsComputer.value) {
          comPlay()
        }
        if (isSoloMode.value) {
          computerTurn.value = false
        }
      }
      prefixRepeatLength.value = 0
      calcPoints.value = 0
    }
  }

  const textType = (word) => {
    wordPlayed.value = ''
    typeWriter(word)
  }

  const isValidWord = (word) => {
    if (!gameActive.value) {
      return
    }
    const entry = resolveEntry(word)
    if (!entry) {
      wordFail()
      return
    }
    if (isGrammarWar.value) {
      if (!grammarTagRef.value) {
        wordFail()
        return
      }
      if (!entry.tags || !entry.tags.includes(grammarTagRef.value)) {
        wordFail()
        return
      }
    }

    const owner = isOnlineMode.value
      ? 'player'
      : isSoloMode.value
        ? 'player'
        : isVsComputer.value
          ? computerTurn.value
            ? 'computer'
            : 'player'
          : computerTurn.value
            ? 'player2'
            : 'player1'
    if (isVsComputer.value && owner === 'computer') {
      speedBonusAwarded.value = 0
    }
    frequencyBonus.value = computeFrequencyBonus(entry.freqForm, entry.freqLemma)
    const wordObj = {
      index: wordList.value.length,
      text: entry.raw,
      normalized: entry.normalized,
      description: formatFrequency(entry.freqLemma, entry.freqForm),
      visible: false,
      owner,
      tags: entry.tags || [],
    }

    textType(entry.raw)
    wordList.value.push(entry.normalized)
    wordListDisp.value.push(wordObj)
  }

  const getWord = () => {
    if (!gameActive.value) {
      return
    }
    const tag = isGrammarWar.value ? grammarTagRef.value : ''
    if (isGrammarWar.value && !tag) {
      return
    }
    const randomWord = pickWeightedWord(tag)
    if (!randomWord) {
      return
    }
    isValidWord(randomWord)
  }

  const comPlay = () => {
    if (!gameActive.value) {
      return
    }
    if (!isVsComputer.value) {
      return
    }
    if (isTyping.value === false) {
      const delay = 1000 + Math.floor(Math.random() * 2000)
      setTimeout(() => getWord(), delay)
    }
  }

  const addWord = (word) => {
    if (!gameActive.value || isTyping.value || ((isVsComputer.value || isSoloMode.value) && computerTurn.value)) {
      return
    }
    if (isOnlineMode.value && !turnActiveRef.value) {
      return
    }
    if (!word || word.trim().length === 0) {
      return
    }
    speedBonusAwarded.value = speedBonus.value
    stopSpeedTimer()
    isValidWord(word)
  }

  const toggleWordVisibility = (wordIndex) => {
    const word = wordListDisp.value[wordIndex]
    if (word) {
      word.visible = !word.visible
    }
  }

  const setOnlineSnapshot = ({ words = [], normalized = [], playerScore = 0, opponentScore = 0 }) => {
    wordList.value = normalized
    wordListDisp.value = words
    playerPoints.value = playerScore
    comPoints.value = opponentScore
    wordPlayed.value = ''
    calcPoints.value = 0
    pointsAdded.value = []
    wrongWord.value = false
    isTyping.value = false
  }

  onMounted(() => {
    comPlay()
  })

  const startSpeedTimer = () => {
    if (speedTimerId) {
      clearInterval(speedTimerId)
    }
    const startAt = Date.now()
    speedElapsed.value = 0
    speedTimerId = setInterval(() => {
      speedElapsed.value = (Date.now() - startAt) / 1000
    }, 100)
  }

  const stopSpeedTimer = () => {
    if (speedTimerId) {
      clearInterval(speedTimerId)
      speedTimerId = null
    }
  }

  watch(
    () => [
      computerTurn.value,
      gameActive.value,
      isTyping.value,
      isVsComputer.value,
      isSoloMode.value,
      isOnlineMode.value,
      turnActiveRef.value,
    ],
    ([isComputerTurn, isActive, typing, vsComputer, soloMode, onlineMode, turnActive]) => {
      if (!isActive || typing) {
        stopSpeedTimer()
        return
      }
      if (onlineMode) {
        if (turnActive) {
          if (!speedTimerId) {
            startSpeedTimer()
          }
          return
        }
        stopSpeedTimer()
        return
      }
      if ((!vsComputer && !soloMode) || !isComputerTurn) {
        if (!speedTimerId) {
          startSpeedTimer()
        }
        return
      }
      stopSpeedTimer()
    }
  )

  const startGame = () => {
    gameActive.value = true
    if (!isVsComputer.value) {
      computerTurn.value = false
      return
    }
    if (computerTurn.value && !isTyping.value) {
      comPlay()
    }
  }

  const startSoloSeed = () => {
    if (!gameActive.value || !isSoloMode.value) {
      return
    }
    const tag = isGrammarWar.value ? grammarTagRef.value : ''
    if (isGrammarWar.value && !tag) {
      return
    }
    const randomWord = pickWeightedWord(tag)
    if (randomWord) {
      computerTurn.value = true
      isValidWord(randomWord)
      computerTurn.value = false
    }
  }

  const stopGame = () => {
    gameActive.value = false
    isTyping.value = false
    refWord.value = ''
    index.value = 0
    stopSpeedTimer()
    speedElapsed.value = 0
    speedBonusAwarded.value = 0
    frequencyBonus.value = 0
  }

  const resetGame = () => {
    stopGame()
    wordInput.value = ''
    wordList.value = []
    wordListDisp.value = []
    wordPlayed.value = ''
    wrongWord.value = false
    playerPoints.value = 0
    comPoints.value = 0
    calcPoints.value = 0
    superSuiteBonus.value = 0
    superShrinkBonus.value = 0
    pointsAdded.value = []
    computerTurn.value = true
  }

  onBeforeUnmount(() => {
    stopSpeedTimer()
  })

  return {
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
  }
}
