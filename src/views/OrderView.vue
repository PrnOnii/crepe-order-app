<template>
  <div class="max-w-md mx-auto p-4 space-y-6">
    <h1 class="text-2xl font-bold text-center">🍓 Order Your Crêpe</h1>

    <!-- Base selection -->
    <div>
      <h2 class="font-semibold mb-1">Choose your base</h2>
      <select v-model="order.base" class="w-full border p-2 rounded">
        <option disabled value="">-- Select base --</option>
        <option>Sweet</option>
        <option>Salty</option>
      </select>
    </div>

    <!-- Toppings -->
    <div>
      <h2 class="font-semibold mb-1">Toppings</h2>
      <div class="flex flex-wrap gap-2">
        <label
          v-for="topping in toppingOptions"
          :key="topping"
          class="flex items-center gap-1 text-sm"
        >
          <input type="checkbox" v-model="order.toppings" :value="topping" />
          {{ topping }}
        </label>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <h2 class="font-semibold mb-1">Extra note</h2>
      <textarea
        v-model="order.note"
        class="w-full border p-2 rounded"
        rows="3"
        placeholder="Anything special?"
      ></textarea>
    </div>

    <!-- Submit -->
    <button
      @click="submitOrder"
      class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
    >
      Submit Order
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const order = reactive({
  base: '',
  toppings: [],
  note: ''
})

const toppingOptions = [
  'Nutella', 'Banana', 'Strawberry', 'Cheese',
  'Egg', 'Ham', 'Mushroom', 'Caramel', 'Whipped Cream'
]

const submitOrder = () => {
  console.log('ORDER:', { ...order })
  alert('Order submitted (console logged for now)!')
}
</script>
