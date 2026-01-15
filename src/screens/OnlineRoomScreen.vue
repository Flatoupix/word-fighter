<template>
  <section class="mx-auto w-full rounded-md border border-neon-pink/70 bg-black/40 p-3 py-6 backdrop-blur-sm sm:p-4 md:max-w-[36rem]">
    <button
      type="button"
      class="inline-flex items-center gap-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/60 hover:text-neon-yellow"
      @click="$emit('back')"
    >
      ← Back
    </button>

    <h2 class="text-center font-display text-xl tracking-wide text-neon-yellow sm:text-2xl">
      {{ titleLabel }}
    </h2>

    <p v-if="!supabaseReady" class="mt-3 text-center text-xs text-neon-yellow/70">
      Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable online mode.
    </p>

    <template v-else>
      <div v-if="step === 'landing'" class="mt-4 space-y-4">
        <button
          v-if="showCreate"
          type="button"
          class="w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40"
          @click="createRoom"
        >
          <span class="font-display text-xl text-neon-yellow">Create room</span>
        </button>
        <div v-if="showJoin" class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
          <label class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Join with code</label>
          <div class="mt-2 flex items-center gap-2">
            <input
              v-model="joinCode"
              type="text"
              class="w-full rounded-md border border-neon-pink/80 bg-black/30 px-3 py-2 font-ui text-xs text-neon-yellow placeholder:text-neon-yellow/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 sm:text-sm"
              placeholder="ROOM CODE"
            />
            <button
              type="button"
              class="rounded-md border border-neon-pink/70 bg-black/30 px-3 py-2 text-xs text-neon-yellow transition hover:border-neon-purple/80"
              @click="joinFromCode"
            >
              Join
            </button>
          </div>
        </div>
        <p v-if="errorMessage" class="text-xs text-neon-orange">{{ errorMessage }}</p>
      </div>

      <div v-else-if="step === 'name'" class="mt-4 space-y-4">
        <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
          <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Room</div>
          <div class="mt-1 font-display text-2xl text-neon-yellow">{{ roomId }}</div>
          <div class="mt-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Share link</div>
          <div class="mt-1 break-all text-xs text-neon-yellow/80">{{ shareLink }}</div>
        </div>
        <div>
          <label class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Your name</label>
          <input
            v-model="playerName"
            type="text"
            class="mt-2 w-full rounded-md border border-neon-pink/80 bg-black/30 px-3 py-2 font-ui text-xs text-neon-yellow placeholder:text-neon-yellow/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/60 sm:text-sm"
            placeholder="Player"
            @keydown.enter.prevent="joinRoom"
          />
        </div>
        <button
          type="button"
          class="w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canJoin"
          @click="joinRoom"
        >
          <span class="font-display text-xl text-neon-yellow">{{ isBusy ? 'Joining...' : 'Enter lobby' }}</span>
        </button>
        <p v-if="errorMessage" class="text-xs text-neon-orange">{{ errorMessage }}</p>
      </div>

      <div v-else class="mt-4 space-y-4">
        <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3 text-center">
          <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Room</div>
          <div class="font-display text-2xl text-neon-yellow">{{ roomId }}</div>
          <div class="mt-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Share link</div>
          <div class="mt-1 break-all text-xs text-neon-yellow/80">{{ shareLink }}</div>
        </div>

        <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
          <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Players</div>
          <ul class="mt-2 space-y-1 text-sm text-neon-yellow">
            <li v-for="player in players" :key="player.player_id">
              {{ player.name }}<span v-if="player.is_host"> (host)</span>
            </li>
          </ul>
          <div class="mt-2 text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">
            Slots: {{ players.length }}/8
          </div>
        </div>

        <div class="rounded-md border border-neon-pink/60 bg-black/30 p-3">
          <div class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Settings</div>
          <div class="mt-2 text-xs text-neon-yellow/80">
            Game: {{ settingsLabel }}
          </div>
          <div v-if="roomSettings.tag" class="mt-1 text-xs text-neon-yellow/80">
            Tag: {{ roomSettings.tag }}
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-[10px] font-ui uppercase tracking-wide text-neon-yellow/50">Duration</span>
            <select
              v-model.number="duration"
              class="rounded-md border border-neon-pink/70 bg-black/30 px-2 py-1 text-xs text-neon-yellow"
              :disabled="!isHost"
            >
              <option v-for="opt in durationOptions" :key="opt" :value="opt">{{ opt }} min</option>
            </select>
          </div>
        </div>

        <button
          v-if="isHost"
          type="button"
          class="w-full rounded-md border border-neon-pink/70 bg-black/30 px-4 py-3 text-center transition hover:border-neon-purple/80 hover:bg-black/40"
          :disabled="players.length === 0"
          @click="startRoom"
        >
          <span class="font-display text-xl text-neon-yellow">Start</span>
        </button>
        <div v-else class="text-center text-xs text-neon-yellow/70">Waiting for host to start…</div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { generateRoomCode } from '../lib/roomCode'

