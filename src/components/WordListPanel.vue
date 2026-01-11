<template>
  <aside class="flex min-h-0 flex-col rounded-md border border-neon-pink/70 bg-black/40 p-3 backdrop-blur-sm">
    <h2 class="text-center font-display text-2xl tracking-wide text-neon-yellow">Mots</h2>
    <ul ref="listRef" class="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
      <li v-for="(word, index) in words" :key="index">
        <button
          type="button"
          :class="[
            'w-full text-left font-accent text-lg',
            word.owner === 'computer' ? 'text-neon-purple' : 'text-neon-yellow',
          ]"
          @click="$emit('toggle', index)"
        >
          {{ word.text }}
        </button>
        <p v-if="word.visible && word.description" class="mt-1 text-sm text-neon-orange/90">
          {{ word.description }}
        </p>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const listRef = ref(null)

const props = defineProps({
  words: {
    type: Array,
    required: true,
  },
})

defineEmits(['toggle'])

watch(
  () => props.words.length,
  async () => {
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  }
)
</script>
