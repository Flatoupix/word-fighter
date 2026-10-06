import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import scrabble from '../assets/words/scrabble.json'
import { formatFrequency, normalizeWord, pickWeightedWord, resolveEntry } from './useDictionary'
import { sounds } from '../lib/soundFx'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const objectLetters = scrabble.letters

export const useGameState = ({
  modeRef = ref('pvc'),
  aiDifficultyRef = ref('medium'),
  onFailPenalty = () => {},
} = {}) => {
  const wordInput = ref('')
  const wordList = ref([])
  const wordListDisp = ref([])
  const refWord = ref('')
  const isTyping = ref(false)
  const wordPlayed = ref('')
  const computerTurn = ref(false)
  const index = ref(0)
  const wrongWord = ref(false)
  const gameActive = ref(false)
  const speedElapsed = ref(0)
  const speedBonusAwarded = ref(0)
  const prefixRepeatLength = ref(0)
  const frequencyBonus = ref(0)
  const ignoreNextPrefix = ref(false)
  let speedTimerId = null

  // Arcade Juice States
  const comboStreak = ref(0)
  const combatPopups = ref([])
  const triggerShake = ref(false)
  const aiThinking = ref(false)
  const aiStatus = ref('En veille')

  const playerPoints = ref(0)
  const comPoints = ref(0)
  const calcPoints = ref(0)
  const superSuiteBonus = ref(0)
  const superShrinkBonus = ref(0)
  const anagramBonus = ref(0)
  const doubleLetterBonus = ref(0)
  const pointsAdded = ref([])

  const comboMultiplier = computed(() => {
    if (comboStreak.value >= 5) return 2.0
    if (comboStreak.value >= 3) return 1.5
    return 1.0
  })

  const feverActive = computed(() => comboStreak.value >= 3)

  const wordChars = computed(() => wordPlayed.value.split(''))

  const dynamicFontSize = computed(() => {
    if (wordPlayed.value.length > 12) {
      const multiplier = (wordPlayed.value.length - 12) * 0.2
      const defaultSize = 3
      const finalSize = defaultSize - multiplier
      return `${Math.max(1.8, finalSize)}em`
    }
    return '3em'
  })

  const isSoloMode = computed(() => modeRef.value === 'solo')
  const isVsComputer = computed(() => modeRef.value === 'pvc')

  const fireShake = () => {
    triggerShake.value = true
    setTimeout(() => {
      triggerShake.value = false
    }, 360)
  }

  const addCombatPopup = (text, tag = '', color = 'text-neon-yellow') => {
    const id = Date.now() + Math.random()
    combatPopups.value.push({ id, text, tag, color })
    setTimeout(() => {
      combatPopups.value = combatPopups.value.filter((p) => p.id !== id)
    }, 1200)
  }

  const wordFail = () => {
    sounds.playFail()
    fireShake()
    onFailPenalty()
    comboStreak.value = 0 // Break combo streak

    const owner = isSoloMode.value ? 'player' : computerTurn.value ? 'computer' : 'player'
    wordListDisp.value.push({
      index: wordListDisp.value.length,
      text: 'FAIL',
      normalized: '',
      description: 'Mot invalide / Pénalité -1s',
      visible: false,
      owner,
      tags: [],
    })
    wrongWord.value = true
    addCombatPopup('FAIL ! -1s', 'ERREUR', 'text-neon-pink')

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
      anagramBonus.value = 0
      doubleLetterBonus.value = 0
      wordInput.value = ''
      pointsAdded.value = []
      isTyping.value = false

      if (gameActive.value) {
        if (isSoloMode.value) {
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
    }, 450)
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
        return true
      }
      superShrinkBonus.value = 0
    }
    return false
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
    }, 2000)
  }

  const addBonusPoints = (points) => {
    if (!points) return
    pointsAdded.value.push(points)
    setTimeout(() => {
      pointsAdded.value.shift()
    }, 2000)
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
    if (normalized.length >= 2 && normalized.split('').reverse().join('') === normalized) {
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
    if (value <= 0) return 0
    const bonus = Math.round(Math.log10(value + 1) * 4)
    return Math.min(10, bonus)
  }

  const speedBonus = computed(() => {
    const maxTime = 4
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
    if (firstIndex === -1 || secondIndex === -1) return 0
    return Math.abs(firstIndex - secondIndex)
  }

  const isAnagram = (firstWord, secondWord) => {
    const normalizedFirst = normalizeWord(firstWord || '')
    const normalizedSecond = normalizeWord(secondWord || '')
    if (!normalizedFirst || !normalizedSecond || normalizedFirst === normalizedSecond) return false
    if (normalizedFirst.length !== normalizedSecond.length) return false
    return normalizedFirst.split('').sort().join('') === normalizedSecond.split('').sort().join('')
  }

  const countDoubleLetters = (word) => {
    const normalized = normalizeWord(word || '')
    if (!normalized) return 0
    let count = 0
    for (let i = 1; i < normalized.length; i += 1) {
      if (normalized[i] === normalized[i - 1]) count += 1
    }
    return count
  }

  const pointsCount = (isPlayerWord = true) => {
    const currentWord = wordList.value[wordList.value.length - 1] || ''
    const detectedTags = []

    if (wordList.value.length > 1) {
      const lastIndex = wordList.value.length - 1
      const prevIndex = lastIndex - 1
      const lastWord = wordList.value[lastIndex]
      const prevWord = wordList.value[prevIndex]

      const gap = howManyLettersBetween(lastWord, prevWord)
      if (gap > 0) calcPoints.value += gap

      if (isAdjacentLetter(lastWord, prevWord)) {
        detectedTags.push('SUPER SUITE')
      }
      if (isGreaterOrTinierWord(lastWord, prevWord)) {
        detectedTags.push('SUPER SHRINK')
      }
      if (isAnagram(prevWord, lastWord)) {
        const bonus = 5
        anagramBonus.value = bonus
        calcPoints.value += bonus
        addBonusPoints(bonus)
        detectedTags.push('ANAGRAMME +5')
      } else {
        anagramBonus.value = 0
      }
    } else {
      anagramBonus.value = 0
    }

    const doubleLetterCount = countDoubleLetters(currentWord)
    if (doubleLetterCount > 0) {
      const bonus = doubleLetterCount * 2
      doubleLetterBonus.value = bonus
      calcPoints.value += bonus
      addBonusPoints(bonus)
      detectedTags.push(`DOUBLE LETTRE +${bonus}`)
    } else {
      doubleLetterBonus.value = 0
    }

    const palPoints = isPalindrome(wordPlayed.value)
    if (palPoints > 0) {
      calcPoints.value += palPoints
      detectedTags.push('PALINDROME +10')
    }

    if (speedBonusAwarded.value > 0) {
      calcPoints.value += speedBonusAwarded.value
      detectedTags.push(`SPEED +${speedBonusAwarded.value}`)
      speedBonusAwarded.value = 0
    }

    if (frequencyBonus.value > 0) {
      calcPoints.value += frequencyBonus.value
      frequencyBonus.value = 0
    }

    // Fever and Combo Multipliers
    let finalPoints = calcPoints.value
    if (isPlayerWord) {
      comboStreak.value += 1
      if (comboMultiplier.value > 1.0) {
        finalPoints = Math.round(finalPoints * comboMultiplier.value)
        detectedTags.push(`COMBO x${comboMultiplier.value}`)
      }
      if (feverActive.value) {
        sounds.playFever()
      } else if (finalPoints >= 20 || detectedTags.length >= 2) {
        sounds.playComboFanfare()
        fireShake()
      } else {
        sounds.playWordSuccess(comboStreak.value)
      }
      addCombatPopup(`+${finalPoints}`, detectedTags.join(' • ') || 'MOT VALIDE', 'text-neon-yellow')
    } else {
      addCombatPopup(`+${finalPoints}`, 'IA SCORE', 'text-neon-purple')
    }

    return finalPoints
  }

  const getCommonPrefixLength = (firstWord, secondWord) => {
    let length = 0
    const minLength = Math.min(firstWord.length, secondWord.length)
    while (length < minLength && firstWord[length] === secondWord[length]) {
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
      } else {
        addPoint(nextLetterNormalized)
      }
      index.value += 1
      sounds.playKeypress()
      setTimeout(() => typeWriter(), 110)
    } else if (index.value === refWord.value.length && refWord.value !== '') {
      const isPlayerTurn = !isVsComputer.value || !computerTurn.value
      const finalScore = pointsCount(isPlayerTurn)
      refWord.value = ''
      isTyping.value = false
      index.value = 0

      if (computerTurn.value === true && isVsComputer.value) {
        computerTurn.value = false
        comPoints.value += finalScore
        aiStatus.value = 'À ton tour !'
      } else {
        playerPoints.value += finalScore
        if (isVsComputer.value) {
          computerTurn.value = true
          aiStatus.value = 'Réflexion en cours...'
          comPlay()
        } else {
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
    if (!gameActive.value) return
    const entry = resolveEntry(word)
    if (!entry) {
      wordFail()
      return
    }
    if (wordList.value.includes(entry.normalized)) {
      wordFail()
      return
    }

    const owner = isSoloMode.value ? 'player' : computerTurn.value ? 'computer' : 'player'
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

  const comPlay = () => {
    if (!gameActive.value || !isVsComputer.value) return
    aiThinking.value = true

    let delay = 1800
    if (aiDifficultyRef.value === 'novice') delay = 2600 + Math.random() * 800
    if (aiDifficultyRef.value === 'expert') delay = 1100 + Math.random() * 500

    aiStatus.value = 'Recherche lexicale...'
    setTimeout(() => {
      if (!gameActive.value || !computerTurn.value) return
      aiThinking.value = false
      const randomWord = pickWeightedWord('')
      if (randomWord) {
        aiStatus.value = `Joue : ${randomWord}`
        isValidWord(randomWord)
      }
    }, delay)
  }

  const addWord = (word) => {
    if (!gameActive.value || isTyping.value || (isVsComputer.value && computerTurn.value)) return
    if (!word || word.trim().length === 0) return
    speedBonusAwarded.value = speedBonus.value
    stopSpeedTimer()
    isValidWord(word)
  }

  const startSoloSeed = () => {
    const seed = pickWeightedWord('')
    if (seed) {
      const entry = resolveEntry(seed)
      if (entry) {
        wordList.value.push(entry.normalized)
        wordListDisp.value.push({
          index: 0,
          text: entry.raw,
          normalized: entry.normalized,
          description: 'Mot amorce',
          visible: false,
          owner: 'player',
          tags: entry.tags || [],
        })
      }
    }
  }

  const toggleWordVisibility = (wordIndex) => {
    const word = wordListDisp.value[wordIndex]
    if (word) {
      word.visible = !word.visible
    }
  }

  const startSpeedTimer = () => {
    if (speedTimerId) clearInterval(speedTimerId)
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
    () => [computerTurn.value, gameActive.value, isTyping.value, isVsComputer.value, isSoloMode.value],
    ([isComputerTurn, isActive, typing, vsComputer, soloMode]) => {
      if (!isActive || typing) {
        stopSpeedTimer()
        return
      }
      if (soloMode || !isComputerTurn) {
        if (!speedTimerId) startSpeedTimer()
        return
      }
      stopSpeedTimer()
    }
  )

  const startGame = () => {
    gameActive.value = true
    sounds.initCtx()
    if (isSoloMode.value) {
      computerTurn.value = false
      startSoloSeed()
    } else {
      // In PvC mode, start with player or AI
      computerTurn.value = false
      startSoloSeed()
    }
  }

  const stopGame = () => {
    gameActive.value = false
    aiThinking.value = false
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
    anagramBonus.value = 0
    doubleLetterBonus.value = 0
    comboStreak.value = 0
    combatPopups.value = []
    pointsAdded.value = []
    computerTurn.value = false
    aiStatus.value = 'En veille'
  }

  // Live analysis of whatever the player is currently typing
  const analyzeInput = (text) => {
    if (!text || text.trim().length < 2) {
      return { valid: false, duplicate: false, points: 0, palindrome: false, anagram: false, doubleLetter: false, superSuite: false, superShrink: false }
    }
    const entry = resolveEntry(text)
    if (!entry) {
      return { valid: false, duplicate: false, points: 0, palindrome: false, anagram: false, doubleLetter: false, superSuite: false, superShrink: false }
    }
    const duplicate = wordList.value.includes(entry.normalized)
    const points = totalLetters(entry.normalized)
    const lastWord = wordList.value.length ? wordList.value[wordList.value.length - 1] : ''
    const palindrome = isPalindrome(entry.normalized) > 0
    const anagram = lastWord ? isAnagram(lastWord, entry.normalized) : false
    const doubleLetter = countDoubleLetters(entry.normalized) > 0
    let superSuite = false
    let superShrink = false
    if (lastWord) {
      const idx1 = letters.indexOf(lastWord[0])
      const idx2 = letters.indexOf(entry.normalized[0])
      if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) superSuite = true
      if (Math.abs(lastWord.length - entry.normalized.length) === 1) superShrink = true
    }
    return {
      valid: !duplicate,
      duplicate,
      points,
      palindrome,
      anagram,
      doubleLetter,
      superSuite,
      superShrink,
    }
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
    aiThinking,
    aiStatus,
    analyzeInput,
    startGame,
    stopGame,
    resetGame,
    startSoloSeed,
    addWord,
    toggleWordVisibility,
  }
}
