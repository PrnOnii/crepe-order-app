<template>
    <div
      class="bg-white shadow-md rounded-2xl p-4 space-y-3 w-full max-w-md mx-auto transition duration-300 transform hover:scale-[1.01]"
    >
      <!-- Order ID and status -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          Order #
          {{ order.orderId ?? order.id?.slice(0, 6) ?? '...' }}
        </h3>
        <span
          class="text-xs font-semibold px-2 py-1 rounded-full"
          :class="{
            'bg-yellow-100 text-yellow-700': order.status === 'pending',
            'bg-blue-100 text-blue-700': order.status === 'in-progress',
            'bg-green-100 text-green-700': order.status === 'done',
          }"
        >
          {{
            order.status === 'pending' ? '🕒 Waiting' :
            order.status === 'in-progress' ? '🔄 In Progress' :
            '✅ Done'
          }}
        </span>
      </div>
  
      <!-- Order content -->
      <div class="text-sm text-gray-700 space-y-1">
        <div v-if="order.name"><strong>Name:</strong> {{ order.name }}</div>
        <div><strong>Toppings:</strong> {{ order.toppings.join(', ') }}</div>
        <div v-if="order.note"><strong>Note:</strong> {{ order.note }}</div>
      </div>
  
      <!-- Action buttons -->
      <div class="flex flex-wrap justify-end gap-2 pt-2">
        <button
          v-if="order.status === 'pending'"
          class="bg-blue-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-blue-600 transition"
          @click="$emit('start', order.id)"
        >
          Start
        </button>
  
        <button
          v-if="order.status === 'in-progress'"
          class="bg-green-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-green-600 transition"
          @click="$emit('done', order.id)"
        >
          Complete
        </button>
  
        <button
          class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-xl text-sm hover:bg-gray-300 transition"
          @click="$emit('archive', order.id)"
        >
          Archive
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    order: {
      type: Object,
      required: true,
    },
  })
  defineEmits(['start', 'done', 'archive'])
  </script>
  