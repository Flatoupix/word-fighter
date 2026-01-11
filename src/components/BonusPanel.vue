<template>
  <aside class="rounded-md border border-neon-pink/70 bg-black/40 p-3 backdrop-blur-sm">
    <h2 class="text-center font-display text-2xl tracking-wide text-neon-yellow">Bonus</h2>
    <div class="mt-3 space-y-3 text-center">
      <div>
        <div
          :class="[
            'font-display text-xl',
            superSuiteBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Super Suite
        </div>
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Initiales adjacentes</div>
        <div v-if="superSuiteBonus > 0" class="font-display text-neon-orange">+{{ superSuiteBonus }}</div>
      </div>
      <div>
        <div
          :class="[
            'font-display text-xl',
            superShrinkBonus > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Super Shrink
        </div>
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">±1 lettre</div>
        <div v-if="superShrinkBonus > 0" class="font-display text-neon-orange">+{{ superShrinkBonus }}</div>
      </div>
      <div>
        <div
          :class="[
            'font-display text-xl',
            palindromeActive ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Palindrome
        </div>
        <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Mot identique inversé</div>
        <div v-if="palindromeActive" class="font-display text-neon-orange">+10</div>
      </div>
      <div>
        <div
          :class="[
            'font-display text-xl',
            scoreValue > 0 ? 'text-neon-yellow' : 'text-neon-yellow/60',
          ]"
        >
          Score
        </div>
        <div class="flex h-[2.8rem] items-center justify-center">
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
