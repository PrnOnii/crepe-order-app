<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 p-4">
    <h1 class="text-2xl font-bold text-center mb-6">Order Queue</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- In Progress Orders -->
      <div>
        <h2 class="text-xl font-semibold mb-2">🕒 Being Prepared</h2>
        <transition-group name="fade" tag="div" class="grid grid-cols-3 gap-2">
          <div
            v-for="order in inProgressOrders"
            :key="order.id"
            class="bg-yellow-200 text-yellow-800 font-bold text-center rounded-lg py-6 text-xl shadow"
          >
            #{{ order.orderId }}
          </div>
        </transition-group>
      </div>

      <!-- Done Orders -->
      <div>
        <h2 class="text-xl font-semibold mb-2">✅ Ready for Pickup</h2>
        <transition-group name="pop" tag="div" class="grid grid-cols-3 gap-2">
          <div
            v-for="order in doneOrders"
            :key="order.id"
            class="bg-green-200 text-green-800 font-bold text-center rounded-lg py-6 text-xl shadow"
          >
            #{{ order.orderId }}
          </div>
        </transition-group>
      </div>
    </div>
  </div>
  <div class="fixed bottom-6 right-6 bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-6 z-50">
    <p class="text-3xl font-bold text-center leading-snug">
      Scan to order<br />
      <span class="text-xl text-gray-700 font-medium">クレープを注文しよう！</span>
    </p>
    <img
      src="@/assets/frame.png"
      alt="QR code"
      class="w-96 h-96 object-contain"
    />
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { db } from '@/firebase'
  import { collection, query, where, onSnapshot } from 'firebase/firestore'
  
  const inProgressOrders = ref([])
  const doneOrders = ref([])
  
  let lastAnnounced = new Set()
let speaking = false

const speak = (orderId, delay = false) => {
  if (speaking || lastAnnounced.has(orderId)) return

  const run = () => {
    speechSynthesis.cancel()

    const voices = speechSynthesis.getVoices()
    const jpVoice = voices.find(v => v.lang === 'ja-JP' && v.name.includes('Google'))

    const message = `ご注文番号、… ${orderId}、… 番のお客様、商品ができあがりました。カウンターまでお越しください。`

    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.9
    utterance.pitch = 1
    if (jpVoice) utterance.voice = jpVoice

    speaking = true
    utterance.onend = () => {
      speaking = false
      lastAnnounced.add(orderId)
    }

    speechSynthesis.speak(utterance)
  }

  if (delay) {
    setTimeout(run, 500) // half-second delay on initial load
  } else {
    run()
  }
}
  
  onMounted(() => {
    const q = query(collection(db, 'orders'), where('archived', '==', false))
    onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
      inProgressOrders.value = orders.filter(o => o.status === 'in-progress' || o.status === 'pending')
      doneOrders.value = orders.filter(o => o.status === 'done')
  
      doneOrders.value.forEach(order => {
        if (order.orderId && !lastAnnounced.has(order.orderId)) {
          speak(order.orderId)
          lastAnnounced.add(order.orderId)
        }
      })
    })
  })
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active,
  .pop-enter-active,
  .pop-leave-active {
    transition: all 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to,
  .pop-enter-from,
  .pop-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>