<template>
  <div class="min-h-screen text-neon-yellow">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 text-glow fade-in">
      <header class="text-center">
        <h1 class="font-display text-5xl tracking-wide text-neon-purple">Word Fighter</h1>
        <p class="mt-2 text-sm text-neon-yellow/80">Tape un mot pour marquer des points.</p>
      </header>

      <section class="grid gap-4 md:grid-cols-3">
        <aside class="panel">
          <h2 class="panel-title">Mots</h2>
          <ul class="mt-3 space-y-2">
            <li v-for="(word, index) in wordListDisp" :key="index">
              <button type="button" class="word-item" @click="word.visible = !word.visible">
                {{ word.text }}
              </button>
              <p v-if="word.visible && word.description" class="mt-1 text-sm text-neon-orange/90">
                {{ word.description }}
              </p>
            </li>
          </ul>
        </aside>

        <main class="panel flex flex-col justify-center gap-2">
          <div v-if="wrongWord" class="text-center font-display text-6xl text-neon-yellow zoomIn">
            FAIIIL
          </div>
          <div class="min-h-[1.5rem] text-center text-neon-yellow/80">
            <span v-for="(point, index) in pointsAdded" :key="index" class="bounceFromTop inline-flex px-1">
              +{{ point }}
            </span>
          </div>
          <div
            class="text-center font-accent"
            :class="{ blurOut: wrongWord }"
            :style="{ fontSize: dynamicFontSize }"
          >
            <span v-for="(letter, i) in wordChars" :key="i" class="zoomInBottom inline-flex">
              {{ letter }}
            </span>
          </div>
        </main>

        <aside class="panel">
          <h2 class="panel-title">Bonus</h2>
          <div class="mt-3 space-y-3 text-center">
            <div>
              <div
                :class="[
                  'font-display text-xl',
                  superSuiteBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
                ]"
              >
                Super Suite
              </div>
              <div v-if="superSuiteBonus > 0" class="font-display text-neon-orange">+{{ superSuiteBonus }}</div>
            </div>
            <div>
              <div
                :class="[
                  'font-display text-xl',
                  superShrinkBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
                ]"
              >
                Super Shrink
              </div>
              <div v-if="superShrinkBonus > 0" class="font-display text-neon-orange">+{{ superShrinkBonus }}</div>
            </div>
            <div>
              <div
                :class="[
                  'font-display text-xl',
                  isPalindrome(wordPlayed) > 5 && wordPlayed !== '' && !isTyping
                    ? 'text-neon-yellow'
                    : 'text-neon-yellow/60',
                ]"
              >
                Palindrome
              </div>
              <div
                v-if="isPalindrome(wordPlayed) > 5 && wordPlayed !== '' && !isTyping"
                class="font-display text-neon-orange"
              >
                +10
              </div>
            </div>
            <div>
              <div
                :class="[
                  'font-display text-xl',
                  totalLetters(wordPlayed) > 0 && !isTyping ? 'text-neon-yellow' : 'text-neon-yellow/60',
                ]"
              >
                Score
              </div>
              <div class="font-display text-neon-orange">{{ totalLetters(wordPlayed) }}</div>
            </div>
          </div>
        </aside>
      </section>

      <section class="grid gap-4 md:grid-cols-[1fr_2fr_1fr]">
        <div class="panel text-center">
          <h2 class="font-display text-xl text-neon-orange">Player</h2>
          <div class="score">{{ playerPoints }}</div>
        </div>
        <div class="panel">
          <input
            v-model="wordInput"
            type="text"
            autocomplete="off"
            :class="['input-field', wrongWord ? 'quietMad' : '']"
            @keydown.enter.prevent="addWord(wordInput)"
            placeholder="Tape ton mot..."
          />
        </div>
        <div class="panel text-center">
          <h2 class="font-display text-xl text-neon-orange">Computer</h2>
          <div class="score">{{ comPoints }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import scrabble from './assets/scrabble.json'
import wooshUrl from './assets/audio/woosh.mp3'

const letters = 'abcdefghijklmnopqrstuvwxyz'
const objectLetters = scrabble.letters

const mockWords = [
  'synth',
  'laser',
  'arcade',
  'pixel',
  'runner',
  'vapor',
  'glitch',
  'neon',
  'tempo',
  'omega',
  'alpha',
  'orbit',
  'signal',
  'circuit',
  'vector',
  'matrix',
]

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

const howManyLettersBetween = (firstWord, secondWord) => {
  const firstIndex = letters.indexOf(firstWord[0])
  const secondIndex = letters.indexOf(secondWord[0])
  if (firstIndex === -1 || secondIndex === -1) {
    return 0
  }
  return Math.abs(firstIndex - secondIndex)
}

const getWord = () => {
  const randomWord = mockWords[Math.floor(Math.random() * mockWords.length)]
  isValidWord(randomWord)
}

const isValidWord = (word) => {
  const trimmed = word.trim()
  if (trimmed.length === 0) {
    return
  }

  const normalized = removeAccents(trimmed.toLowerCase())
  const isValid = normalized.length >= 2 && /^[a-z]+$/.test(normalized)
  if (!isValid) {
    wordFail()
    return
  }

  const wordObj = {
    index: wordList.value.length,
    text: trimmed,
    description: 'Mot valide (mock).',
    visible: false,
  }

  textType(trimmed)
  wordList.value.push(normalized)
  wordListDisp.value.push(wordObj)
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

const randomDelay = (max) => Math.floor(max * Math.random())

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

const typeWriter = (word) => {
  if (wordInput.value === '' && word) {
    wordInput.value = word
  }

  if (index.value === 0) {
    refWord.value = wordInput.value
  }
  wordInput.value = ''

  if (index.value < refWord.value.length) {
    isTyping.value = true
    const nextLetter = removeAccents(refWord.value.charAt(index.value))
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

const removeAccents = (str) => {
  const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
  const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'

  const chars = str.split('')
  for (let i = 0; i < chars.length; i += 1) {
    const accentIndex = accents.indexOf(chars[i])
    if (accentIndex !== -1) {
      chars[i] = accentsOut[accentIndex]
    }
  }
  return chars.join('')
}

onMounted(() => {
  comPlay()
})
</script>
