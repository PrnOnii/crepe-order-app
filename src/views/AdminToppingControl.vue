<template>
    <div class="max-w-3xl mx-auto p-6 space-y-6">
      <h1 class="text-2xl font-bold text-center">🛠 Topping Availability</h1>

      <ToppingSections
        :groups="toppingGroups"
        titleClass="text-xl font-semibold mt-6 mb-2"
        gridClass="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <template #item="{ topping }">
          <div
            class="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center justify-center space-y-2"
          >
            <div class="text-4xl">{{ topping.icon }}</div>
            <div class="font-medium">{{ topping.label }}</div>
            <div class="text-sm text-gray-500 whitespace-pre-line">{{ topping.jp }}</div>
            <label class="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                v-model="topping.available"
                @change="updateAvailability(topping.label, topping.available)"
              />
              <span>{{ topping.available ? 'Available' : 'Unavailable' }}</span>
            </label>
          </div>
        </template>
      </ToppingSections>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { db } from '@/firebase'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import ToppingSections from '@/components/ToppingSections.vue'
  import { createToppingGroups } from '@/constants/toppings'
  
  const toppingGroups = ref(createToppingGroups())
  
  const fetchAvailability = async () => {
    for (const group of toppingGroups.value) {
      for (const topping of group.items) {
        const docRef = doc(db, 'toppingStatus', topping.label)
        const snap = await getDoc(docRef)
        topping.available = snap.exists() ? snap.data().available : true
      }
    }
  }
  
  const updateAvailability = async (label, value) => {
    const docRef = doc(db, 'toppingStatus', label)
    await setDoc(docRef, { available: value })
  }
  
  onMounted(fetchAvailability)
  </script>
  
  <style scoped>
  input[type="checkbox"] {
    transform: scale(1.3);
  }
  </style>
  