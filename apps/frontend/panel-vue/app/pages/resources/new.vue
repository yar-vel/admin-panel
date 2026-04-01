<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('newResource'),
  meta: [
    { name: 'description', content: t('newResource') },
  ],
})

const router = useRouter()
</script>

<template>
  <PanelLayout :h1="$t('newResource')">
    <ResourceCreate @create="router.push(ROUTES.ui.resource($event.id))" />
  </PanelLayout>
</template>
