<template>
  <ScreenShell
    title="Résultat"
    :showBack="true"
    paddingClass="p-3 sm:p-4"
    maxWidthClass="md:max-w-[32rem]"
    titleClass="text-2xl sm:text-3xl tracking-normal"
    @back="$emit('back')"
  >
    <div class="mt-4 text-center">
      <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ uiText.results.winner }}</div>
      <div :class="['font-display text-3xl sm:text-4xl', winnerClass || 'text-neon-purple']">
        {{ winnerLabel }}
      </div>
      <div class="mt-2 font-numbers text-4xl text-neon-orange sm:text-5xl">{{ winnerScore }}</div>
    </div>

    <div v-if="isOnline" class="mt-6 rounded-md border border-neon-pink/60 bg-black/30 p-3">
      <div class="text-center text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ uiText.results.leaderboard }}</div>
      <ul class="mt-3 space-y-2">
        <li
          v-for="(entry, index) in leaderboard"
          :key="entry.id || `${entry.name}-${index}`"
          class="flex items-center justify-between rounded-md border border-neon-pink/40 px-3 py-2 text-xs text-neon-yellow sm:text-sm"
        >
          <span :class="['font-ui uppercase tracking-wide', entry.colorClass || 'text-neon-yellow']">
            {{ index + 1 }}. {{ entry.name }}
          </span>
          <span :class="['font-numbers text-sm sm:text-base', entry.colorClass || 'text-neon-yellow']">
            {{ entry.score }}
          </span>
        </li>
      </ul>
    </div>

    <div v-else-if="opponentLabel" class="mt-6 grid gap-3 text-center md:grid-cols-2">
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ playerLabel }}</div>
        <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ playerScore }}</div>
      </div>
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ opponentLabel }}</div>
        <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ computerScore }}</div>
      </div>
    </div>

    <div v-else class="mt-6 text-center">
      <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">{{ playerLabel }}</div>
        <div class="font-numbers text-3xl text-neon-yellow sm:text-4xl">{{ playerScore }}</div>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row">
      <PrimaryButton class="flex-1 sm:py-3" @click="$emit('rematch')">
        <span class="font-display text-lg text-neon-yellow sm:text-xl">{{ uiText.results.replay }}</span>
      </PrimaryButton>
      <button
        type="button"
        class="inline-flex flex-1 items-center justify-center rounded-md border border-neon-pink/70 bg-black/30 px-4 py-2 font-display text-base text-neon-yellow/80 transition hover:border-neon-purple/80 hover:text-neon-yellow sm:text-lg"
        @click="$emit('restart')"
      >
        {{ uiText.results.mainMenu }}
      </button>
    </div>
  </ScreenShell>
</template>

<script setup>
import PrimaryButton from '../components/ui/PrimaryButton.vue'
import ScreenShell from '../components/ui/ScreenShell.vue'
import uiText from '../content/uiText.json'

defineProps({
  winnerLabel: {
    type: String,
    required: true,
  },
  winnerScore: {
    type: Number,
    required: true,
  },
  winnerClass: {
    type: String,
    default: '',
  },
  playerScore: {
    type: Number,
    required: true,
  },
  computerScore: {
    type: Number,
    required: true,
  },
  playerLabel: {
    type: String,
    required: true,
  },
  opponentLabel: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  leaderboard: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['restart', 'rematch', 'back'])
</script>
