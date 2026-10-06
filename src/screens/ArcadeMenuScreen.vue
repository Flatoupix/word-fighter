<template>
  <div class="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-3 py-4 text-center sm:gap-6 sm:py-6">
    <!-- Retro Arcade Title -->
    <div>
      <div class="inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-black/60 px-3 py-0.5 text-[11px] font-ui uppercase tracking-widest text-neon-yellow/80">
        <span class="inline-block h-2 w-2 rounded-full bg-neon-green animate-pulse"></span>
        Édition Arcade v{{ version }}
      </div>
      <h1 class="mt-2 font-display text-4xl tracking-wider text-neon-yellow drop-shadow-[0_0_15px_rgba(255,211,25,0.6)] sm:text-6xl md:text-7xl">
        WORD FIGHTER
      </h1>
      <p class="font-ui text-xs text-neon-yellow/70 sm:text-sm">
        Tape des mots. Déclenche des combos. Domine l'arène.
      </p>
    </div>

    <!-- Mode Selector Cards -->
    <div class="grid w-full grid-cols-2 gap-3 sm:gap-4">
      <button
        type="button"
        :class="[
          'relative flex flex-col items-center justify-center rounded-lg border p-4 transition-all duration-200',
          selectedMode === 'solo'
            ? 'border-neon-yellow bg-neon-yellow/15 shadow-[0_0_18px_rgba(255,211,25,0.35)] scale-[1.02]'
            : 'border-neon-pink/40 bg-black/50 hover:border-neon-pink/80 hover:bg-black/70',
        ]"
        @click="selectMode('solo')"
      >
        <span class="text-3xl sm:text-4xl">⚡</span>
        <span class="mt-2 font-display text-xl text-neon-yellow sm:text-2xl">Solo Rush</span>
        <span class="mt-1 font-ui text-[11px] text-neon-yellow/60 sm:text-xs">
          Face au chrono. Explose ton record.
        </span>
        <span
          v-if="selectedMode === 'solo'"
          class="absolute -top-2.5 right-3 rounded-full bg-neon-yellow px-2 py-0.5 text-[9px] font-bold uppercase text-black"
        >
          Actif
        </span>
      </button>

      <button
        type="button"
        :class="[
          'relative flex flex-col items-center justify-center rounded-lg border p-4 transition-all duration-200',
          selectedMode === 'pvc'
            ? 'border-neon-purple bg-neon-purple/20 shadow-[0_0_18px_rgba(140,30,255,0.45)] scale-[1.02]'
            : 'border-neon-pink/40 bg-black/50 hover:border-neon-pink/80 hover:bg-black/70',
        ]"
        @click="selectMode('pvc')"
      >
        <span class="text-3xl sm:text-4xl">🤖</span>
        <span class="mt-2 font-display text-xl text-neon-yellow sm:text-2xl">Cyber Duel</span>
        <span class="mt-1 font-ui text-[11px] text-neon-yellow/60 sm:text-xs">
          Tour par tour contre l'ordinateur.
        </span>
        <span
          v-if="selectedMode === 'pvc'"
          class="absolute -top-2.5 right-3 rounded-full bg-neon-purple px-2 py-0.5 text-[9px] font-bold uppercase text-white"
        >
          Actif
        </span>
      </button>
    </div>

    <!-- AI Opponent Selection (If Duel selected) -->
    <div v-if="selectedMode === 'pvc'" class="w-full rounded-lg border border-neon-purple/50 bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
      <div class="text-[11px] font-ui uppercase tracking-wider text-neon-purple/90">Choisis ton adversaire IA</div>
      <div class="mt-2.5 grid grid-cols-3 gap-2">
        <button
          v-for="(ai, key) in opponents"
          :key="key"
          type="button"
          :class="[
            'flex flex-col items-center rounded-md border p-2 transition',
            selectedAi === key
              ? 'border-neon-purple bg-neon-purple/20 text-neon-yellow'
              : 'border-white/10 bg-black/40 text-neon-yellow/60 hover:border-neon-purple/50',
          ]"
          @click="selectedAi = key"
        >
          <span class="text-2xl">{{ ai.avatar }}</span>
          <span class="mt-1 font-display text-sm sm:text-base">{{ ai.name }}</span>
          <span class="text-[9px] font-ui text-neon-yellow/50">{{ ai.title }}</span>
        </button>
      </div>
      <div class="mt-2 text-xs italic text-neon-yellow/60">
        "{{ opponents[selectedAi]?.quote }}"
      </div>
    </div>

    <!-- Duration Selection -->
    <div class="w-full rounded-lg border border-neon-pink/50 bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
      <div class="text-[11px] font-ui uppercase tracking-wider text-neon-pink/90">Durée du round</div>
      <div class="mt-2.5 flex items-center justify-center gap-3">
        <button
          v-for="time in [1, 2, 3]"
          :key="time"
          type="button"
          :class="[
            'flex-1 rounded-md border py-2 text-center transition font-numbers font-bold text-sm sm:text-base',
            duration === time
              ? 'border-neon-yellow bg-neon-yellow/20 text-neon-yellow shadow-[0_0_10px_rgba(255,211,25,0.4)]'
              : 'border-white/15 bg-black/30 text-neon-yellow/60 hover:border-neon-yellow/50',
          ]"
          @click="duration = time"
        >
          {{ time }} MIN
          <span class="block text-[9px] font-ui font-normal text-neon-yellow/50">
            {{ time === 1 ? 'Blitz' : time === 2 ? 'Arcade' : 'Endurance' }}
          </span>
        </button>
      </div>
    </div>

    <!-- High Score & Stats Banner -->
    <div class="flex w-full items-center justify-around rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs">
      <div>
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Record Solo</div>
        <div class="font-numbers text-base font-bold text-neon-orange sm:text-lg">{{ stats.soloHighScore }} pts</div>
      </div>
      <div class="h-6 w-px bg-white/10"></div>
      <div>
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Record VS IA</div>
        <div class="font-numbers text-base font-bold text-neon-purple sm:text-lg">{{ stats.aiHighScore }} pts</div>
      </div>
      <div class="h-6 w-px bg-white/10"></div>
      <div>
        <div class="text-[9px] font-ui uppercase text-neon-yellow/50">Max Combo</div>
        <div class="font-numbers text-base font-bold text-neon-cyan sm:text-lg">x{{ stats.maxCombo || 1 }}</div>
      </div>
    </div>

    <!-- Start Action Button -->
    <button
      type="button"
      class="group relative w-full overflow-hidden rounded-lg border-2 border-neon-yellow bg-gradient-to-r from-neon-pink/80 via-neon-purple/80 to-neon-orange/80 py-3.5 shadow-[0_0_25px_rgba(255,211,25,0.5)] transition duration-200 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,211,25,0.8)] active:scale-[0.99] sm:py-4"
      @click="onStart"
    >
      <span class="relative z-10 flex items-center justify-center gap-2 font-display text-2xl tracking-wider text-neon-yellow sm:text-3xl">
        ENTRER DANS L'ARÈNE ⚡
      </span>
      <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GAME_VERSION } from '../config/constants'
import { getStats } from '../lib/storage'
import uiText from '../content/uiText.json'

const version = GAME_VERSION
const stats = ref(getStats())
const selectedMode = ref('solo')
const selectedAi = ref('medium')
const duration = ref(1)

const opponents = uiText.aiOpponents

const emit = defineEmits(['start'])

const selectMode = (mode) => {
  selectedMode.value = mode
}

const onStart = () => {
  emit('start', {
    mode: selectedMode.value,
    aiDifficulty: selectedAi.value,
    duration: duration.value,
  })
}
</script>
