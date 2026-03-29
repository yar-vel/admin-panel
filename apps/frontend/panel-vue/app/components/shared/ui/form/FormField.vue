<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

const modelValue = defineModel<string>()
const props = defineProps<{
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
  color?: string
  rules?: ((value: string) => boolean | string)[]
  hint?: string
  type?: InputTypeHTMLAttribute
}>()
</script>

<template>
  <v-text-field
    v-bind="props"
    v-model="modelValue"
    :class="props.hint && 'mb-6'"
    density="compact"
    persistent-hint
    variant="outlined"
  />
</template>

<style scoped lang="scss">
:global(label:has(~ input:required)::after) {
  content: "*";
}
</style>