const props = defineProps({
  gameType: {
    type: String,
    required: true,
  },
  grammarTag: {
    type: String,
    required: true,
  },
  entryMode: {
    type: String,
    default: 'full',
  },
})

const emit = defineEmits(['start', 'syncSettings', 'syncPlayers', 'syncRoom', 'back'])

const supabaseReady = Boolean(supabase)
const roomId = ref('')
const roomSettings = ref({ gameType: '', tag: '', duration: 1, turnIndex: 0, state: null })
const players = ref([])
const nameStorageKey = 'wf_player_name'
const loadPlayerName = () => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(nameStorageKey) || ''
}
const savePlayerName = (name) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(nameStorageKey, name)
}
const playerName = ref(loadPlayerName())
const joinCode = ref('')
const errorMessage = ref('')
const step = ref('landing')
const isHost = ref(false)
const duration = ref(1)
const isBusy = ref(false)
const durationOptions = [1, 3, 5]
let roomChannel = null
let playersChannel = null
let pollId = null
let durationUpdateId = null

const settingsLabel = computed(() => {
  if (roomSettings.value.gameType === 'grammar-war') return 'Grammar War'
  if (roomSettings.value.gameType === 'kamoulox') return 'Kamoulox'
  return 'Word Fight'
})

const titleLabel = computed(() => {
  if (props.entryMode === 'join') return 'Rejoindre une partie'
  if (props.entryMode === 'create') return 'Creer une partie'
  return 'Online Lobby'
})
const showCreate = computed(() => props.entryMode !== 'join')
const showJoin = computed(() => props.entryMode !== 'create')

const shareLink = computed(() => {
  if (!roomId.value) return ''
  return `${window.location.origin}${window.location.pathname}?room=${roomId.value}`
})
const trimmedName = computed(() => playerName.value.trim())
const canJoin = computed(() => Boolean(trimmedName.value) && !isBusy.value)

const getPlayerId = (code = roomId.value) => {
  const key = code ? `wf_player_id_${code}` : 'wf_player_id'
  const storage = window.sessionStorage
  const existing = storage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID()
  storage.setItem(key, id)
  return id
}

const setRoomParam = (code) => {
  const url = new URL(window.location.href)
  url.searchParams.set('room', code)
  window.history.replaceState({}, '', url.toString())
}

const fetchRoom = async () => {
  if (!supabaseReady || !roomId.value) return
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId.value).single()
  if (error) {
    errorMessage.value = 'Room not found.'
    step.value = 'landing'
    return
  }
  roomSettings.value = {
    gameType: data.settings?.gameType || 'word-fight',
    tag: data.settings?.tag || '',
    duration: data.settings?.duration || 1,
    turnIndex: data.settings?.turnIndex ?? 0,
    state: data.settings?.state || null,
  }
  isHost.value = data.host_id === getPlayerId()
  duration.value = roomSettings.value.duration
  emit('syncSettings', roomSettings.value)
  if (data.status === 'started') {
    emit('start', { duration: roomSettings.value.duration })
  }
}

const fetchPlayers = async () => {
  if (!supabaseReady || !roomId.value) return
  const { data } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', roomId.value)
    .order('joined_at', { ascending: true })
  players.value = data || []
  emit('syncPlayers', players.value)
}

const subscribeRoom = () => {
  if (!supabaseReady || !roomId.value) return
  roomChannel = supabase
    .channel(`room-${roomId.value}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId.value}` },
      (payload) => {
        const data = payload.new
        roomSettings.value = {
          gameType: data.settings?.gameType || 'word-fight',
          tag: data.settings?.tag || '',
          duration: data.settings?.duration || 1,
          turnIndex: data.settings?.turnIndex ?? 0,
          state: data.settings?.state || null,
        }
        duration.value = roomSettings.value.duration
        emit('syncSettings', roomSettings.value)
        if (data.status === 'started') {
          emit('start', { duration: roomSettings.value.duration })
        }
      }
    )
    .subscribe()
}

