<template>
  <ScreenShell
    title="Nom du joueur"
    :showBack="true"
    paddingClass="p-3 sm:p-4"
    maxWidthClass="md:max-w-[33vw]"
    @back="$emit('back')"
  >
    <div class="mt-4">
      <label class="text-[9px] font-ui uppercase tracking-wide text-neon-yellow/50 sm:text-[10px]">
        {{ stepLabel }}
      </label>
      <input
        v-model="currentName"
        type="text"
        class="mt-1 w-full rounded-md border border-neon-pink/80 bg-black/30 px-3 py-2 font-ui text-xs text-neon-yellow placeholder:text-neon-yellow/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 sm:text-sm"
        :placeholder="stepPlaceholder"
        @keydown.enter.prevent="onConfirm"
      />
    </div>
    <PrimaryButton class="mt-5" @click="onConfirm">
      <span class="font-display text-lg text-neon-yellow sm:text-xl">{{ buttonLabel }}</span>
    </PrimaryButton>
  </ScreenShell>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PrimaryButton from '../components/ui/PrimaryButton.vue'
import ScreenShell from '../components/ui/ScreenShell.vue'

const props = defineProps({
  playerOneName: {
    type: String,
    required: true,
  },
  playerTwoName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'back'])

const localPlayerOne = ref(props.playerOneName)
const localPlayerTwo = ref(props.playerTwoName)
const step = ref(1)
const currentName = ref(localPlayerOne.value)

const stepLabel = computed(() => (step.value === 1 ? 'Joueur 1' : 'Joueur 2'))
const stepPlaceholder = computed(() => (step.value === 1 ? 'Player 1' : 'Player 2'))
const buttonLabel = computed(() => (step.value === 1 ? 'Suivant' : 'Continuer'))

watch(
  () => props.playerOneName,
  (value) => {
    localPlayerOne.value = value
    if (step.value === 1) {
      currentName.value = value
    }
  }
)

watch(
  () => props.playerTwoName,
  (value) => {
    localPlayerTwo.value = value
    if (step.value === 2) {
      currentName.value = value
    }
  }
)

const onConfirm = () => {
  if (step.value === 1) {
    localPlayerOne.value = currentName.value.trim() || 'Player 1'
    step.value = 2
    currentName.value = localPlayerTwo.value
    return
  }
  localPlayerTwo.value = currentName.value.trim() || 'Player 2'
  emit('confirm', { playerOne: localPlayerOne.value, playerTwo: localPlayerTwo.value })
}
</script>
