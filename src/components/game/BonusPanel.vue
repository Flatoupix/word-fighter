<template>
  <aside class="rounded-md border border-neon-pink/70 bg-black/40 p-2 backdrop-blur-sm sm:p-3">
    <h2 class="text-center font-display text-lg tracking-wide text-neon-yellow sm:text-xl md:text-2xl">Bonus</h2>
    <div class="mt-3 space-y-2.5 text-center">
      <div>
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            superSuiteBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Super Suite
        </div>
        <div class="text-[8px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[9px]">
          Initiales adjacentes
        </div>
        <div v-if="superSuiteBonus > 0" class="font-display text-sm text-neon-orange sm:text-base">+{{ superSuiteBonus }}</div>
      </div>

      <div>
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            superShrinkBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Super Shrink
        </div>
        <div class="text-[8px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[9px]">
          ±1 lettre
        </div>
        <div v-if="superShrinkBonus > 0" class="font-display text-sm text-neon-orange sm:text-base">+{{ superShrinkBonus }}</div>
      </div>

      <div>
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            anagramBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Anagramme
        </div>
        <div class="text-[8px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[9px]">
          Mêmes lettres
        </div>
        <div v-if="anagramBonus > 0" class="font-display text-sm text-neon-orange sm:text-base">+{{ anagramBonus }}</div>
      </div>

      <div>
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            doubleLetterBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Double Lettre
        </div>
        <div class="text-[8px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[9px]">
          Paire consécutive
        </div>
        <div v-if="doubleLetterBonus > 0" class="font-display text-sm text-neon-orange sm:text-base">+{{ doubleLetterBonus }}</div>
      </div>

      <div>
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            palindromeActive ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Palindrome
        </div>
        <div class="text-[8px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[9px]">
          Mot inversé
        </div>
        <div v-if="palindromeActive" class="font-display text-sm text-neon-orange sm:text-base">+10</div>
      </div>

      <div class="border-t border-neon-pink/30 pt-1">
        <div
          :class="[
            'font-display text-sm sm:text-base md:text-lg',
            scoreValue > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Score Mot
        </div>
        <div class="flex h-[2rem] items-center justify-center sm:h-[2.4rem]">
          <div
            class="font-numbers text-neon-orange transition-[font-size] duration-[220ms] ease-out"
            :style="{ fontSize: scoreFontSize }"
          >
            {{ scoreValue }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  superSuiteBonus: {
    type: Number,
    required: true,
  },
  superShrinkBonus: {
    type: Number,
    required: true,
  },
  anagramBonus: {
    type: Number,
    default: 0,
  },
  doubleLetterBonus: {
    type: Number,
    default: 0,
  },
  palindromeActive: {
    type: Boolean,
    required: true,
  },
  scoreValue: {
    type: Number,
    required: true,
  },
  scoreFontSize: {
    type: String,
    required: true,
  },
})
</script>
