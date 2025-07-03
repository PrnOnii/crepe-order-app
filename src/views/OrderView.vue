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
import { reactive } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
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

const saltyToppings = [
  { label: 'Butter', jp: 'バター', icon: '🧈' },
  { label: 'Ham', jp: 'ハム', icon: '🥓' },
  { label: 'Cheese', jp: 'チーズ', icon: '🧀' },
  { label: 'Egg', jp: '卵', icon: '🥚' },
  { label: 'Mushroom', jp: 'きのこ', icon: '🍄' },
  { label: 'Onions', jp: '玉ねぎ', icon: '🧅' },
  { label: 'Creamed Leek', jp: 'ポロネギのクリーム煮', icon: '🌿' }
]

const sweetToppings = [
  { label: 'Sugar', jp: '砂糖', icon: '🍬' },
  { label: 'Lemon Sugar', jp: 'レモンシュガー', icon: '🍋' },
  { label: 'Cinnamon Sugar', jp: 'シナモンシュガー', icon: '🧁' },
  { label: 'Butter Sugar', jp: 'バターシュガー', icon: '🧈' },
  { label: 'Nutella', jp: 'ヌテラ', icon: '🍫' },
  { label: 'Honey', jp: 'はちみつ', icon: '🍯' }
]

const toggleTopping = (label) => {
  const index = order.toppings.indexOf(label)
  if (index >= 0) {
    order.toppings.splice(index, 1)
  } else {
    order.toppings.push(label)
  }
}

const submitOrder = async () => {
  try {
    const orderId = await getNextOrderId()

    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      orderId, // Human-readable number (e.g., 42)
      status: 'pending',
      archived: false,
      createdAt: serverTimestamp()
    })

    toast.success(`Order #${orderId} submitted!`)

    // Reset form
    order.name = ''
    order.toppings = []
    order.note = ''

    // Redirect to order status page using Firestore doc ID
    router.push({ name: 'CustomerOrder', params: { id: docRef.id } })

  } catch (e) {
    toast.error('Failed to send order')
    console.error(e)
  }
}
</script>
