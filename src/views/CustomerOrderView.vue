<template>
    <div class="max-w-md mx-auto p-4">
      <h1 class="text-2xl font-bold text-center mb-6">Check Your Order</h1>
  
      <div class="relative mt-6">
        <transition name="fade" mode="out-in">
          <div
            v-if="order"
            :key="order.status"
            class="p-4 bg-white shadow-md rounded-lg space-y-2 relative z-10"
          >
            <h2 class="text-lg font-semibold">Order #{{ order.orderId }}</h2>
            <p><strong>Name:</strong> {{ order.name }}</p>
            <p><strong>Status:</strong>
              <span
                :class="[
                  'font-semibold',
                  {
                    'text-yellow-600': order.status === 'pending',
                    'text-blue-600': order.status === 'in-progress',
                    'text-green-600': order.status === 'done'
                  }
                ]"
              >
                {{ readableStatus(order.status) }}
              </span>
            </p>
            <p><strong>Toppings:</strong> {{ order.toppings?.join(', ') }}</p>
            <p v-if="order.note"><strong>Note:</strong> {{ order.note }}</p>
          </div>
  
          <div
            v-else-if="notFound"
            key="not-found"
            class="text-red-500 text-center"
          >
            Order not found.
          </div>
        </transition>
      </div>

      <div v-if="order && order.status === 'done' && !showReadyOverlay" class="mt-4 text-center">
        <router-link
          :to="{ path: '/order', query: { view: 'customer' } }"
          class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Order another crêpe?
        </router-link>
      </div>
  
      <!-- READY OVERLAY -->
      <transition name="fade-scale">
        <div
            v-if="showReadyOverlay"
            @click="showReadyOverlay = false"
            class="fixed inset-0 bg-green-600/90 flex flex-col items-center justify-center z-50 text-white text-center p-6 cursor-pointer"
        >
            <div class="text-6xl animate-bounce">✅</div>
            <h2 class="text-3xl font-bold mt-4">Your crêpe is ready!</h2>
            <p class="mt-2 text-lg">Order #{{ order.orderId }}</p>
            <p class="mt-1 text-sm opacity-75">(Tap anywhere to close)</p>
        </div>
        </transition>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import { db } from '@/firebase'
  import { doc, onSnapshot } from 'firebase/firestore'
  
  const route = useRoute()
  const input = ref('')
  const order = ref(null)
  const showReadyOverlay = ref(false)
  const notFound = ref(false)
  const hasReadyAlertFired = ref(false)
  let unsubscribe = null
  let audioContext = null
  let removeAudioUnlockListeners = null

  const getReadyAlertStorageKey = (docId) => `ready-alerted:${docId}`

  const loadReadyAlertState = (docId) => {
    if (!docId) {
      hasReadyAlertFired.value = false
      return
    }

    hasReadyAlertFired.value = sessionStorage.getItem(getReadyAlertStorageKey(docId)) === '1'
  }

  const markReadyAlertAsFired = (docId) => {
    if (!docId) return
    sessionStorage.setItem(getReadyAlertStorageKey(docId), '1')
    hasReadyAlertFired.value = true
  }

  const getAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null

    if (!audioContext) {
      audioContext = new AudioContextClass()
    }

    return audioContext
  }

  const ensureAudioUnlocked = async () => {
    const context = getAudioContext()
    if (!context) return false

    if (context.state === 'suspended') {
      try {
        await context.resume()
      } catch {
        return false
      }
    }

    return context.state === 'running'
  }

  const setupAudioUnlockListeners = () => {
    const events = ['touchstart', 'pointerdown', 'click', 'keydown']

    const tryUnlock = async () => {
      const isUnlocked = await ensureAudioUnlocked()
      if (!isUnlocked || !removeAudioUnlockListeners) return

      removeAudioUnlockListeners()
      removeAudioUnlockListeners = null
    }

    events.forEach((eventName) => {
      window.addEventListener(eventName, tryUnlock, { passive: true })
    })

    removeAudioUnlockListeners = () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, tryUnlock)
      })
    }
  }

  const playReadyJingle = async () => {
    const context = getAudioContext()
    if (!context) return

    const isUnlocked = await ensureAudioUnlocked()
    if (!isUnlocked) return

    const notes = [
      { frequency: 659.25, duration: 0.1 }, // E5
      { frequency: 783.99, duration: 0.12 }, // G5
      { frequency: 1046.5, duration: 0.18 }, // C6
    ]

    let currentTime = context.currentTime

    notes.forEach(({ frequency, duration }) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, currentTime)

      gain.gain.setValueAtTime(0.0001, currentTime)
      gain.gain.exponentialRampToValueAtTime(0.14, currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration)

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + duration + 0.02)

      currentTime += duration + 0.03
    })
  }

  const triggerReadyNotification = async () => {
    showReadyOverlay.value = true

    if ('vibrate' in navigator) {
      navigator.vibrate([220, 100, 220])
    }

    await playReadyJingle()
  }
  
  const setupRealtimeOrderListener = (docId) => {
    if (unsubscribe) unsubscribe()
    order.value = null
    notFound.value = false
  
    if (!docId) return
  
    const refDoc = doc(db, 'orders', docId)
    unsubscribe = onSnapshot(refDoc, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        order.value = { ...data, orderId: data.orderId }
        notFound.value = false
      } else {
        order.value = null
        notFound.value = true
      }
    })
  }
  
  watch(
    () => route.params.id,
    (newId) => {
      input.value = newId || ''
      loadReadyAlertState(newId)
      if (newId) setupRealtimeOrderListener(newId)
    },
    { immediate: true }
  )
  
  onMounted(() => {
    setupAudioUnlockListeners()

    const id = route.params.id
    if (id) {
      input.value = id
      loadReadyAlertState(id)
      setupRealtimeOrderListener(id)
    }
  })
  
  onBeforeUnmount(() => {
    if (unsubscribe) unsubscribe()
    if (removeAudioUnlockListeners) removeAudioUnlockListeners()
  })
  
  const fetchOrderByInput = async () => {
    if (input.value.trim()) {
      setupRealtimeOrderListener(input.value)
    }
  }
  
  const readableStatus = (status) => {
    switch (status) {
      case 'pending': return '🕒 Pending'
      case 'in-progress': return '🔄 In Progress'
      case 'done': return '✅ Ready'
      default: return status
    }
  }

  watch(() => order.value?.status, async (newStatus, oldStatus) => {
    if (newStatus !== 'done') return

    const docId = route.params.id
    const becameDone = oldStatus !== 'done'

    if (!becameDone || hasReadyAlertFired.value) return

    await triggerReadyNotification()
    markReadyAlertAsFired(docId)
  })
  </script>
  
  <style scoped>
  input::placeholder {
    color: #999;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  .fade-enter-active,
.fade-leave-active,
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to,
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.animate-bounce {
  animation: bounce 1.2s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
  </style>
  