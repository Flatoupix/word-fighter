<template>
  <div class="w-full select-none pt-2 sm:hidden touch-manipulation">
    <!-- Action / Clear bar -->
    <div class="mb-1 flex items-center justify-between px-1 text-[11px] font-ui text-neon-yellow/70">
      <div class="flex items-center gap-1.5">
        <CyberIcon name="keyboard" sizeClass="w-3.5 h-3.5 text-neon-yellow/60" />
        <span class="uppercase tracking-wider">Clavier Virtuel</span>
      </div>
      <button
        v-if="hasLetters"
        type="button"
        class="inline-flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-neon-pink border border-neon-pink/40 active:scale-95 transition"
        @click="$emit('clear')"
      >
        <span>Effacer tout</span>
      </button>
    </div>

    <!-- Rows 1, 2, 3 -->
    <div class="flex flex-col gap-1.5 rounded-lg border border-neon-purple/40 bg-black/75 p-1.5 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <!-- Row 1: AZERTYUIOP -->
      <div class="flex justify-center gap-1">
        <button
          v-for="key in row1"
          :key="key"
          type="button"
          :disabled="disabled"
          class="flex h-11 flex-1 items-center justify-center rounded border border-neon-pink/40 bg-neon-purple/20 font-display text-lg text-neon-yellow shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition active:scale-90 active:bg-neon-yellow active:text-black disabled:opacity-40"
          @touchstart.prevent="pressKey(key)"
          @click="pressKey(key)"
        >
          {{ key }}
        </button>
      </div>

      <!-- Row 2: QSDFGHJKLM -->
      <div class="flex justify-center gap-1">
        <button
          v-for="key in row2"
          :key="key"
          type="button"
          :disabled="disabled"
          class="flex h-11 flex-1 items-center justify-center rounded border border-neon-pink/40 bg-neon-purple/20 font-display text-lg text-neon-yellow shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition active:scale-90 active:bg-neon-yellow active:text-black disabled:opacity-40"
          @touchstart.prevent="pressKey(key)"
          @click="pressKey(key)"
        >
          {{ key }}
        </button>
      </div>

      <!-- Row 3: Backspace + WXCVBN + Enter -->
      <div class="flex justify-center gap-1">
        <!-- Backspace Button -->
        <button
          type="button"
          :disabled="disabled || !hasLetters"
          class="flex h-11 w-12 items-center justify-center rounded border border-neon-pink/60 bg-neon-pink/20 text-neon-pink shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition active:scale-90 active:bg-neon-pink active:text-white disabled:opacity-30"
          title="Effacer"
          @touchstart.prevent="pressBackspace"
          @click="pressBackspace"
        >
          <CyberIcon name="backspace" sizeClass="w-5 h-5" />
        </button>

        <!-- Middle letters -->
        <button
          v-for="key in row3"
          :key="key"
          type="button"
          :disabled="disabled"
          class="flex h-11 flex-1 items-center justify-center rounded border border-neon-pink/40 bg-neon-purple/20 font-display text-lg text-neon-yellow shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition active:scale-90 active:bg-neon-yellow active:text-black disabled:opacity-40"
          @touchstart.prevent="pressKey(key)"
          @click="pressKey(key)"
        >
          {{ key }}
        </button>

        <!-- Enter / Submit Button -->
        <button
          type="button"
          :disabled="disabled || !hasLetters"
          class="flex h-11 w-14 items-center justify-center rounded border border-neon-yellow bg-neon-yellow/25 font-display text-xs text-neon-yellow shadow-[0_0_10px_rgba(255,211,25,0.4)] transition active:scale-90 active:bg-neon-yellow active:text-black disabled:opacity-30"
          title="Valider le mot"
          @touchstart.prevent="pressSubmit"
          @click="pressSubmit"
        >
          <CyberIcon name="arrow-enter" sizeClass="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CyberIcon from '../ui/CyberIcon.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  hasLetters: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['key', 'backspace', 'submit', 'clear'])

const row1 = ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const row2 = ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M']
const row3 = ['W', 'X', 'C', 'V', 'B', 'N']

const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(10)
    } catch {
      // Ignore vibration error
    }
  }
}

const pressKey = (key) => {
  if (props.disabled) return
  triggerHaptic()
  emit('key', key)
}

const pressBackspace = () => {
  if (props.disabled || !props.hasLetters) return
  triggerHaptic()
  emit('backspace')
}

const pressSubmit = () => {
  if (props.disabled || !props.hasLetters) return
  triggerHaptic()
  emit('submit')
}
</script>
