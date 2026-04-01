<script setup lang="ts">
const modelValue = defineModel<boolean>()
const props = defineProps<{
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
}>()
</script>

<template>
  <v-checkbox
    v-model="modelValue"
    v-bind="props"
    class="checkbox"
    density="compact"
    persistent-hint
  />
</template>

<style scoped lang="scss">
.checkbox {
  &+& {
    margin-top: -16px !important;
  }
}

:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
