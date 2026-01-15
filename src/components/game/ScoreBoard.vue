<template>
  <section
    :class="
      isOnline
        ? 'grid gap-2 sm:gap-4 md:grid-cols-[1.2fr_2fr]'
        : 'grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-[1fr_2fr_1fr]'
    "
  >
    <div
      v-if="!isOnline"
      class="order-1 col-span-1 rounded-md border border-neon-pink/70 bg-black/40 p-2 text-center backdrop-blur-sm sm:p-3 md:order-none md:col-span-1"
    >
      <h2 class="font-display text-lg text-neon-yellow sm:text-xl">{{ playerLabel }}</h2>
      <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ playerPoints }}</div>
    </div>

    <div
      v-else
      class="rounded-md border border-neon-pink/70 bg-black/40 p-2 text-left backdrop-blur-sm sm:p-3"
    >
      <h2 class="text-center font-display text-lg text-neon-yellow sm:text-xl">Joueurs</h2>
      <ul v-if="orderedPlayers.length" class="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
        <li
          v-for="player in orderedPlayers"
          :key="player.player_id"
          :class="[
            'rounded-md border px-3 py-2 text-xs sm:text-sm',
            isActive(player)
              ? 'border-neon-yellow/80 bg-neon-yellow/10 text-neon-yellow'
              : 'border-neon-pink/40 text-neon-yellow/70',
          ]"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-ui uppercase tracking-wide">{{ player.name }}</span>
            <span class="font-numbers text-sm text-neon-yellow">{{ playerScore(player) }}</span>
          </div>
          <div v-if="isActive(player)" class="mt-1 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/80">
            tour
          </div>
        </li>
      </ul>
      <div v-else class="mt-3 text-center text-xs text-neon-yellow/60">En attente de joueurs...</div>
    </div>

    <div
      :class="[
        isOnline ? 'col-span-1' : 'order-3 col-span-2 md:order-none md:col-span-1',
        'rounded-md border border-neon-pink/70 bg-black/40 p-2 backdrop-blur-sm sm:p-3',
      ]"
    >
      <input
        ref="inputRef"
        :value="wordInput"
        type="text"
        autocomplete="off"
        :disabled="disabled"
        :class="[
          'w-full rounded-md border border-neon-pink/80 bg-black/30 px-4 py-2 font-display text-xl text-neon-yellow placeholder:text-neon-yellow/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 sm:text-2xl',
          wrongWord ? 'quietMad' : '',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ]"
        @input="$emit('update:wordInput', $event.target.value)"
        @keydown.enter.prevent="$emit('submit')"
        placeholder="Tape ton mot..."
      />
     
      <div class="mt-3 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 sm:text-[10px]">
          <span class="text-neon-yellow/50">Vitesse</span>
          <span class="w-[3.5rem] font-numbers text-sm text-neon-yellow sm:text-sm">{{ speedElapsed }}s</span>
        </div> 
      <div class="flex items-center justify-center gap-3 text-center">
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[10px]">Temps</div>
        <div class="font-numbers text-xl text-neon-orange sm:text-xl">{{ formattedTime }}</div>
      </div>
        <div class="ml-auto flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 sm:text-[10px]">
          <span class="text-neon-yellow/50">Bonus</span>
          <span class="font-numbers text-sm text-neon-orange sm:text-sm">+{{ speedBonus }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="!isOnline"
      class="order-2 col-span-1 rounded-md border border-neon-pink/70 bg-black/40 p-2 text-center backdrop-blur-sm sm:p-3 md:order-none md:col-span-1"
    >
      <h2 class="font-display text-lg text-neon-purple sm:text-xl">{{ opponentLabel }}</h2>
      <div class="font-numbers text-2xl text-neon-yellow sm:text-3xl">{{ comPoints }}</div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const inputRef = ref(null)

const props = defineProps({
  playerPoints: {
    type: Number,
    required: true,
  },
  comPoints: {
    type: Number,
    required: true,
  },
  wordInput: {
    type: String,
    required: true,
  },
  wrongWord: {
    type: Boolean,
    required: true,
  },
  speedElapsed: {
    type: String,
    required: true,
  },
  speedBonus: {
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
  formattedTime: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  onlinePlayers: {
    type: Array,
    default: () => [],
  },
  onlineScores: {
    type: Object,
    default: () => ({}),
  },
  activePlayerId: {
    type: String,
    default: '',
  },
})

defineEmits(['update:wordInput', 'submit'])

const orderedPlayers = computed(() => {
  if (!props.onlinePlayers.length) return []
  if (!props.activePlayerId) return props.onlinePlayers
  const activeIndex = props.onlinePlayers.findIndex((player) => player.player_id === props.activePlayerId)
  if (activeIndex <= 0) return props.onlinePlayers
  return [
    props.onlinePlayers[activeIndex],
    ...props.onlinePlayers.slice(0, activeIndex),
    ...props.onlinePlayers.slice(activeIndex + 1),
  ]
})

const isActive = (player) => props.activePlayerId && player.player_id === props.activePlayerId
const playerScore = (player) => props.onlineScores?.[player.player_id] ?? 0

defineExpose({
  focusInput: () => {
    if (inputRef.value && !inputRef.value.disabled) {
      inputRef.value.focus()
    }
  },
})
</script>
