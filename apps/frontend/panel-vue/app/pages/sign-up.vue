<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
})

const { t } = useI18n()

useHead({
  title: t('signUp'),
  meta: [
    { name: 'description', content: t('signUp') },
  ],
})
</script>

<template>
  <AuthLayout :h1="$t('signUp')">
    <SignUpForm />
  </AuthLayout>
</template>