const subscribePlayers = () => {
  if (!supabaseReady || !roomId.value) return
  playersChannel = supabase
    .channel(`players-${roomId.value}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId.value}` },
      () => {
        fetchPlayers()
      }
    )
    .subscribe()
}

const startPolling = () => {
  if (pollId || !supabaseReady || !roomId.value) return
  pollId = setInterval(() => {
    fetchRoom()
    fetchPlayers()
  }, 3000)
}

const stopPolling = () => {
  if (!pollId) return
  clearInterval(pollId)
  pollId = null
}

const createRoom = async () => {
  errorMessage.value = ''
  if (!supabaseReady) return
  const code = generateRoomCode()
  const hostId = getPlayerId(code)
  const settings = {
    gameType: props.gameType || 'word-fight',
    tag: props.grammarTag || '',
    duration: duration.value,
    turnIndex: 0,
    state: { words: [], normalized: [], scores: {} },
  }
  const { error } = await supabase.from('rooms').insert({
    id: code,
    host_id: hostId,
    status: 'lobby',
    settings,
  })
  if (error) {
    errorMessage.value = 'Unable to create room.'
    return
  }
  roomId.value = code
  isHost.value = true
  emit('syncRoom', { roomId: code, playerId: hostId })
  setRoomParam(code)
  step.value = 'name'
  await fetchRoom()
}

const joinFromCode = async () => {
  if (!joinCode.value) return
  roomId.value = joinCode.value.trim().toUpperCase()
  setRoomParam(roomId.value)
  step.value = 'name'
  await fetchRoom()
}

const joinRoom = async () => {
  errorMessage.value = ''
  if (!supabaseReady || !roomId.value) return
  if (!trimmedName.value) {
    errorMessage.value = 'Enter your name to join.'
    return
  }
  if (isBusy.value) return
  isBusy.value = true
  await fetchPlayers()
  if (players.value.length >= 8) {
    errorMessage.value = 'Room is full.'
    isBusy.value = false
    return
  }
  const playerId = getPlayerId(roomId.value)
  const name = trimmedName.value
  savePlayerName(name)
  const { error } = await supabase.from('players').upsert(
    {
      room_id: roomId.value,
      player_id: playerId,
      name,
      is_host: isHost.value,
    },
    { onConflict: 'room_id,player_id' }
  )
  if (error) {
    errorMessage.value = 'Unable to join room.'
    isBusy.value = false
    return
  }
  emit('syncRoom', { roomId: roomId.value, playerId })
  step.value = 'lobby'
  await fetchPlayers()
  subscribeRoom()
  subscribePlayers()
  startPolling()
  isBusy.value = false
}

const startRoom = async () => {
  if (!supabaseReady || !roomId.value) return
  const settings = {
    gameType: roomSettings.value.gameType,
    tag: roomSettings.value.tag,
    duration: duration.value,
    turnIndex: roomSettings.value.turnIndex ?? 0,
    state: roomSettings.value.state || { words: [], normalized: [], scores: {} },
  }
  await supabase
    .from('rooms')
    .update({ status: 'started', settings })
    .eq('id', roomId.value)
}

onMounted(async () => {
  if (!supabaseReady) return
  const params = new URLSearchParams(window.location.search)
  const roomParam = params.get('room')
  if (roomParam) {
    roomId.value = roomParam.toUpperCase()
    step.value = 'name'
    await fetchRoom()
  }
})

watch(
  () => duration.value,
  (next) => {
    if (!supabaseReady || !roomId.value || !isHost.value || step.value !== 'lobby') return
    if (next === roomSettings.value.duration) return
    if (durationUpdateId) {
      clearTimeout(durationUpdateId)
    }
    durationUpdateId = setTimeout(async () => {
      await supabase
        .from('rooms')
        .update({ settings: { ...roomSettings.value, duration: next } })
        .eq('id', roomId.value)
    }, 200)
  }
)

onBeforeUnmount(() => {
  if (roomChannel) {
    supabase.removeChannel(roomChannel)
  }
  if (playersChannel) {
    supabase.removeChannel(playersChannel)
  }
  stopPolling()
  if (durationUpdateId) {
    clearTimeout(durationUpdateId)
  }
})
</script>
