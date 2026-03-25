<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
  name: 'signInWithGoogle',
  title: 'signInWithGoogle',
  description: 'signInWithGoogle',
})
</script>

<template>
  <SignInGoogleForm />
</template>
