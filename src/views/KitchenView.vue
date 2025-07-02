<template>
  <div class="max-w-4xl mx-auto p-4 space-y-6">
    <!-- Header and Archive Button -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">👨‍🍳 Live Orders</h1>
      <button
        v-if="hasDoneOrders"
        @click="archiveAllDone"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
      >
        Archive All Done
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="orders.length === 0" class="text-center text-gray-500">
      No orders yet.
    </div>

    <!-- Orders Grid -->
    <transition-group
      name="fade"
      tag="div"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @start="advanceStatus"
        @done="advanceStatus"
        @archive="archiveOrder"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, writeBatch
} from 'firebase/firestore'
import { db } from '@/firebase'
import OrderCard from '@/components/OrderCard.vue'

const orders = ref([])

onMounted(() => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'asc'))
  onSnapshot(q, snapshot => {
    orders.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(order => !order.archived)
  })
})

const hasDoneOrders = computed(() =>
  orders.value.some(order => order.status === 'done')
)

const archiveAllDone = async () => {
  const batch = writeBatch(db)
  orders.value.forEach(order => {
    if (order.status === 'done' && !order.archived) {
      batch.update(doc(db, 'orders', order.id), { archived: true })
    }
  })
  await batch.commit()
}

const advanceStatus = async (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (!order) return

  const next =
    order.status === 'pending' ? 'in-progress' :
    order.status === 'in-progress' ? 'done' :
    'done'

  await updateDoc(doc(db, 'orders', orderId), { status: next })
}

const archiveOrder = async (orderId) => {
  await updateDoc(doc(db, 'orders', orderId), { archived: true })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
