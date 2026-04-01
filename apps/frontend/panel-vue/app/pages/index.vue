<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('home'),
  meta: [
    { name: 'description', content: t('home') },
  ],
})
</script>

<template>
  <PanelLayout :h1="$t('home')">
    <div />
  </PanelLayout>
</template>
