<template>
  <div :class="['inline-flex items-center justify-center shrink-0 select-none', sizeClass]">
    <!-- Glitch-01 (Novice) -->
    <svg
      v-if="avatarId === 'glitch'"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-full w-full drop-shadow-[0_0_8px_rgba(40,240,255,0.7)]"
    >
      <rect x="8" y="14" width="32" height="26" rx="6" fill="#0b0616" stroke="#28f0ff" stroke-width="2.5" />
      <!-- Antennas -->
      <line x1="24" y1="14" x2="24" y2="6" stroke="#28f0ff" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="24" cy="5" r="3" fill="#ffd319" />
      <!-- Pixel Glitch Eyes -->
      <rect x="14" y="21" width="6" height="6" rx="1" fill="#28f0ff" />
      <rect x="28" y="21" width="6" height="6" rx="1" fill="#28f0ff" />
      <rect x="16" y="23" width="2" height="2" fill="#0b0616" />
      <rect x="30" y="23" width="2" height="2" fill="#0b0616" />
      <!-- Glitch Mouth Bar -->
      <line x1="16" y1="33" x2="32" y2="33" stroke="#ff2975" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 2" />
      <!-- Cheek nodes -->
      <circle cx="11" cy="27" r="1.5" fill="#ffd319" />
      <circle cx="37" cy="27" r="1.5" fill="#ffd319" />
    </svg>

    <!-- Neo-Hacker (Medium) -->
    <svg
      v-else-if="avatarId === 'hacker'"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-full w-full drop-shadow-[0_0_8px_rgba(140,30,255,0.8)]"
    >
      <!-- Angular Head -->
      <polygon points="12,12 36,12 40,28 32,42 16,42 8,28" fill="#0b0616" stroke="#8c1eff" stroke-width="2.5" />
      <!-- Visor -->
      <polygon points="11,20 37,20 36,27 12,27" fill="#ff901f" stroke="#ffd319" stroke-width="1.5" />
      <!-- Glowing Scanline -->
      <line x1="14" y1="23.5" x2="34" y2="23.5" stroke="#ffffff" stroke-width="1" />
      <!-- Cyber Circuit Lines -->
      <path d="M16 34 L20 38 L28 38 L32 34" stroke="#8c1eff" stroke-width="2" stroke-linecap="round" fill="none" />
      <circle cx="24" cy="38" r="1.5" fill="#28f0ff" />
      <!-- Side Ear nodes -->
      <rect x="4" y="22" width="4" height="8" rx="2" fill="#8c1eff" />
      <rect x="40" y="22" width="4" height="8" rx="2" fill="#8c1eff" />
    </svg>

    <!-- Cyber-Titan (Expert) -->
    <svg
      v-else
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-full w-full drop-shadow-[0_0_10px_rgba(255,41,117,0.8)]"
    >
      <!-- Heavy Helm / Horns -->
      <polygon points="6,6 14,14 10,22 4,14" fill="#ff2975" opacity="0.8" />
      <polygon points="42,6 34,14 38,22 44,14" fill="#ff2975" opacity="0.8" />
      <!-- Angular Face Frame -->
      <polygon points="12,12 36,12 42,26 36,44 12,44 6,26" fill="#0b0616" stroke="#ff2975" stroke-width="2.5" />
      <!-- Menacing Glowing Eyes -->
      <polygon points="13,22 21,25 20,28 14,26" fill="#ffd319" />
      <polygon points="35,22 27,25 28,28 34,26" fill="#ffd319" />
      <!-- Core Reactor Mouth -->
      <polygon points="24,32 30,38 18,38" fill="#ff2975" stroke="#ffd319" stroke-width="1.5" />
      <circle cx="24" cy="36" r="2" fill="#ffffff" />
      <!-- Crown Top -->
      <line x1="20" y1="12" x2="28" y2="12" stroke="#ffd319" stroke-width="2" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  avatarId: {
    type: String,
    default: 'glitch',
  },
  sizeClass: {
    type: String,
    default: 'w-10 h-10',
  },
})
</script>
