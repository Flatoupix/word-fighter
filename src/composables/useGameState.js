import { computed, onMounted, ref } from 'vue'
import scrabble from '../assets/words/scrabble.json'
import wooshUrl from '../assets/audio/woosh.mp3'
import { formatFrequency, normalizeWord, pickWeightedWord, resolveEntry } from './useDictionary'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const objectLetters = scrabble.letters

export const useGameState = () => {
  const wordInput = ref('')
  const wordList = ref([])
  const wordListDisp = ref([])
  const refWord = ref('')
  const isTyping = ref(false)
  const wordPlayed = ref('')
  const computerTurn = ref(true)
  const index = ref(0)
  const wrongWord = ref(false)

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

  const wordFail = () => {
    wrongWord.value = true
    setTimeout(() => {
      wrongWord.value = false
      wordPlayed.value = ''
      calcPoints.value = 0
      superSuiteBonus.value = 0
      superShrinkBonus.value = 0
      wordInput.value = ''
      pointsAdded.value = []
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

  const addPoint = (currentLetter) => {
    const letter = objectLetters[currentLetter]
    if (!letter) {
      return
    }

    pointsAdded.value.push(letter.points)
    calcPoints.value += letter.points
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
    if (word.split('').reverse().join('') === word) {
      return 10
    }
    return 0
  }

  const totalLetters = (word) => {
    let totalPoints = 0
    for (let i = 0; i < word.length; i += 1) {
      const letter = objectLetters[word[i]]
      if (letter) {
        totalPoints += letter.points
      }
    }
    return totalPoints
  }

  const scoreValue = computed(() => totalLetters(wordPlayed.value))
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
  }

  const randomDelay = (max) => Math.floor(max * Math.random())

  const typeWriter = (word) => {
    if (index.value === 0) {
      refWord.value = word || wordInput.value
    }
    wordInput.value = ''

    if (index.value < refWord.value.length) {
      isTyping.value = true
      const nextLetter = normalizeWord(refWord.value.charAt(index.value))
      wordPlayed.value += nextLetter
      addPoint(nextLetter)
      index.value += 1
      playAtDuring(wooshUrl)
      setTimeout(() => typeWriter(), randomDelay(300))
    } else if (index.value === refWord.value.length && refWord.value !== '') {
      pointsCount()
      refWord.value = ''
      isTyping.value = false
      index.value = 0

      if (computerTurn.value === true) {
        computerTurn.value = false
        comPoints.value += calcPoints.value
      } else {
        playerPoints.value += calcPoints.value
        computerTurn.value = true
        comPlay()
      }
      calcPoints.value = 0
    }
  }

  const textType = (word) => {
    wordPlayed.value = ''
    typeWriter(word)
  }

  const isValidWord = (word) => {
    const entry = resolveEntry(word)
    if (!entry) {
      wordFail()
      return
    }

    const wordObj = {
      index: wordList.value.length,
      text: entry.raw,
      description: formatFrequency(entry.freqLemma, entry.freqForm),
      visible: false,
    }

    textType(entry.raw)
    wordList.value.push(entry.normalized)
    wordListDisp.value.push(wordObj)
  }

  const getWord = () => {
    const randomWord = pickWeightedWord()
    if (!randomWord) {
      return
    }
    isValidWord(randomWord)
  }

  const comPlay = () => {
    if (isTyping.value === false) {
      setTimeout(() => getWord(), 4000)
    }
  }

  const addWord = (word) => {
    if (!word || word.trim().length === 0) {
      return
    }
    computerTurn.value = false
    isValidWord(word)
  }

  const toggleWordVisibility = (wordIndex) => {
    const word = wordListDisp.value[wordIndex]
    if (word) {
      word.visible = !word.visible
    }
  }

  onMounted(() => {
    comPlay()
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
    playerPoints,
    comPoints,
    addWord,
    toggleWordVisibility,
  }
}
