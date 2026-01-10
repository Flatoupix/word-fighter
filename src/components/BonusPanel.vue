<template>
  <aside class="panel">
    <h2 class="panel-title">Bonus</h2>
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
        <div class="font-display text-neon-orange">{{ scoreValue }}</div>
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
})
</script>
