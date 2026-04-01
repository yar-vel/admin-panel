<script setup lang="ts">
const props = defineProps<{
  title?: string
  text?: string
  type?: 'error' | 'success' | 'warning' | 'info'
}>()
</script>

<template>
  <v-alert
    v-bind="props"
    class="mb-6"
    density="compact"
    variant="tonal"
  />
</template>
