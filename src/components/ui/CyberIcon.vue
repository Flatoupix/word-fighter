<template>
  <span :class="['inline-flex items-center justify-center shrink-0 select-none align-middle', sizeClass]">
    <!-- Sound On -->
    <svg
      v-if="name === 'sound-on'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.2" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>

    <!-- Sound Off -->
    <svg
      v-else-if="name === 'sound-off'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.2" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>

    <!-- Solo / Lightning Rush -->
    <svg
      v-else-if="name === 'solo'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.2" />
    </svg>

    <!-- Duel / Robot Helmet -->
    <svg
      v-else-if="name === 'duel'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" fill="currentColor" fill-opacity="0.2" />
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8.01" y2="16" stroke-width="3" />
      <line x1="16" y1="16" x2="16.01" y2="16" stroke-width="3" />
    </svg>

    <!-- Flame / Fever Energy -->
    <svg
      v-else-if="name === 'flame'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor" fill-opacity="0.2" />
    </svg>

    <!-- Palindrome / Mirror Rune -->
    <svg
      v-else-if="name === 'palindrome'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polyline points="7 8 3 12 7 16" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="12" y1="4" x2="12" y2="20" stroke-dasharray="2 2" />
    </svg>

    <!-- Anagram / Cycle Rune -->
    <svg
      v-else-if="name === 'anagram'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <polyline points="3 3 3 8 8 8" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <polyline points="16 16 21 16 21 21" />
    </svg>

    <!-- Super Suite / Ascending Steps -->
    <svg
      v-else-if="name === 'suite'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>

    <!-- Super Shrink / Delta Brackets -->
    <svg
      v-else-if="name === 'shrink'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>

    <!-- Trophy / Victory Crown -->
    <svg
      v-else-if="name === 'trophy'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" fill="currentColor" fill-opacity="0.2" />
    </svg>

    <!-- Defeat / Glitch Skull -->
    <svg
      v-else-if="name === 'defeat'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <path d="M8 20v2h8v-2" />
      <path d="M12.5 17l-.5-1-.5 1" />
      <path d="M16 20a3 3 0 0 0 3-3V11a7 7 0 0 0-14 0v6a3 3 0 0 0 3 3" />
    </svg>

    <!-- Clock / Timer -->
    <svg
      v-else-if="name === 'clock'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>

    <!-- Swords / Crosshairs -->
    <svg
      v-else-if="name === 'swords'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <line x1="14.5" y1="17.5" x2="3" y2="6" />
      <line x1="21" y1="3" x2="9.5" y2="14.5" />
      <line x1="3" y1="18" x2="6" y2="21" />
      <line x1="6" y1="18" x2="3" y2="21" />
      <line x1="18" y1="3" x2="21" y2="6" />
    </svg>

    <!-- Target / Enter Arena -->
    <svg
      v-else-if="name === 'target'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>

    <!-- Checkmark -->
    <svg
      v-else-if="name === 'check'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>

    <!-- Cross -->
    <svg
      v-else-if="name === 'cross'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>

    <!-- Enter Arrow -->
    <svg
      v-else-if="name === 'arrow-enter'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-full w-full"
    >
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  sizeClass: {
    type: String,
    default: 'w-4 h-4',
  },
})
</script>
