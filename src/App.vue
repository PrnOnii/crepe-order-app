<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue' // ✅ THIS WAS MISSING

const route = useRoute()
const isCustomerView = computed(() => route.query.view === 'customer')
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <nav
      v-if="!isCustomerView"
      class="bg-gray-800 text-white px-4 py-2 flex gap-4"
    >
      <RouterLink
        to="/order"
        class="hover:underline"
        :class="{ 'font-bold underline': $route.path === '/order' }"
      >
        🧾 Order
      </RouterLink>
      <RouterLink
        to="/kitchen"
        class="hover:underline"
        :class="{ 'font-bold underline': $route.path === '/kitchen' }"
      >
        👨‍🍳 Kitchen
      </RouterLink>
      <RouterLink
        to="/history"
        class="hover:underline"
        :class="{ 'font-bold underline': $route.path === '/history' }"
      >
        📜 History
      </RouterLink>
      <RouterLink
        to="/queue"
        class="hover:underline"
        :class="{ 'font-bold underline': $route.path === '/queue' }"
      >
        📢 Queue
      </RouterLink>
    </nav>

    <main class="p-4 sm:p-6 lg:p-8">
      <router-view />
    </main>
  </div>
</template>
