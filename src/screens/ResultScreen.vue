<template>
  <ScreenShell
    :title="titleText"
    :showBack="false"
    maxWidthClass="md:max-w-[32rem]"
    titleClass="text-2xl sm:text-4xl text-neon-yellow drop-shadow-[0_0_15px_rgba(255,211,25,0.6)]"
  >
    <!-- New Record Alert -->
    <div
      v-if="isNewRecord"
      class="mt-3 flex items-center justify-center gap-2 rounded-full border border-neon-yellow bg-neon-yellow/20 py-1 text-center font-display text-sm uppercase tracking-widest text-neon-yellow shadow-[0_0_15px_rgba(255,211,25,0.4)] animate-pulse"
    >
      <CyberIcon name="trophy" sizeClass="w-4 h-4 text-neon-yellow" />
      <span>NOUVEAU RECORD PERSONNEL !</span>
    </div>

    <!-- Match Outcome Hero -->
    <div class="mt-4 flex flex-col items-center justify-center rounded-lg border border-neon-pink/60 bg-black/50 p-4 text-center">
      <div class="flex items-center gap-2 text-[10px] font-ui uppercase tracking-widest text-neon-yellow/50">
        <CyberIcon :name="outcomeIcon" sizeClass="w-3.5 h-3.5" />
        <span>{{ outcomeSubtitle }}</span>
      </div>
      <div class="mt-1 font-numbers text-5xl font-bold text-neon-yellow drop-shadow-[0_0_20px_rgba(255,211,25,0.8)] sm:text-6xl">
        {{ playerScore }}
      </div>
      <div v-if="!isSolo" class="mt-2 text-xs font-ui text-neon-purple">
        vs {{ opponentLabel }} ({{ computerScore }} pts)
      </div>
    </div>

    <!-- Match Stats Grid -->
    <div class="mt-4 grid grid-cols-3 gap-2 text-center">
      <div class="rounded-md border border-white/10 bg-black/40 p-2">
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Mots joués</div>
        <div class="font-numbers text-lg text-neon-cyan">{{ wordsCount }}</div>
      </div>
      <div class="rounded-md border border-white/10 bg-black/40 p-2">
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Max Combo</div>
        <div class="font-numbers text-lg text-neon-orange">x{{ maxCombo }}</div>
      </div>
      <div class="rounded-md border border-white/10 bg-black/40 p-2">
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Meilleur mot</div>
        <div class="truncate font-display text-base text-neon-purple">{{ bestWord || '—' }}</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        class="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-neon-yellow bg-gradient-to-r from-neon-pink via-neon-purple to-neon-orange py-3 font-display text-xl text-neon-yellow shadow-[0_0_15px_rgba(255,211,25,0.5)] transition hover:scale-[1.02] active:scale-[0.98]"
        @click="$emit('rematch')"
      >
        <span>REJOUER (Entrée)</span>
        <CyberIcon name="arrow-enter" sizeClass="w-5 h-5 text-neon-yellow" />
      </button>
      <button
        type="button"
        class="inline-flex flex-1 items-center justify-center rounded-lg border border-neon-pink/70 bg-black/50 py-3 font-display text-base text-neon-yellow/80 transition hover:border-neon-purple hover:text-neon-yellow"
        @click="$emit('restart')"
      >
        Menu Arcade
      </button>
    </div>
  </ScreenShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import ScreenShell from '../components/ui/ScreenShell.vue'
import CyberIcon from '../components/ui/CyberIcon.vue'

const props = defineProps({
  playerScore: { type: Number, required: true },
  computerScore: { type: Number, required: true },
  playerLabel: { type: String, default: 'Joueur' },
  opponentLabel: { type: String, default: 'IA' },
  isSolo: { type: Boolean, default: false },
  isNewRecord: { type: Boolean, default: false },
  wordsCount: { type: Number, default: 0 },
  maxCombo: { type: Number, default: 1 },
  bestWord: { type: String, default: '' },
})

const emit = defineEmits(['rematch', 'restart'])

const isVictory = computed(() => !props.isSolo && props.playerScore > props.computerScore)
const isTie = computed(() => !props.isSolo && props.playerScore === props.computerScore)

const titleText = computed(() => {
  if (props.isSolo) return 'CHRONO TERMINÉ !'
  if (isVictory.value) return 'VICTOIRE !'
  if (isTie.value) return 'ÉGALITÉ !'
  return "DÉFAITE FACE À L'IA"
})

const outcomeIcon = computed(() => {
  if (props.isSolo) return 'clock'
  if (isVictory.value) return 'trophy'
  if (isTie.value) return 'swords'
  return 'defeat'
})

const outcomeSubtitle = computed(() => {
  if (props.isSolo) return 'Score Final Solo'
  if (isVictory.value) return 'Victoire Confirmée'
  if (isTie.value) return 'Match Nul'
  return 'Combat Perdu'
})

const handleKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('rematch')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
