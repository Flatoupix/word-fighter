<template>
  <section class="flex flex-col gap-3">
    <!-- Top Match Header: Scores & Timer -->
    <div class="grid grid-cols-3 items-center gap-2 rounded-lg border border-neon-pink/70 bg-black/60 p-2.5 backdrop-blur-md sm:p-3">
      <!-- Player Panel -->
      <div class="flex flex-col items-center sm:items-start">
        <div class="flex items-center gap-1.5">
          <span class="inline-block h-2 w-2 rounded-full" :class="isPlayerTurn ? 'bg-neon-green animate-ping' : 'bg-white/20'"></span>
          <span class="font-display text-sm text-neon-yellow sm:text-lg">{{ playerLabel }}</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="font-numbers text-2xl font-bold text-neon-yellow sm:text-4xl">{{ playerPoints }}</span>
          <span v-if="comboStreak >= 2" class="rounded bg-neon-yellow/20 px-1.5 py-0.2 text-[10px] font-bold text-neon-yellow">
            x{{ comboMultiplier }}
          </span>
        </div>
      </div>

      <!-- Center Clock -->
      <div class="flex flex-col items-center justify-center">
        <div class="text-[9px] font-ui uppercase tracking-widest text-neon-yellow/50">CHRONO</div>
        <div
          :class="[
            'font-numbers text-2xl font-bold tracking-wider sm:text-3xl transition-colors duration-200',
            isTimeWarning ? 'text-neon-pink animate-pulse drop-shadow-[0_0_10px_rgba(255,41,117,0.8)]' : 'text-neon-orange',
          ]"
        >
          {{ formattedTime }}
        </div>
        <div v-if="comboStreak > 1" class="text-[9px] font-ui text-neon-cyan uppercase">
          Série : {{ comboStreak }} 🔥
        </div>
      </div>

      <!-- Right Panel: Record in Solo, or AI in Duel -->
      <div class="flex flex-col items-center sm:items-end">
        <template v-if="isSolo">
          <span class="font-display text-sm text-neon-yellow/70 sm:text-lg">Record</span>
          <span class="font-numbers text-xl font-bold text-neon-purple sm:text-3xl">{{ highScore }}</span>
        </template>
        <template v-else>
          <div class="flex items-center gap-1.5">
            <span class="font-display text-sm text-neon-purple sm:text-lg">{{ opponentLabel }}</span>
            <span class="text-base sm:text-xl">{{ aiAvatar }}</span>
          </div>
          <span class="font-numbers text-2xl font-bold text-neon-purple sm:text-4xl">{{ comPoints }}</span>
          <div v-if="aiStatus" class="max-w-[8rem] truncate text-[9px] font-ui text-neon-purple/80 sm:max-w-none">
            {{ aiStatus }}
          </div>
        </template>
      </div>
    </div>

    <!-- Active Input Box with Live Preview -->
    <div class="relative rounded-lg border border-neon-pink/70 bg-black/60 p-3 backdrop-blur-md">
      <!-- Input Field -->
      <div class="relative flex items-center">
        <input
          ref="inputRef"
          :value="wordInput"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :disabled="disabled"
          :class="[
            'w-full rounded-md border border-neon-pink/80 bg-black/40 px-4 py-2.5 font-display text-xl text-neon-yellow placeholder:text-neon-yellow/30 focus:outline-none focus:ring-2 focus:ring-neon-purple/70 sm:text-3xl transition-all',
            wrongWord ? 'quietMad border-neon-pink bg-neon-pink/10' : '',
            disabled ? 'cursor-not-allowed opacity-50' : '',
          ]"
          :placeholder="disabled ? 'En attente de l\'IA...' : 'Tape ton mot et appuie sur Entrée...'"
          @input="onInput"
          @keydown.enter.prevent="$emit('submit')"
        />
        <button
          v-if="wordInput"
          type="button"
          class="absolute right-3 rounded bg-neon-yellow/20 px-3 py-1 font-display text-xs text-neon-yellow transition hover:bg-neon-yellow/40 active:scale-95 sm:text-sm"
          :disabled="disabled"
          @click="$emit('submit')"
        >
          Valider ↵
        </button>
      </div>

      <!-- Live Analysis Bar (Juice & QoL) -->
      <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <!-- Live Candidate Points & Validity Status -->
        <div class="flex items-center gap-2">
          <span
            v-if="liveAnalysis.valid"
            class="inline-flex items-center gap-1 rounded bg-neon-green/20 px-2 py-0.5 text-[10px] font-bold text-neon-green border border-neon-green/40"
          >
            ✓ MOT VALIDE (+{{ liveAnalysis.points }} pts)
          </span>
          <span
            v-else-if="liveAnalysis.duplicate"
            class="inline-flex items-center gap-1 rounded bg-neon-pink/20 px-2 py-0.5 text-[10px] font-bold text-neon-pink border border-neon-pink/40"
          >
            ✕ DÉJÀ JOUÉ
          </span>
          <span
            v-else-if="wordInput.length >= 2"
            class="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] text-neon-yellow/60 border border-white/10"
          >
            Mot inconnu
          </span>

          <!-- Detected Bonus Badges in Real-Time -->
          <span
            v-if="liveAnalysis.palindrome"
            class="rounded bg-neon-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-neon-yellow border border-neon-yellow/50 animate-bounce"
          >
            ✨ PALINDROME (+10)
          </span>
          <span
            v-if="liveAnalysis.anagram"
            class="rounded bg-neon-purple/20 px-1.5 py-0.5 text-[10px] font-bold text-neon-purple border border-neon-purple/50"
          >
            🔄 ANAGRAMME (+5)
          </span>
          <span
            v-if="liveAnalysis.superSuite"
            class="rounded bg-neon-cyan/20 px-1.5 py-0.5 text-[10px] font-bold text-neon-cyan border border-neon-cyan/50"
          >
            ⚡ SUPER SUITE
          </span>
          <span
            v-if="liveAnalysis.superShrink"
            class="rounded bg-neon-orange/20 px-1.5 py-0.5 text-[10px] font-bold text-neon-orange border border-neon-orange/50"
          >
            📐 SUPER SHRINK
          </span>
        </div>

        <!-- Speed & Timer metrics -->
        <div class="ml-auto flex items-center gap-3 text-[10px] font-ui text-neon-yellow/60">
          <span>Vitesse : <strong class="font-numbers text-neon-yellow">{{ speedElapsed }}s</strong></span>
          <span>Bonus temps : <strong class="font-numbers text-neon-orange">+{{ speedBonus }}</strong></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { sounds } from '../../lib/soundFx'

