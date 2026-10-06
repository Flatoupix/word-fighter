const STATS_KEY = 'wf_arcade_stats'

export const getStats = () => {
  if (typeof window === 'undefined') {
    return { soloHighScore: 0, aiHighScore: 0, totalWords: 0, maxCombo: 0 }
  }
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // fallback
  }
  return { soloHighScore: 0, aiHighScore: 0, totalWords: 0, maxCombo: 0 }
}

export const saveStats = (score, mode, wordsCount = 0, combo = 0) => {
  if (typeof window === 'undefined') return
  const current = getStats()
  if (mode === 'solo' && score > current.soloHighScore) {
    current.soloHighScore = score
  }
  if (mode === 'pvc' && score > current.aiHighScore) {
    current.aiHighScore = score
  }
  current.totalWords += wordsCount
  if (combo > current.maxCombo) {
    current.maxCombo = combo
  }
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(current))
  } catch (e) {
    // ignore
  }
  return current
}
