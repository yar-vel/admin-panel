<script setup lang="ts">
import type { SubmitEventPromise } from 'vuetify'

defineEmits<{
  submit: [value: SubmitEventPromise]
}>()
</script>

<template>
  <v-form
    class="w-100"
    validate-on="lazy"
    @submit.prevent="$emit('submit', $event)"
  >
    <slot />
  </v-form>
</template>
