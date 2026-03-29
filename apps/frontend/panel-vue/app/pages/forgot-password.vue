<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
})

const { t } = useI18n()

useHead({
  title: t('forgotPassword'),
  meta: [
    { name: 'description', content: t('forgotPassword') },
  ],
})
</script>

<template>
  <AuthLayout :h1="$t('forgotPassword')">
    <ForgotPasswordForm />
  </AuthLayout>
</template>
