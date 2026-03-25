<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signIn',
  title: 'signIn',
  description: 'signIn',
})
</script>

<template>
  <SignInForm />
</template>
