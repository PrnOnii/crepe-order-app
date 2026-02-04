<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
      🥞 Order a Crêpe
    </h1>
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
      <input
        v-model="order.name"
        type="text"
        id="name"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        placeholder="e.g. Daisuke, Andy..."
      />
    </div>

    <!-- Salty Toppings -->
    <div>
      <h2 class="font-semibold mb-2">Salty Toppings</h2>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
        <ToppingIcon
          v-for="topping in saltyToppings"
          :key="topping.label"
          :label="topping.label"
          :jpLabel="topping.jp"
          :icon="topping.icon"
          :selected="order.toppings.includes(topping.label)"
          :disabled="!topping.available"
          :note="!topping.available ? 'Unavailable / 品切れ' : ''"
          :dimmed="!topping.available"
          @toggle="toggleTopping(topping.label)"
        />
      </div>
    </div>

    <!-- Sweet Toppings -->
    <div>
      <h2 class="font-semibold mb-2">Sweet Toppings</h2>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
        <ToppingIcon
          v-for="topping in sweetToppings"
          :key="topping.label"
          :label="topping.label"
          :jpLabel="topping.jp"
          :icon="topping.icon"
          :selected="order.toppings.includes(topping.label)"
          :disabled="!topping.available"
          :note="!topping.available ? 'Unavailable / 品切れ' : ''"
          :dimmed="!topping.available"
          @toggle="toggleTopping(topping.label)"
        />
      </div>
    </div>

    <!-- Note Field -->
    <textarea
      v-model="order.note"
      placeholder="Any note for the chef?"
      class="w-full border rounded-lg p-3 text-sm resize-none"
      rows="3"
    ></textarea>

    <!-- Submit Button -->
    <button
      @click="submitOrder"
      :disabled="!order.name"
      class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Submit Order
    </button>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'
import ToppingIcon from '@/components/ToppingIcon.vue'
import { useToast } from 'vue-toastification'
import { getNextOrderId } from '@/utils/orderCounter'

const toast = useToast()
const router = useRouter()

const order = reactive({
  name: '',
  toppings: [],
  note: ''
})

const saltyToppings = reactive([
  { label: 'Butter', jp: 'バター', icon: '🧈', available: true },
  { label: 'Ham', jp: 'ハム', icon: '🥓', available: true },
  { label: 'Cheese', jp: 'チーズ', icon: '🧀', available: true },
  { label: 'Egg', jp: '卵', icon: '🥚', available: true },
  { label: 'Mushroom', jp: 'きのこ', icon: '🍄', available: true },
  { label: 'Onions', jp: '玉ねぎ', icon: '🧅', available: true },
  { label: 'Creamed Leek', jp: 'ポロネギのクリーム煮', icon: '🌿', available: true }
])

const sweetToppings = reactive([
  { label: 'Sugar', jp: '砂糖', icon: '🍬', available: true },
  { label: 'Lemon Sugar', jp: 'レモンシュガー', icon: '🍋', available: true },
  { label: 'Cinnamon Sugar', jp: 'シナモンシュガー', icon: '🧁', available: true },
  { label: 'Butter Sugar', jp: 'バターシュガー', icon: '🧈', available: true },
  { label: 'Nutella', jp: 'ヌテラ', icon: '🍫', available: true },
  { label: 'Honey', jp: 'はちみつ', icon: '🍯', available: true },
  { label: 'Apple', jp: 'りんご', icon: '🍎'}
])

const toggleTopping = (label) => {
  const topping = [...saltyToppings, ...sweetToppings].find(t => t.label === label)
  if (!topping?.available) return

  if (order.toppings.includes(label)) {
    order.toppings = order.toppings.filter(t => t !== label)
  } else {
    order.toppings.push(label)
  }
}

const fetchToppingAvailability = async () => {
  const all = [...saltyToppings, ...sweetToppings]
  for (const topping of all) {
    const ref = doc(db, 'toppingStatus', topping.label)
    const snap = await getDoc(ref)
    topping.available = snap.exists() ? snap.data().available : true
  }
}

const submitOrder = async () => {
  try {
    const unavailable = []
    for (const label of order.toppings) {
      const ref = doc(db, 'toppingStatus', label)
      const snap = await getDoc(ref)
      const isAvailable = snap.exists() ? snap.data().available : true
      if (!isAvailable) {
        unavailable.push(label)
      }
    }

    if (unavailable.length > 0) {
      for (const label of unavailable) {
        toast.error(`Sorry, ${label} is no longer available.`)

        order.toppings = order.toppings.filter(t => t !== label)

        const allToppings = [...saltyToppings, ...sweetToppings]
        const match = allToppings.find(t => t.label === label)
        if (match) match.available = false
      }
      return
    }

    const orderId = await getNextOrderId()

    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      orderId,
      status: 'pending',
      archived: false,
      createdAt: serverTimestamp()
    })

    toast.success(`Order #${orderId} submitted!`)

    order.name = ''
    order.toppings = []
    order.note = ''

    router.push({
      name: 'CustomerOrder',
      params: { id: docRef.id },
      query: { view: 'customer' }
    })
  } catch (e) {
    toast.error('Failed to send order')
    console.error(e)
  }
}
onMounted(fetchToppingAvailability)
</script>
