<script setup lang="ts">
const { h1 } = defineProps<{ h1?: string }>()
</script>

<template>
  <v-card-title
    class="px-6 pt-3 pb-6"
    tag="h1"
  >
    {{ h1 }}
  </v-card-title>
  <v-card-text class="px-6 py-0 d-flex flex-column">
    <slot />
  </v-card-text>
</template>
