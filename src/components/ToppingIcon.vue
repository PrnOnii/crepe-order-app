<template>
    <div
      @click="$emit('toggle')"
      class="flex flex-col items-center justify-center border rounded-lg p-3 cursor-pointer transition select-none"
      :class="{
        'bg-green-100 border-green-400': selected,
        'hover:bg-gray-100': !selected
      }"
    >
      <div class="text-2xl">{{ icon }}</div>
      <div class="mt-1 text-center text-sm font-semibold">{{ label }}</div>
      <div class="text-xs text-gray-500">{{ jpLabel }}</div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    label: String,       // English name
    jpLabel: String,     // Japanese name
    icon: String,
    selected: Boolean
  })
  
  defineEmits(['toggle'])
  </script>
  