const props = defineProps({
  playerPoints: { type: Number, required: true },
  comPoints: { type: Number, required: true },
  wordInput: { type: String, required: true },
  wrongWord: { type: Boolean, required: true },
  speedElapsed: { type: String, required: true },
  speedBonus: { type: Number, required: true },
  playerLabel: { type: String, required: true },
  opponentLabel: { type: String, required: true },
  formattedTime: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  isSolo: { type: Boolean, default: false },
  highScore: { type: Number, default: 0 },
  aiAvatar: { type: String, default: '🤖' },
  aiStatus: { type: String, default: '' },
  comboStreak: { type: Number, default: 0 },
  comboMultiplier: { type: Number, default: 1 },
  analyzeInput: { type: Function, default: () => ({ valid: false, duplicate: false, points: 0 }) },
})

const emit = defineEmits(['update:wordInput', 'submit'])

const inputRef = ref(null)

const isPlayerTurn = computed(() => !props.disabled)
const isTimeWarning = computed(() => {
  const parts = props.formattedTime.split(':')
  const seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10)
  return seconds <= 10 && seconds > 0
})

const liveAnalysis = computed(() => {
  return props.analyzeInput(props.wordInput)
})

const onInput = (event) => {
  sounds.playKeypress()
  emit('update:wordInput', event.target.value)
}

// Global key focus handler: typing anywhere keeps the input active!
const handleGlobalKeyDown = (e) => {
  if (e.target && e.target.tagName === 'INPUT') return
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (inputRef.value && !inputRef.value.disabled) {
      inputRef.value.focus()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown)
  nextTick(() => {
    if (inputRef.value && !inputRef.value.disabled) {
      inputRef.value.focus()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})

watch(
  () => props.disabled,
  (isDisabled) => {
    if (!isDisabled) {
      nextTick(() => {
        if (inputRef.value) inputRef.value.focus()
      })
    }
  }
)

defineExpose({
  focusInput: () => {
    if (inputRef.value && !inputRef.value.disabled) {
      inputRef.value.focus()
    }
  },
})
</script>
