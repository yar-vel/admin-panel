<script setup lang="ts">
const profileStore = useProfileStore()
</script>

<template>
  <p class="text-body-1 pb-3">
    {{ profileStore.profile?.roles?.map((role) => role.name).join(', ') || $t('empty') }}
  </p>
</template>
