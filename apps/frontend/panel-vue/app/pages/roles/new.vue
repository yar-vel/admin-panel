<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'panel',
})

const { t } = useI18n()

useHead({
  title: t('newRole'),
  meta: [
    { name: 'description', content: t('newRole') },
  ],
})

const router = useRouter()
</script>

<template>
  <PanelLayout :h1="$t('newRole')">
    <RoleCreate @create="router.push(ROUTES.ui.role($event.id))" />
  </PanelLayout>
</template>
