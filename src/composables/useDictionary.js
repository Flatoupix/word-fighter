import wordsDictionary from '../assets/words/words_fr_tagged.json'

const MIN_WORD_LENGTH = 2
const wordKeys = Object.keys(wordsDictionary)
const normalizedLookup = {}
const cumulativeWeights = []
let totalWeight = 0
const tagIndex = {}

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
  const tags = Array.isArray(entry.tags) ? entry.tags : []
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
      tags,
      weight,
    }
  }

  for (const tag of tags) {
    if (!tagIndex[tag]) {
      tagIndex[tag] = {
        keys: [],
        cumulativeWeights: [],
        totalWeight: 0,
      }
    }
    const bucket = tagIndex[tag]
    bucket.totalWeight += weight
    bucket.keys.push(word)
    bucket.cumulativeWeights.push(bucket.totalWeight)
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

const pickWeightedWord = (tag) => {
  if (wordKeys.length === 0) {
    return null
  }
  const bucket = tag ? tagIndex[tag] : null
  if (bucket && bucket.keys.length === 0) {
    return null
  }

  if (bucket) {
    const target = Math.random() * bucket.totalWeight
    let low = 0
    let high = bucket.cumulativeWeights.length - 1

    while (low < high) {
      const mid = Math.floor((low + high) / 2)
      if (target <= bucket.cumulativeWeights[mid]) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    return bucket.keys[low]
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
      tags: Array.isArray(exactEntry.tags) ? exactEntry.tags : [],
    }
  }

  const normalizedEntry = normalizedLookup[normalized]
  if (normalizedEntry) {
    return {
      raw: normalizedEntry.word,
      normalized: normalizedEntry.normalized,
      freqLemma: normalizedEntry.freqLemma,
      freqForm: normalizedEntry.freqForm,
      tags: normalizedEntry.tags || [],
    }
  }

  return null
}

export { normalizeWord, resolveEntry, pickWeightedWord, formatFrequency }
