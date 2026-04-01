<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
})

const { t } = useI18n()

useHead({
  title: t('signInWithGoogle'),
  meta: [
    { name: 'description', content: t('signInWithGoogle') },
  ],
})
</script>

<template>
  <AuthLayout :h1="$t('signInWithGoogle')">
    <SignInGoogleForm />
  </AuthLayout>
</template>
