<template>
    <div class="max-w-md mx-auto p-4">
      <h1 class="text-2xl font-bold text-center mb-6">Check Your Order</h1>
  
      <div class="mb-4">
        <input
          v-model="input"
          type="text"
          placeholder="Enter your order number"
          class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
  
      <button
        @click="fetchOrderByInput"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Check Status
      </button>
  
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
  let unsubscribe = null
  
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
      if (newId) setupRealtimeOrderListener(newId)
    },
    { immediate: true }
  )
  
  onMounted(() => {
    const id = route.params.id
    if (id) {
      input.value = id
      setupRealtimeOrderListener(id)
    }
  })
  
  onBeforeUnmount(() => {
    if (unsubscribe) unsubscribe()
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

  watch(() => order.value?.status, (newStatus) => {
  if (newStatus === 'done') {
    showReadyOverlay.value = true
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }
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
  