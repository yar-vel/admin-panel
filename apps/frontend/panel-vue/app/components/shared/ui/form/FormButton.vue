<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

const props = defineProps<{
  type?: ButtonHTMLAttributes['type']
  color?: string
  loading?: boolean
  disabled?: boolean
  block?: boolean
  prepandIcon?: string
}>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <v-btn
    v-bind="props"
    class="btn mb-6 mr-3"
    variant="flat"
    @click="$emit('click')"
  >
    <template
      v-if="props.prepandIcon"
      #prepend
    >
      <v-icon :icon="props.prepandIcon" />
    </template>
    <slot />
  </v-btn>
</template>

<style scoped lang="scss">
.btn {
  vertical-align: top;

  &:disabled {
    opacity: 0.5;
  }
}
</style>
