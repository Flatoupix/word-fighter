<template>
  <main
    :class="[
      'relative flex flex-col justify-center gap-2 overflow-hidden rounded-lg border bg-black/60 p-4 backdrop-blur-md transition-all duration-300 min-h-[12rem] sm:min-h-[14rem]',
      feverActive ? 'border-neon-magenta fever-glow' : 'border-neon-pink/70',
    ]"
  >
    <!-- Fever Mode Banner -->
    <div
      v-if="feverActive"
      class="absolute top-2 left-1/2 -translate-x-1/2 rounded-full border border-neon-magenta bg-neon-magenta/20 px-3 py-0.5 text-[10px] font-ui uppercase tracking-widest text-neon-magenta font-bold animate-pulse"
    >
      🔥 FEVER MODE ACTIVE (POINTS MULTIPLIÉS)
    </div>

    <!-- Floating Combat Text Container -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        v-for="popup in combatPopups"
        :key="popup.id"
        class="float-combat-text absolute left-1/2 top-1/2 flex -translate-x-1/2 flex-col items-center"
      >
        <span :class="['font-display text-3xl sm:text-5xl drop-shadow-[0_0_12px_rgba(255,211,25,0.8)]', popup.color]">
          {{ popup.text }}
        </span>
        <span v-if="popup.tag" class="rounded-full bg-black/80 px-2 py-0.5 font-ui text-[10px] uppercase tracking-wider text-neon-yellow border border-neon-yellow/40">
          {{ popup.tag }}
        </span>
      </div>
    </div>

    <!-- Fail indicator -->
    <div v-if="wrongWord" class="text-center font-display text-4xl text-neon-pink drop-shadow-[0_0_15px_rgba(255,41,117,0.8)] sm:text-6xl quietMad">
      FAIL ! -1s
    </div>

    <!-- Points cascade -->
    <div class="min-h-[1.5rem] text-center text-neon-yellow/80">
      <span
        v-for="(point, index) in pointsAdded"
        :key="index"
        class="bounceFromTop inline-flex px-1 font-numbers text-xl text-neon-orange"
      >
        +{{ point }}
      </span>
    </div>

    <!-- Big animated typing letters -->
    <div
      class="text-center font-display tracking-wider"
      :class="{ blurOut: wrongWord }"
      :style="{ fontSize: dynamicFontSize }"
    >
      <span
        v-for="(letter, i) in wordChars"
        :key="i"
        class="zoomInBottom inline-flex px-0.5 text-neon-yellow drop-shadow-[0_0_12px_rgba(255,211,25,0.7)]"
      >
        {{ letter }}
      </span>
    </div>
  </main>
</template>

<script setup>
defineProps({
  wrongWord: {
    type: Boolean,
    required: true,
  },
  pointsAdded: {
    type: Array,
    required: true,
  },
  wordChars: {
    type: Array,
    required: true,
  },
  dynamicFontSize: {
    type: String,
    required: true,
  },
  combatPopups: {
    type: Array,
    default: () => [],
  },
  feverActive: {
    type: Boolean,
    default: false,
  },
})
</script>
