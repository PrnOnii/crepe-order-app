<template>
    <div class="max-w-3xl mx-auto p-6 space-y-6">
      <h1 class="text-2xl font-bold text-center">📦 Export Orders</h1>
      <p class="text-center text-gray-600">Click the button below to export all orders as a JSON file.</p>
  
      <div class="flex justify-center">
        <button
          @click="exportOrdersAsJSON"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
        >
          Download orders.json
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { collection, getDocs } from 'firebase/firestore'
  import { db } from '@/firebase'
  import { useToast } from 'vue-toastification'
  
  const toast = useToast()
  
  const exportOrdersAsJSON = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'orders'))
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
      const blob = new Blob([JSON.stringify(orders, null, 2)], {
        type: 'application/json'
      })
  
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.json'
      a.click()
      URL.revokeObjectURL(url)
  
      toast.success(`Exported ${orders.length} orders!`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to export orders')
    }
  }
  </script>