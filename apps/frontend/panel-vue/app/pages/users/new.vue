<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('newUser'),
  meta: [
    { name: 'description', content: t('newUser') },
  ],
})

const router = useRouter()
</script>

<template>
  <PanelLayout :h1="$t('newUser')">
    <UserCreate @create="router.push(ROUTES.ui.user($event.id))" />
  </PanelLayout>
</template>
