<template>
  <div v-for="group in groups" :key="group.key || group.label">
    <h2 :class="titleClass">{{ group.label }}</h2>
    <div :class="gridClass">
      <template v-for="topping in group.items" :key="topping.label">
        <slot name="item" :group="group" :topping="topping" />
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    required: true
  },
  titleClass: {
    type: String,
    default: 'font-semibold mb-2'
  },
  gridClass: {
    type: String,
    default: 'grid grid-cols-3 sm:grid-cols-4 gap-4'
  }
})
</script>