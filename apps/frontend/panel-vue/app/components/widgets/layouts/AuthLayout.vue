<script setup lang="ts">
const { h1 } = defineProps<{ h1?: string }>()
</script>

<template>
  <v-card-title
    class="text-center text-headline-medium pb-4"
    tag="h1"
  >
    {{ h1 }}
  </v-card-title>
  <slot />
</template>
