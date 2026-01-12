<template>
  <main class="flex flex-col justify-center gap-2 rounded-md border border-neon-pink/70 bg-black/40 p-3 backdrop-blur-sm">
    <div v-if="wrongWord" class="text-center font-display text-3xl text-neon-yellow sm:text-5xl md:text-6xl zoomIn">
      FAIIIL
    </div>
    <div class="min-h-[1.5rem] text-center text-neon-yellow/80">
      <span
        v-for="(point, index) in pointsAdded"
        :key="index"
        class="bounceFromTop inline-flex px-1 font-numbers text-xl text-neon-orange"
      >
        +{{ point }}
      </span>
    </div>
    <div class="text-center font-display" :class="{ blurOut: wrongWord }" :style="{ fontSize: dynamicFontSize }">
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
