<script setup lang="ts">
defineProps<{
  href?: string
  text: string
}>()
defineEmits<{
  click: [value: MouseEvent]
}>()
</script>

<template>
  <NuxtLink
    class="link d-block mb-6 text-center text-decoration-none"
    :href="href"
    @click.capture="$emit('click', $event)"
  >
    {{ text }}
  </NuxtLink>
</template>

<style scoped lang="scss">
.link+.link {
  margin-top: -12px !important;
}
</style>
