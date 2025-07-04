<template>
  <div
    @click="!disabled && $emit('toggle')"
    class="flex flex-col items-center justify-center border rounded-lg p-3 cursor-pointer transition select-none text-center"
    :class="[
      selected ? 'bg-green-100 border-green-400' : 'hover:bg-gray-100',
      disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''
    ]"
  >
    <div class="text-2xl">{{ icon }}</div>
    <div class="mt-1 text-sm font-semibold">{{ label }}</div>
    <div class="text-xs text-gray-500">{{ jpLabel }}</div>
    <div v-if="note" class="text-xs text-red-500 font-semibold mt-1">{{ note }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  jpLabel: String,
  icon: String,
  selected: Boolean,
  disabled: Boolean,
  note: String
})

defineEmits(['toggle'])
</script>
