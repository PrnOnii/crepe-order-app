<template>
    <div class="max-w-4xl mx-auto p-4 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">📜 Order History</h1>
        <div class="flex gap-2">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            @click="resetOrderCounterHandler"
          >
            Reset Order Counter
          </button>
          <button
            class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
            @click="clearAllHistory"
          >
            Clear All
          </button>
        </div>
      </div>
  
      <div v-if="orders.length === 0" class="text-center text-gray-500">
        No archived orders yet.
      </div>
  
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @archive="deleteOrder"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc
  } from 'firebase/firestore'
  import { db } from '@/firebase'
  import OrderCard from '@/components/OrderCard.vue'
  import { resetOrderCounter } from '@/utils/orderCounter'
  
  const orders = ref([])
  
  onMounted(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'asc'))
    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.archived)
    })
  })
  
  const deleteOrder = async (orderId) => {
    await deleteDoc(doc(db, 'orders', orderId))
  }
  
  const clearAllHistory = async () => {
    const deletions = orders.value.map(order => deleteDoc(doc(db, 'orders', order.id)))
    await Promise.all(deletions)
  }
  
  const resetOrderCounterHandler = async () => {
    if (confirm('Are you sure you want to reset the order counter?')) {
      await resetOrderCounter()
      alert('Order counter reset.')
    }
  }
  </script>
  