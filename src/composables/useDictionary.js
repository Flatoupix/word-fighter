import wordsDictionary from '../assets/words/words_fr.json'

const MIN_WORD_LENGTH = 2
const wordKeys = Object.keys(wordsDictionary)
const normalizedLookup = {}
const cumulativeWeights = []
let totalWeight = 0

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

const normalizeWord = (word) => removeAccents(word.toLowerCase())

const selectWeight = (freqLemma, freqForm) => {
  if (freqForm > 0) {
    return freqForm
  }
  if (freqLemma > 0) {
    return freqLemma
  }
  return 0.01
}

for (const word of wordKeys) {
  const entry = wordsDictionary[word]
  const normalized = normalizeWord(word)
  const freqLemma = Number(entry.freqLemma) || 0
  const freqForm = Number(entry.freqForm) || 0
  const weight = selectWeight(freqLemma, freqForm)

  totalWeight += weight
  cumulativeWeights.push(totalWeight)

  const existing = normalizedLookup[normalized]
  if (!existing || existing.weight < weight) {
    normalizedLookup[normalized] = {
      word,
      normalized,
      freqLemma,
      freqForm,
      weight,
    }
  }
}

const formatFrequency = (freqLemma, freqForm) => {
  const lemma = Number(freqLemma) || 0
  const form = Number(freqForm) || 0
  if (lemma === 0 && form === 0) {
    return 'Frequence: inconnue'
  }
  return `freqLemma: ${lemma.toFixed(2)} | freqForm: ${form.toFixed(2)}`
}

const pickWeightedWord = () => {
  if (wordKeys.length === 0) {
    return null
  }
  if (totalWeight <= 0) {
    return wordKeys[Math.floor(Math.random() * wordKeys.length)]
  }

  const target = Math.random() * totalWeight
  let low = 0
  let high = cumulativeWeights.length - 1

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (target <= cumulativeWeights[mid]) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  return wordKeys[low]
}

const resolveEntry = (input) => {
  const trimmed = input.trim()
  if (trimmed.length === 0) {
    return null
  }

  const lower = trimmed.toLowerCase()
  const exactEntry = wordsDictionary[lower]
  const normalized = normalizeWord(lower)

  if (normalized.length < MIN_WORD_LENGTH) {
    return null
  }

  if (exactEntry) {
    return {
      raw: lower,
      normalized,
      freqLemma: Number(exactEntry.freqLemma) || 0,
      freqForm: Number(exactEntry.freqForm) || 0,
    }
  }

  const normalizedEntry = normalizedLookup[normalized]
  if (normalizedEntry) {
    return {
      raw: normalizedEntry.word,
      normalized: normalizedEntry.normalized,
      freqLemma: normalizedEntry.freqLemma,
      freqForm: normalizedEntry.freqForm,
    }
  }

  return null
}

export { normalizeWord, resolveEntry, pickWeightedWord, formatFrequency }
