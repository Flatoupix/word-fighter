<template>
  <main class="panel flex flex-col justify-center gap-2">
    <div v-if="wrongWord" class="text-center font-display text-6xl text-neon-yellow zoomIn">
      FAIIIL
    </div>
    <div class="min-h-[1.5rem] text-center text-neon-yellow/80">
      <span v-for="(point, index) in pointsAdded" :key="index" class="bounceFromTop inline-flex px-1">
        +{{ point }}
      </span>
    </div>
    <div class="text-center font-accent" :class="{ blurOut: wrongWord }" :style="{ fontSize: dynamicFontSize }">
      <span v-for="(letter, i) in wordChars" :key="i" class="zoomInBottom inline-flex">
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
})
</script>
