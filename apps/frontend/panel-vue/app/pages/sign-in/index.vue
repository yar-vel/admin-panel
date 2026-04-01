<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
})

const { t } = useI18n()

useHead({
  title: t('signIn'),
  meta: [
    { name: 'description', content: t('signIn') },
  ],
})
</script>

<template>
  <AuthLayout :h1="$t('signIn')">
    <SignInForm />
  </AuthLayout>
</template>
