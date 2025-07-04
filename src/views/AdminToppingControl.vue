<template>
    <div class="max-w-3xl mx-auto p-6 space-y-6">
      <h1 class="text-2xl font-bold text-center">🛠 Topping Availability</h1>
  
      <div v-for="(section, key) in toppingGroups" :key="key">
        <h2 class="text-xl font-semibold mt-6 mb-2">{{ section.label }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="topping in section.items"
            :key="topping.label"
            class="p-4 border rounded-lg shadow-sm bg-white flex flex-col items-center justify-center space-y-2"
          >
            <div class="text-4xl">{{ topping.icon }}</div>
            <div class="font-medium">{{ topping.label }}</div>
            <div class="text-sm text-gray-500">{{ topping.jp }}</div>
            <label class="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                v-model="topping.available"
                @change="updateAvailability(topping.label, topping.available)"
              />
              <span>{{ topping.available ? 'Available' : 'Unavailable' }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { db } from '@/firebase'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  
  const saltyToppings = [
    { label: 'Butter', jp: 'バター', icon: '🧈' },
    { label: 'Ham', jp: 'ハム', icon: '🥓' },
    { label: 'Cheese', jp: 'チーズ', icon: '🧀' },
    { label: 'Egg', jp: '卵', icon: '🥚' },
    { label: 'Mushroom', jp: 'きのこ', icon: '🍄' },
    { label: 'Onions', jp: '玉ねぎ', icon: '🧅' },
    { label: 'Creamed Leek', jp: 'ポロネギのクリーム煮', icon: '🌿' },
  ]
  
  const sweetToppings = [
    { label: 'Sugar', jp: '砂糖', icon: '🍬' },
    { label: 'Lemon Sugar', jp: 'レモンシュガー', icon: '🍋' },
    { label: 'Cinnamon Sugar', jp: 'シナモンシュガー', icon: '🧁' },
    { label: 'Butter Sugar', jp: 'バターシュガー', icon: '🧈' },
    { label: 'Nutella', jp: 'ヌテラ', icon: '🍫' },
    { label: 'Honey', jp: 'はちみつ', icon: '🍯',},
    
  ]
  
  const toppingGroups = ref({
    salty: { label: 'Salty Toppings', items: [...saltyToppings] },
    sweet: { label: 'Sweet Toppings', items: [...sweetToppings] },
  })
  
  const fetchAvailability = async () => {
    for (const group of Object.values(toppingGroups.value)) {
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
  